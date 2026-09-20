# mswd – SEC Lab Experiments (jQuery / Bootstrap / Angular / Node / Express / Mongo)

16 dirs (15 experiments) from `moah0911/mswd`. Installs to **project root** on `npm install`, with optional selective install.

Package is published as scoped `@hunting.vector/mswd` (unscoped `mswd` blocked by registry similarity). Use `npm install @hunting.vector/mswd` – unscoped `mswd` also documented for local/tarball use.

## Install

**All experiments (default):**
```bash
npm install @hunting.vector/mswd
# copies exp01..exp15 to your project root (./exp01-jquery-selectors etc.)
# also works as: npm install mswd  (when using local tarball)
```

**Only specific experiments:**

Option A – env var (works on all npm versions):
```bash
MSWD_EXPS=exp01,exp05 npm install @hunting.vector/mswd
MSWD_EXPS=exp01,exp02,exp14 npm install @hunting.vector/mswd
MSWD_EXPS=all npm install @hunting.vector/mswd
```

Option B – npm config:
```bash
npm install @hunting.vector/mswd --mswd_exps=exp01,exp05
npm install @hunting.vector/mswd --mswd_exps=exp14,exp15
```

Option C – dash shorthand (new):
```bash
npm install @hunting.vector/mswd --1                 # exp01
npm install @hunting.vector/mswd --2                 # exp02
npm install @hunting.vector/mswd --1 --5 --14        # exp01, exp05, exp14
npm install @hunting.vector/mswd --1 --5 --mswd_exps=exp14  # mixed
npm install @hunting.vector/mswd --11a               # exp11a-node-calculator
npm install @hunting.vector/mswd --11b --02           # exp11b + exp02 (dash keeps leading zero)
```

Accepted ids: `exp01` / `01` / `1` / `exp01-jquery-selectors` / `--1` (case-insensitive, comma/space separated). Examples:
- `exp11a` / `--11a` → `exp11a-node-calculator`
- `11b` / `--11b` → `exp11b-node-student-module`
- `14` / `--14` → `exp14-express-student-app`

**Controls:**
```bash
MSWD_OVERWRITE=1 npm install @hunting.vector/mswd --1          # overwrite existing dirs
MSWD_SKIP_POSTINSTALL=1 npm install @hunting.vector/mswd        # install pkg only, no copy
MSWD_DEST=/tmp/labs npm install @hunting.vector/mswd --1 --5    # custom destination
```

## CLI (after install)

```bash
npx mswd list
npx mswd add exp01,exp05
npx mswd --1 --5                         # dash shorthand (implicit add)
npx mswd add --1 --14 --dest ./labs --overwrite
npx mswd add exp01 --dest ./labs --overwrite
npx mswd init --only exp14,exp15 --dest .
npx mswd add exp01 --dry-run
npx mswd --1 --dry-run
# CLI also works via npx: npx @hunting.vector/mswd list (if installed scoped)
```

## Node Experiments

`exp14-express-student-app` and `exp15-mongo-express-crud` have their own `package.json`. Dependencies are **not** auto-installed (per package config). After copy:

```bash
cd exp14-express-student-app && npm install
cd exp15-mongo-express-crud && npm install
```

## Publishing (maintainer)

```bash
npm pack --dry-run   # inspect files (should exclude nested node_modules)
export NPM_TOKEN=<new token>   # never commit token
echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" > ~/.npmrc
npm publish --access public
```
