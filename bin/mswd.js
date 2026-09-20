#!/usr/bin/env node
/**
 * mswd CLI – manage lab experiments after `npm install mswd`
 *
 * Usage:
 *   npx mswd list
 *   npx mswd add exp01,exp05 [--dest .] [--overwrite]
 *   npx mswd init --only exp01,exp05   # alias for add
 *   npx mswd --1 --5                    # dash shorthand for exp01, exp05
 *   npx mswd add --1 --14 --dest ./labs
 *
 * Options:
 *   --dest <path>     destination root (default: cwd / INIT_CWD)
 *   --overwrite       overwrite existing dirs
 *   --dry-run         show what would be copied without writing
 */

const fs = require('fs');
const path = require('path');

const MANIFEST_PATH = path.join(__dirname, '..', 'experiments.json');
function loadManifest() {
  try {
    return JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
  } catch (e) {
    console.error(`[mswd] cannot read experiments.json: ${e.message}`);
    process.exit(1);
  }
}

function parseExpsArg(raw, manifest) {
  if (!raw) return manifest.map(m => m.dir);
  const tokens = String(raw).split(/[,\s]+/).map(s => s.trim().toLowerCase()).filter(Boolean);
  if (tokens.includes('all')) return manifest.map(m => m.dir);

  const byId = new Map();
  const byDir = new Map();
  const byShort = new Map();
  for (const m of manifest) {
    byId.set(m.id.toLowerCase(), m.dir);
    byDir.set(m.dir.toLowerCase(), m.dir);
    const num = m.id.replace(/^exp/i, '').toLowerCase();
    byShort.set(num, m.dir);
    byShort.set(num.padStart(2, '0'), m.dir);
    if (/^[0-9]+$/.test(num)) {
      byShort.set(String(parseInt(num, 10)), m.dir);
    }
  }
  const selected = new Set();
  const unknown = [];
  for (const t of tokens) {
    let dir = byId.get(t) || byDir.get(t) || byShort.get(t) || byShort.get(t.replace(/^exp/i, '')) || null;
    if (dir) selected.add(dir);
    else unknown.push(t);
  }
  if (unknown.length) console.warn(`[mswd] WARN unknown ids ignored: ${unknown.join(', ')}`);
  if (selected.size === 0) {
    console.warn('[mswd] no valid ids – using all');
    return manifest.map(m => m.dir);
  }
  return [...selected];
}

function copyDirSync(src, dest) {
  if (fs.cpSync) fs.cpSync(src, dest, { recursive: true, force: true });
  else {
    fs.mkdirSync(dest, { recursive: true });
    for (const e of fs.readdirSync(src, { withFileTypes: true })) {
      const s = path.join(src, e.name);
      const d = path.join(dest, e.name);
      if (e.isDirectory()) copyDirSync(s, d);
      else fs.copyFileSync(s, d);
    }
  }
}

function printList(manifest) {
  console.log('\nAvailable experiments (mswd):\n');
  const pad = Math.max(...manifest.map(m => m.id.length)) + 2;
  for (const m of manifest) {
    const flag = m.hasPackageJson ? ' (has package.json – run `npm install` inside)' : '';
    console.log(`  ${m.id.padEnd(pad)} ${m.dir.padEnd(30)} – ${m.title}${flag}`);
  }
  console.log('\nUsage:');
  console.log('  npx mswd add exp01,exp05            # copy to current project root');
  console.log('  npx mswd --1 --5                    # dash shorthand (exp01, exp05)');
  console.log('  npx mswd add exp14 --dest ./labs --overwrite');
  console.log('  MSWD_EXPS=exp01,exp05 npm install mswd');
  console.log('  npm install mswd --mswd_exps=exp01,exp05');
  console.log('  npm install mswd --1 --5            # shorthand (requires -- before -1 on some shells)');
  console.log('');
}

function printHelp() {
  console.log(`
mswd – MSWD SEC Lab experiments

Commands:
  list                          Show all experiments
  add <exps>                    Copy experiments to project (comma-separated)
  init --only <exps>            Alias for add
  --1, --2 ... --15, --11a      Dash shorthand (exp01 etc.) – can be used with npx mswd directly

Options:
  --dest <path>                 Destination root (default: cwd)
  --overwrite                   Overwrite existing dirs
  --dry-run                     Preview without copying
  -h, --help                    Show help

Examples:
  npx mswd list
  npx mswd add exp01,exp05
  npx mswd --1 --5                    # shorthand for exp01, exp05
  npx mswd add --1 --14 --overwrite
  npx mswd init --only exp01 --dest ./labs
  MSWD_EXPS=exp01 npm install mswd
  npm install mswd --1 --5            # selective via postinstall dash flags
`);
}

function getArgValue(args, flags) {
  for (let i = 0; i < args.length; i++) {
    for (const f of flags) {
      if (args[i] === f && i + 1 < args.length) return args[i + 1];
      if (args[i].startsWith(f + '=')) return args[i].slice(f.length + 1);
    }
  }
  return null;
}

function hasFlag(args, ...flags) {
  return args.some(a => flags.includes(a));
}

function collectDashExpArgs(args) {
  const dash = [];
  for (const a of args) {
    const s = String(a).replace(/^--?/, '').toLowerCase();
    if (/^\d+[a-z]?$/.test(s) || /^0\d+[a-z]?$/.test(s)) dash.push(s);
  }
  return dash;
}

