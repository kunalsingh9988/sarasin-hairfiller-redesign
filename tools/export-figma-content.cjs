const fs=require('node:fs');
const {chromium}=require('playwright');
(async()=>{const browser=await chromium.launch();try{
 const page=await browser.newPage({reducedMotion:'reduce'});await page.goto('http://127.0.0.1:8773',{waitUntil:'networkidle'});
 const data=await page.evaluate(()=>{
  const text=n=>(n.textContent||'').replace(/\s+/g,' ').replace(/([.!?])([A-Z])/g,'$1 $2').trim();
  function walk(n){
   if(n.nodeType!==1)return[];const tag=n.tagName;
   if(['SVG','SCRIPT','STYLE'].includes(tag)||n.matches('.hero-carousel-controls,.comparison-tags,.menu-backdrop'))return[];
   if(n.matches('.gallery-archive'))return[{kind:'gallery',title:'Alle 40 oorspronkelijke patiëntbeelden',images:[...n.querySelectorAll('img')].map(i=>({kind:'image',src:i.getAttribute('src'),alt:i.alt,w:Number(i.getAttribute('width'))||600,h:Number(i.getAttribute('height'))||600}))}];
   if(n.matches('#broncontrole'))return[{kind:'heading',text:'Volledige broncontrole',level:2},{kind:'paragraph',text:'Alle 139 oorspronkelijke tekstblokken en zeven tabellen zijn behouden in het gekoppelde bronarchief en het aparte Figma-inhoudsoverzicht.'},{kind:'link',text:'Open de volledige inhoudscontrole',url:'https://hairfiller-redesign.vercel.app/#broncontrole'}];
   if(tag==='TABLE')return[{kind:'table',title:n.caption?text(n.caption):'Overzicht',rows:[...n.rows].map(r=>[...r.cells].map(c=>text(c)))}];
   if(tag==='IMG'){if(n.matches('.fact-icon,[src*="/icons/"]'))return[];return[{kind:'image',src:n.getAttribute('src'),alt:n.alt,w:Number(n.getAttribute('width'))||600,h:Number(n.getAttribute('height'))||600}];}
   if(/^H[1-4]$/.test(tag))return[{kind:'heading',text:text(n),level:Number(tag[1])}];
   if(tag==='BLOCKQUOTE')return[{kind:'quote',text:text(n.querySelector('p')),author:text(n.querySelector('cite'))}];
   if(tag==='P'||tag==='LI'||tag==='FIGCAPTION')return text(n)?[{kind:tag==='LI'?'bullet':tag==='FIGCAPTION'?'caption':'paragraph',text:text(n)}]:[];
   if(tag==='DETAILS'){const sum=n.querySelector(':scope>summary');return[{kind:'disclosure',title:sum?text(sum).replace(/\s*\+$/,''):'Meer informatie',items:[...n.children].filter(c=>c!==sum).flatMap(walk)}];}
   if(tag==='A'||tag==='BUTTON'){const imgs=[...n.querySelectorAll('img')].flatMap(walk);const label=text(n).replace(/[↗↓]$/,'').trim();if(!label)return imgs;return[...imgs,{kind:tag==='BUTTON'&&n.dataset.video?'video':n.classList.contains('button')?'button':'link',text:label,url:tag==='A'?n.getAttribute('href'):n.dataset.video?'https://www.youtube.com/watch?v='+n.dataset.video:null}];}
   if(!n.children.length&&['STRONG','SMALL','SPAN'].includes(tag)&&text(n))return[{kind:'paragraph',text:text(n)}];
   return [...n.children].flatMap(walk);
  }
  const sections=[...document.querySelector('main').children].filter(n=>!n.matches('#broncontrole')) .map(n=>({id:n.id||n.className,title:n.querySelector('h1,h2')?text(n.querySelector('h1,h2')):'',bg:getComputedStyle(n).backgroundColor,items:walk(n)})).filter(s=>s.items.length);
  return {sections,sourceBlocks:[...document.querySelectorAll('[data-source-block]')].map(n=>({id:n.dataset.sourceBlock,items:[...n.children].flatMap(walk)}))};
 });fs.writeFileSync('audit/figma-content-2026-11-08.json',JSON.stringify(data,null,2)+'\n');console.log(JSON.stringify({sections:data.sections.map(s=>({id:s.id,items:s.items.length})),sourceBlocks:data.sourceBlocks.length}));
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
