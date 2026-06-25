import fs from 'node:fs';
import path from 'node:path';
const SKIP = new Set(['node_modules','.next','.git','.omc','.agents','.claude','.cursor','.codex','.superpowers','.windsurf','.turbo','.ai-bridge','uploads','dist','coverage','public']);
const pat = /locale\s*===\s*['"]zh['"]\s*\?\s*['"][^'"\n]{1,30}['"]/g;
const found = [];
function walk(d){
  for(const e of fs.readdirSync(d,{withFileTypes:true})){
    if(SKIP.has(e.name)) continue;
    const p = path.join(d,e.name);
    if(e.isDirectory()){ try{walk(p);}catch{} }
    else if(/\.(ts|tsx|js|jsx)$/.test(e.name)){
      try{
        const t = fs.readFileSync(p,'utf8');
        let m;
        while((m = pat.exec(t))){
          found.push({file: p, snippet: m[0]});
        }
      }catch{}
    }
  }
}
walk('apps/web');
console.log('Inline isZh ternaries:', found.length);
found.slice(0,30).forEach(f=>console.log(' -', f.file, '::', f.snippet));