function main() {
  const args = process.argv.slice(2);
  const manifest = loadManifest();
  const pkgDir = path.resolve(__dirname, '..');

  if (args.length === 0 || hasFlag(args, '-h', '--help', 'help')) {
    printHelp();
    return;
  }

  const cmd = args[0].toLowerCase();

  if (cmd === 'list' || cmd === 'ls') {
    printList(manifest);
    return;
  }

  // dash shorthand without explicit `add`: `npx mswd --1 --5`
  const dashDirect = collectDashExpArgs(args);
  if (dashDirect.length && !['add', 'init', 'list', 'ls'].includes(cmd)) {
    // treat as implicit `add` with dash flags
    const dashRaw = dashDirect.join(',');
    const destArg = getArgValue(args, ['--dest', '--out', '--target']);
    const destRoot = destArg ? path.resolve(destArg) : process.cwd();
    const overwrite = hasFlag(args, '--overwrite', '--force', '-f');
    const dryRun = hasFlag(args, '--dry-run');
    const dirs = parseExpsArg(dashRaw, manifest);
    console.log(`[mswd] ${dryRun ? '(dry-run) ' : ''}copying ${dirs.length} experiment(s) to ${destRoot}: ${dirs.join(', ')}`);
    let copied = 0, skipped = 0;
    for (const dir of dirs) {
      const src = path.join(pkgDir, dir);
      const dest = path.join(destRoot, dir);
      if (!fs.existsSync(src)) { console.warn(`[mswd] source missing: ${dir}`); continue; }
      if (fs.existsSync(dest) && !overwrite) { console.log(`[mswd] exists, skipping (use --overwrite): ${dest}`); skipped++; continue; }
      if (dryRun) { console.log(`[mswd] would copy ${dir} -> ${dest}`); copied++; continue; }
      try { copyDirSync(src, dest); console.log(`[mswd] copied ${dir}`); copied++; } catch (e) { console.warn(`[mswd] failed ${dir}: ${e.message}`); }
    }
    const needDeps = dirs.filter(d => d === 'exp14-express-student-app' || d === 'exp15-mongo-express-crud');
    if (needDeps.length && !dryRun) { console.log('\n[mswd] Node exps copied – install deps manually:'); for (const d of needDeps) console.log(`  cd ${path.join(destRoot, d)} && npm install`); }
    console.log(`\n[mswd] done – copied ${copied}, skipped ${skipped}${dryRun ? ' (dry-run)' : ''}`);
    return;
  }

  if (cmd === 'add' || cmd === 'init') {
    // collect exps: `add exp01,exp02` or `add --only exp01` or `init --only exp01` or `add --1 --5`
    let rawExps = null;
    // positional second arg if not a flag
    if (args[1] && !args[1].startsWith('-')) rawExps = args[1];
    // dash numeric flags (--1, --5, --11a)
    const dashFlags = collectDashExpArgs(args);
    // --only
    const onlyVal = getArgValue(args, ['--only', '--exps', '--exp', '--experiments']);
    if (onlyVal) rawExps = onlyVal;
    // --mswd_exps compat
    const mswdVal = getArgValue(args, ['--mswd_exps', '--mswd-exps']);
    if (mswdVal) rawExps = mswdVal;
    if (dashFlags.length) {
      const dashRaw = dashFlags.join(',');
      rawExps = [rawExps, dashRaw].filter(Boolean).join(',');
    }

    const destArg = getArgValue(args, ['--dest', '--out', '--target']);
    const destRoot = destArg ? path.resolve(destArg) : process.cwd();
    const overwrite = hasFlag(args, '--overwrite', '--force', '-f');
    const dryRun = hasFlag(args, '--dry-run');

    const dirs = parseExpsArg(rawExps, manifest);
    console.log(`[mswd] ${dryRun ? '(dry-run) ' : ''}copying ${dirs.length} experiment(s) to ${destRoot}: ${dirs.join(', ')}`);

    let copied = 0, skipped = 0;
    for (const dir of dirs) {
      const src = path.join(pkgDir, dir);
      const dest = path.join(destRoot, dir);
      if (!fs.existsSync(src)) {
        console.warn(`[mswd] source missing: ${dir}`);
        continue;
      }
      if (fs.existsSync(dest) && !overwrite) {
        console.log(`[mswd] exists, skipping (use --overwrite): ${dest}`);
        skipped++;
        continue;
      }
      if (dryRun) {
        console.log(`[mswd] would copy ${dir} -> ${dest}`);
        copied++;
        continue;
      }
      try {
        copyDirSync(src, dest);
        console.log(`[mswd] copied ${dir}`);
        copied++;
      } catch (e) {
        console.warn(`[mswd] failed ${dir}: ${e.message}`);
      }
    }

    const needDeps = dirs.filter(d => d === 'exp14-express-student-app' || d === 'exp15-mongo-express-crud');
    if (needDeps.length && !dryRun) {
      console.log('\n[mswd] Node exps copied – install deps manually (as requested):');
      for (const d of needDeps) console.log(`  cd ${path.join(destRoot, d)} && npm install`);
    }
    console.log(`\n[mswd] done – copied ${copied}, skipped ${skipped}${dryRun ? ' (dry-run)' : ''}`);
    return;
  }

  console.error(`[mswd] unknown command: ${cmd}`);
  printHelp();
  process.exit(1);
}

main();
