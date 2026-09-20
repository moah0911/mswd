#!/usr/bin/env node
/**
 * postinstall – selective experiment materialization
 *
 * Default: copy ALL experiments to project root (INIT_CWD).
 * Selective:
 *   MSWD_EXPS=exp01,exp05 npm install mswd
 *   npm install mswd --mswd_exps=exp01,exp05        # -> npm_config_mswd_exps
 *   npm install mswd --1 --5                        # -> npm_config_1, npm_config_5 (shorthand)
 *   npm install mswd --1 --14 --mswd_exps=exp02    # mixed union
 *   npm_config_mswd_exps=exp01 npm install mswd     # direct env
 *
 * Env controls:
 *   MSWD_SKIP_POSTINSTALL=1   – skip copy (e.g. during `npm pack`, CI, or inside `mswd` itself)
 *   MSWD_OVERWRITE=1          – overwrite existing destination dirs
 *   MSWD_DEST=/custom/path    – override destination root
 */

const fs = require('fs');
const path = require('path');

function log(msg) {
  console.log(`[mswd] ${msg}`);
}

function warn(msg) {
  console.warn(`[mswd] WARN: ${msg}`);
}

function isInsidePackagePublish() {
  // npm pack / publish runs postinstall with npm_lifecycle_event etc but no INIT_CWD pointing to consumer
  // If we are being installed as the package itself (cwd contains experiments.json at top level), skip copy when no consumer INIT_CWD
  // Heuristic: if INIT_CWD is same as package dir, we're in dev mode – skip.
  try {
    const pkgDir = path.resolve(__dirname, '..');
    const initCwd = process.env.INIT_CWD;
    if (!initCwd) return false;
    if (path.resolve(initCwd) === pkgDir) return true;
  } catch {}
  return false;
}

function getProjectRoot() {
  if (process.env.MSWD_DEST) return path.resolve(process.env.MSWD_DEST);
  if (process.env.INIT_CWD) return path.resolve(process.env.INIT_CWD);
  // fallback: walk up from __dirname to find nearest package.json not this one
  // npm <7 had different env; use cwd
  const cwd = process.cwd();
  // if cwd ends with node_modules/mswd or node_modules/@hunting.vector/mswd, go up
  if (cwd.includes(path.join('node_modules', 'mswd')) || cwd.includes(path.join('node_modules', '@hunting.vector', 'mswd'))) {
    // for scoped, go up 3 levels, for unscoped 2 – use heuristic: find node_modules segment
    if (cwd.includes(path.join('@hunting.vector', 'mswd'))) return path.resolve(cwd, '..', '..', '..');
    return path.resolve(cwd, '..', '..');
  }
  return path.resolve(cwd);
}

function loadManifest() {
  const manifestPath = path.join(__dirname, '..', 'experiments.json');
  try {
    const raw = fs.readFileSync(manifestPath, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    warn(`cannot read experiments.json: ${e.message}`);
    return [];
  }
}

function parseExps(raw, manifest) {
  if (!raw) return null;
  const tokens = String(raw)
    .split(/[,\s]+/)
    .map(s => s.trim().toLowerCase())
    .filter(Boolean);

  if (tokens.length === 0) return null;
  if (tokens.includes('all')) return manifest.map(m => m.dir);

  const byId = new Map();
  const byDir = new Map();
  const byShortNum = new Map(); // "01" -> dir, "1" -> dir for pure numeric ids
  for (const m of manifest) {
    byId.set(m.id.toLowerCase(), m.dir);
    byDir.set(m.dir.toLowerCase(), m.dir);
    const num = m.id.replace(/^exp/i, '').toLowerCase();
    byShortNum.set(num, m.dir);
    byShortNum.set(num.padStart(2, '0'), m.dir);
    // allow bare number without leading zero for pure-numeric ids (exp01 -> "1")
    if (/^[0-9]+$/.test(num)) {
      byShortNum.set(String(parseInt(num, 10)), m.dir);
    }
  }

  const selected = new Set();
  const unknown = [];
  for (const t of tokens) {
    let dir = null;
    if (byId.has(t)) dir = byId.get(t);
    else if (byDir.has(t)) dir = byDir.get(t);
    else if (byShortNum.has(t)) dir = byShortNum.get(t);
    else if (byShortNum.has(t.replace(/^exp/i, ''))) dir = byShortNum.get(t.replace(/^exp/i, ''));
    // also allow "exp01-jquery-selectors" partial? already byDir
    // allow "1" or "01" or "11a"
    if (dir) selected.add(dir);
    else unknown.push(t);
  }
  if (unknown.length) warn(`unknown experiments ignored: ${unknown.join(', ')}`);
  if (selected.size === 0) {
    warn('no valid experiments matched; installing all');
    return null;
  }
  return [...selected];
}

function copyDirSync(src, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  // Node 16+ has cpSync
  if (fs.cpSync) {
    fs.cpSync(src, dest, { recursive: true, force: true });
  } else {
    // fallback manual
    fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
      const s = path.join(src, entry.name);
      const d = path.join(dest, entry.name);
      if (entry.isDirectory()) copyDirSync(s, d);
      else fs.copyFileSync(s, d);
    }
  }
}

