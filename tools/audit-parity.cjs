const fs=require('node:fs');
const {chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch();
 try{
  const page=await browser.newPage();
  await page.goto('https://sarasinclinic.com/behandelingen/hairfiller/',{waitUntil:'domcontentloaded',timeout:60000});
  const content=await page.evaluate(()=>{
   const root=document.querySelector('main')||document.querySelector('#content')||document.body;
   const norm=s=>s.replace(/\s+/g,' ').trim();
   let heading='Introductie';let counter=0;
   const blocks=[];
   for(const node of root.querySelectorAll('h1,h2,h3,p,li,table')){
    if(node.closest('nav,header,footer')||node.parentElement.closest('table'))continue;
    if(node.tagName==='P'&&node.closest('li'))continue;
    const text=norm(node.innerText||'');if(!text)continue;
    if(/^H[123]$/.test(node.tagName))heading=text;
    blocks.push({id:'SRC-'+String(++counter).padStart(3,'0'),tag:node.tagName,heading,text,rows:node.tagName==='TABLE'?[...node.rows].map(r=>[...r.cells].map(c=>norm(c.innerText))):undefined,links:[...node.querySelectorAll('a[href]')].map(a=>({text:norm(a.innerText),url:a.href}))});
   }
   return {source:location.href,capturedAt:new Date().toISOString(),blocks,headings:[...root.querySelectorAll('h1,h2,h3')].map(n=>norm(n.innerText)),images:[...root.querySelectorAll('img')].map(n=>({src:n.currentSrc||n.src,alt:n.alt})),reviewWidgets:[...document.querySelectorAll('[class*="ti-widget"],[class*="review"]')].filter(n=>n.innerText?.trim()).map(n=>norm(n.innerText)).filter((x,i,a)=>a.indexOf(x)===i)};
  });
  fs.writeFileSync('audit/source-parity-2026-11-08.json',JSON.stringify(content,null,2)+'\n');
  console.log(JSON.stringify({headings:content.headings.length,blocks:content.blocks.length,tables:content.blocks.filter(b=>b.rows).map(b=>({id:b.id,heading:b.heading,rows:b.rows})),reviews:content.reviewWidgets.map(x=>x.slice(0,120))},null,2));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
