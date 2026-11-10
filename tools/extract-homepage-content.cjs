const fs=require('node:fs');
const {chromium}=require('playwright');
(async()=>{const browser=await chromium.launch();try{
const page=await browser.newPage();const source=require('../audit/source-complete-2026-11-10.json');
await page.setContent('<main>'+source.originalHTML+'</main>',{waitUntil:'domcontentloaded'});
const result=await page.evaluate(()=>{
const esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const norm=s=>s.replace(/\s+/g,' ').trim();const groups=[];let group={title:'',level:0,items:[]};groups.push(group);let n=0;
const inline=new Set(['A','STRONG','EM','B','I','SPAN','BR','SUP','SUB','SMALL','CODE']);
function safe(node){
 if(node.nodeType===3)return esc(node.textContent);if(node.nodeType!==1)return '';
 const tag=node.tagName;if(['SCRIPT','STYLE','NOSCRIPT','TEMPLATE'].includes(tag))return '';
 if(tag==='IMG'){
  const dimensions=['width','height'].map(k=>{const v=node.getAttribute(k);return /^\d+$/.test(v||'')?` ${k}="${v}"`:'';}).join('');
  return `<img src="${esc(node.getAttribute('src')||'')}" alt="${esc(node.getAttribute('alt')||'')}"${dimensions} loading="lazy" decoding="async">`;
 }
 if(tag==='IFRAME')return `<a class="source-embed" href="${esc(node.getAttribute('src')||'')}">${esc(node.title||'Bekijk video')}</a>`;
 const children=[...node.childNodes].map(safe).join('');
 if(tag==='A')return `<a href="${esc(node.getAttribute('href')||'')}"${node.title?` title="${esc(node.title)}"`:''}>${children}</a>`;
 if(tag==='BR')return '<br>';if(tag==='SPAN'&&node.classList.contains('sc-accent'))return ' '+children;
 const allowed=['P','UL','OL','LI','TABLE','CAPTION','THEAD','TBODY','TR','TH','TD','STRONG','EM','B','SUP','SUB','SMALL'];
 let attrs='';if(tag==='TH'||tag==='TD'){
  attrs=['colspan','rowspan'].map(k=>{const v=node.getAttribute(k);return /^\d+$/.test(v||'')?` ${k}="${v}"`:'';}).join('');
  if(tag==='TH')attrs+=` scope="${node.closest('thead')?'col':'row'}"`;
 }
 return allowed.includes(tag)?`<${tag.toLowerCase()}${attrs}>${children}</${tag.toLowerCase()}>`:children;
}
function add(kind,node){let html=safe(node),text=norm(node.textContent||'');if(!text&&!node.querySelector?.('img')&&node.tagName!=='IMG'&&node.tagName!=='IFRAME')return;group.items.push({id:'CONTENT-'+String(++n).padStart(3,'0'),kind,html,text,src:node.getAttribute?.('src')||null,alt:node.getAttribute?.('alt')||null,link:node.closest?.('a')?.getAttribute('href')||null,video:node.closest?.('[data-vc-video-link]')?.getAttribute('data-vc-video-link')||null});}
function walk(node){if(node.nodeType===3){if(norm(node.nodeValue))add('text',node);return;}if(node.nodeType!==1)return;const tag=node.tagName;if(['SCRIPT','STYLE','NOSCRIPT','TEMPLATE'].includes(tag))return;if(/^H[1-6]$/.test(tag)){group={title:norm(node.textContent),level:Number(tag[1]),items:[],headingHTML:safe(node)};groups.push(group);return;}if(['P','UL','OL','TABLE','A','IMG','IFRAME'].includes(tag)){add(tag.toLowerCase(),node);return;}for(const child of node.childNodes)walk(child);}
walk(document.querySelector('main'));return {groups,items:n};});
fs.writeFileSync('content/homepage-source.json',JSON.stringify({source:source.source,capturedAt:source.capturedAt,...result},null,2)+'\n');
console.log(JSON.stringify(result.groups.map((g,i)=>({i,title:g.title,items:g.items.length,images:g.items.filter(x=>x.html.includes('<img')).length})),null,2));
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