function main() {
  if (process.env.MSWD_SKIP_POSTINSTALL === '1' || process.env.MSWD_SKIP_POSTINSTALL === 'true') {
    log('MSWD_SKIP_POSTINSTALL set – skipping postinstall copy');
    return;
  }
  if (isInsidePackagePublish()) {
    log('detected dev/publish context (INIT_CWD == package dir) – skipping root copy');
    return;
  }

  const manifest = loadManifest();
  if (!manifest.length) {
    warn('empty manifest – nothing to install');
    return;
  }

  // read selector from env / npm config + dash shorthand (--1, --5, --11a etc.)
  function collectDashFlags() {
    const dash = [];
    // npm sets npm_config_<key> for --<key>; e.g. --1 => npm_config_1=true, --11a => npm_config_11a=true
    for (const [k, v] of Object.entries(process.env)) {
      const m = k.match(/^npm_config_(\d+[a-z]?)$/i);
      if (m && (v === 'true' || v === '' || v === '1')) {
        dash.push(m[1].toLowerCase());
      }
      // also allow padded form npm_config_01
      const m2 = k.match(/^npm_config_(0\d+[a-z]?)$/i);
      if (m2 && (v === 'true' || v === '' || v === '1')) {
        dash.push(m2[1].toLowerCase());
      }
    }
    // fallback: npm_config_argv contains original argv (npm v6/v7)
    if (process.env.npm_config_argv) {
      try {
        const argv = JSON.parse(process.env.npm_config_argv);
        const orig = argv.original || argv.cooked || [];
        for (const a of orig) {
          const s = String(a).replace(/^--?/, '').toLowerCase();
          if (/^\d+[a-z]?$/.test(s) || /^0\d+[a-z]?$/.test(s)) {
            // only treat as exp flag if matches known manifest ids to avoid false positives from other flags
            if (/^(\d{1,2}[a-z]?|0\d[a-z]?)$/.test(s)) dash.push(s);
          }
        }
      } catch {}
    }
    return dash;
  }

  const rawFromEnv =
    process.env.MSWD_EXPS ||
    process.env.mswd_exps ||
    process.env.npm_config_mswd_exps ||
    process.env.npm_config_mswd_exps?.toString() ||
    process.env.npm_config_MSWD_EXPS ||
    null;

  const dashFlags = collectDashFlags();
  const combinedRaw = [rawFromEnv, dashFlags.join(',')].filter(Boolean).join(',');

  let dirsToInstall = null;
  if (combinedRaw) {
    const parsed = parseExps(combinedRaw, manifest);
    if (parsed) dirsToInstall = parsed;
    else dirsToInstall = manifest.map(m => m.dir); // fallback all
  } else {
    dirsToInstall = manifest.map(m => m.dir);
  }
  const raw = combinedRaw || null;

  const pkgDir = path.resolve(__dirname, '..');
  const projectRoot = getProjectRoot();
  const overwrite = process.env.MSWD_OVERWRITE === '1' || process.env.MSWD_OVERWRITE === 'true';

  // Safety: don't copy into package's own node_modules/mswd subdir if projectRoot equals pkgDir
  if (path.resolve(projectRoot) === pkgDir) {
    log('projectRoot == package dir – nothing to copy (dev mode)');
    return;
  }

  log(`project root: ${projectRoot}`);
  log(`installing ${dirsToInstall.length}/${manifest.length} experiment(s): ${dirsToInstall.join(', ')}`);
  if (raw) {
    const via = process.env.MSWD_EXPS ? 'MSWD_EXPS' : dashFlags.length ? (rawFromEnv ? 'MSWD_EXPS+--dash' : '--dash') : 'npm_config_mswd_exps';
    log(`selector: "${raw}" (via ${via})`);
  } else log('no selector – installing all (set MSWD_EXPS or --mswd_exps or --1 to filter)');

  let copied = 0;
  let skipped = 0;
  for (const dir of dirsToInstall) {
    const src = path.join(pkgDir, dir);
    const dest = path.join(projectRoot, dir);
    if (!fs.existsSync(src)) {
      warn(`source missing: ${dir} – skipped`);
      continue;
    }
    if (fs.existsSync(dest) && !overwrite) {
      log(`exists, skipping (use MSWD_OVERWRITE=1 to overwrite): ${dir}`);
      skipped++;
      continue;
    }
    try {
      copyDirSync(src, dest);
      copied++;
      log(`copied ${dir}`);
    } catch (e) {
      warn(`failed to copy ${dir}: ${e.message}`);
    }
  }

  // hint for Node exps with deps
  const needDeps = dirsToInstall.filter(d => d === 'exp14-express-student-app' || d === 'exp15-mongo-express-crud');
  if (needDeps.length) {
    log(`next steps for Node exps: run \`npm install\` inside each:`);
    for (const d of needDeps) log(`  cd ${d} && npm install`);
  }

  log(`done – copied ${copied}, skipped ${skipped} (overwrite=${overwrite})`);
  log(`tip: use \`npx mswd list\`, \`npx mswd add exp01,exp05\` or \`npx mswd --1 --5\` to manage experiments after install`);
}

try {
  main();
} catch (e) {
  // postinstall must not fail npm install
  warn(`postinstall error (non-fatal): ${e.message}`);
  console.error(e);
}
