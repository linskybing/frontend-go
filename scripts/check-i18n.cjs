#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function walk(dir, exts = ['.ts', '.tsx', '.js', '.jsx']){
  const res = [];
  for(const name of fs.readdirSync(dir)){
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if(st.isDirectory()) res.push(...walk(p, exts));
    else if(exts.includes(path.extname(p))) res.push(p);
  }
  return res;
}

function extractKeysFromFiles(root){
  const files = walk(root);
  const re = /t\((['"])((?:\\.|(?!\1).)+)\1\)/g;
  const keys = new Set();
  for(const f of files){
    try{
      const s = fs.readFileSync(f,'utf8');
      let m;
      while((m = re.exec(s))){
        keys.add(m[2]);
      }
    }catch(e){ /* ignore read errors */ }
  }
  return Array.from(keys).sort();
}

function loadLocaleObject(){
  const builtPath = path.join(process.cwd(),'build/utils/i18n/locales/en.js');
  if(fs.existsSync(builtPath)){
    return require(builtPath).default || require(builtPath);
  }
  const srcPath = path.join(process.cwd(),'packages/utils/src/i18n/locales/en.ts');
  if(!fs.existsSync(srcPath)) return null;
  const src = fs.readFileSync(srcPath,'utf8');
  try{
    const clean = src.replace(/as const;?/, '');
    eval(clean + '\nmodule.exports = en;');
    return module.exports;
  }catch(e){
    return null;
  }
}

function hasKey(obj, pathParts){
  let cur = obj;
  for(const p of pathParts){
    if(cur && Object.prototype.hasOwnProperty.call(cur,p)) cur = cur[p];
    else return false;
  }
  return true;
}

function main(){
  const srcRoot = path.join(process.cwd(),'src');
  if(!fs.existsSync(srcRoot)){
    console.error('src/ not found, run from project root');
    process.exit(2);
  }

  const usedKeys = extractKeysFromFiles(srcRoot);
  const locale = loadLocaleObject();
  if(!locale){
    console.error('Failed to load built locale (build/utils/i18n/locales/en.js) and fallback parse failed.');
    process.exit(3);
  }

  const missing = [];
  for(const key of usedKeys){
    if(!/^[a-zA-Z0-9_.{}\-:,]+$/.test(key)) continue;
    const parts = key.split('.');
    if(hasKey(locale, parts)) continue;
    if(Object.prototype.hasOwnProperty.call(locale, key)) continue;
    missing.push(key);
  }

  console.log('Found', usedKeys.length, 'translation usages. Missing keys:', missing.length);
  for(const m of missing) console.log(m);
  process.exit(0);
}

main();
