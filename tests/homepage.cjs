const assert=require('node:assert/strict'),fs=require('node:fs');
const {chromium}=require('playwright');
const source=require('../audit/source-complete-2026-11-10.json');
const groups=require('../content/homepage-source.json').groups;
const base=process.argv[2]||'http://localhost:8774';
const norm=s=>s.replace(/\s+/g,' ').trim();
(async()=>{const browser=await chromium.launch();try{
const page=await browser.newPage({reducedMotion:'reduce'});const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(base,{waitUntil:'networkidle'});
const content=norm(await page.locator('main').textContent());
// Keep the complete suitability block together, matching the original clinic page.
assert.equal(await page.locator('#wie .suitability li').count(),5);
assert.equal(await page.locator('#wie [data-video="IJwhkNviX20"]').count(),1);
assert.equal(await page.locator('#wie [data-original-heading="5"]').count(),1);
assert.equal(await page.locator('#wie [data-original-item="CONTENT-024"] img').count(),1);
assert.equal(await page.locator('#wie a[href="https://www.sarasin.shop/products/collageen"]').count(),1);
// The iframe's literal fallback "<br />" is markup, not reader-facing treatment text.
const readerFragments=source.textNodes.filter(x=>!(x.tag==='IFRAME'&&x.text==='<br />'));
const missing=readerFragments.filter(x=>!content.includes(norm(x.text)));assert.deepEqual(missing,[],'Missing source text fragments');
for(let i=1;i<groups.length;i++){assert.equal(await page.locator(`[data-original-heading="${i}"]`).count(),1);assert.equal(norm(await page.locator(`[data-original-heading="${i}"]`).textContent()),groups[i].title);}
assert.equal(await page.locator('[data-original-item]').count(),165);
for(const original of groups.flatMap(g=>g.items)){if(original.kind==='iframe'&&original.text==='<br />')continue;const actual=await page.locator(`[data-original-item="${original.id}"]`).textContent();assert(actual.replace(/\s+/g,'').includes(original.text.replace(/\s+/g,'')),'Changed original item '+original.id);}
assert.equal(await page.locator('[data-original-image]').count(),60);
assert.equal(await page.locator('table').count(),7);
const tables=await page.locator('table').evaluateAll(ns=>ns.map(t=>[...t.rows].map(r=>[...r.cells].map(c=>c.textContent.replace(/\s+/g,' ').trim()))));
for(const original of source.tables)assert(tables.some(t=>JSON.stringify(t)===JSON.stringify(original.rows)),'Original table changed');
const originalLinks=await page.locator('[data-original-item] a').evaluateAll(ns=>ns.map(n=>({url:n.getAttribute('href'),text:n.textContent.replace(/\s+/g,' ').trim()})));
for(const link of source.links){const expected=new URL(link.url,source.source).href;assert(originalLinks.some(l=>new URL(l.url,source.source).href===expected),'Missing source link '+link.url);}
const ids=await page.locator('[id]').evaluateAll(ns=>ns.map(n=>n.id));assert.equal(new Set(ids).size,ids.length,'Duplicate IDs');
for(const href of await page.locator('a[href^="#"]').evaluateAll(ns=>[...new Set(ns.map(n=>n.getAttribute('href')))]))assert(await page.locator(href).count(),'Broken anchor '+href);
assert.deepEqual([...new Set(await page.locator('[data-video]').evaluateAll(ns=>ns.map(n=>n.dataset.video)))].sort(),['IJwhkNviX20','UyxnG7xZq3I','OeLGZdJCpUE','wYIBTb6Cfnw','M76uytFjRjo','J4glhlyh1c4','fZMP_egLUwY','x1Ei7ne13Y4','WdqKQ2NF8t8'].sort());
await page.getByRole('tab',{name:'Alle zeven peptiden'}).click();assert.equal(await page.locator('#panel-peptides').isVisible(),true);assert.equal(await page.locator('#panel-formula').isVisible(),false);
await page.getByRole('tab',{name:'Alle zeven peptiden'}).press('ArrowLeft');assert.equal(await page.locator('#tab-formula').getAttribute('aria-selected'),'true');
const checks=[];
for(const width of [320,360,393,568,700,768,900,1024,1440,1920]){
 await page.setViewportSize({width,height:1000});await page.goto(base,{waitUntil:'networkidle'});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'Overflow '+width);
 const h=await page.locator('h1').boundingBox();assert(h.width<=width,'Heading width');
 await page.locator('details').evaluateAll(ns=>ns.forEach(n=>n.open=true));await page.locator('#tab-peptides').click();
 await page.locator('[data-original-image]').evaluateAll(ns=>Promise.all(ns.map(n=>{n.loading='eager';return n.decode().catch(()=>{});}))); 
 const broken=await page.locator('[data-original-image]').evaluateAll(ns=>ns.filter(n=>!n.naturalWidth).map(n=>n.src));assert.deepEqual(broken,[],'Missing source images');
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'Expanded overflow '+width);
 const clipped=await page.locator('p,h1,h2,h3,summary,td,th').evaluateAll(ns=>ns.filter(n=>n.getBoundingClientRect().height>0&&n.scrollHeight>n.clientHeight+3).map(n=>n.textContent.slice(0,80)));assert.deepEqual(clipped,[],'Clipped text '+width);
 checks.push({width,overflow:false,expandedTextClipping:false,sourceImagesLoaded:60});
}
await page.setViewportSize({width:393,height:1000});await page.goto(base,{waitUntil:'networkidle'});const before=await page.locator('h1').boundingBox();await page.locator('.menu-toggle').click();const after=await page.locator('h1').boundingBox();assert.equal(before.y,after.y);assert.equal(await page.locator('main').evaluate(n=>n.inert),true);await page.keyboard.press('Escape');assert.equal(await page.locator('#mobile-menu').isVisible(),false);assert.equal(await page.locator('main').evaluate(n=>n.inert),false);
await page.locator('[data-video]').first().click();assert.equal(await page.locator('dialog').evaluate(n=>n.open),true);assert.equal(await page.locator('dialog iframe').count(),1);await page.locator('.dialog-close').click();await page.waitForFunction(()=>!document.querySelector('dialog iframe'));assert.equal(await page.locator('dialog iframe').count(),0);
await page.locator('[data-hero-slide="1"]').click();assert((await page.locator('#hero-result').getAttribute('src')).endsWith('result-man-5.jpg'));assert.equal(await page.locator('#hero-pause').getAttribute('aria-pressed'),'true');
// Check each locally referenced resource; this does not submit bookings or load external videos.
const resources=await page.locator('img,script[src],link[rel=stylesheet]').evaluateAll(ns=>[...new Set(ns.map(n=>n.getAttribute('src')||n.getAttribute('href')).filter(h=>h&&!h.startsWith('http')))]);
for(const resource of resources)assert.equal((await page.request.get(new URL(resource,base+'/').href)).status(),200,resource);
fs.mkdirSync('/tmp/sarasin-homepage-qa',{recursive:true});
for(const width of [393,1440]){await page.setViewportSize({width,height:1000});await page.goto(base,{waitUntil:'networkidle'});await page.locator('img').evaluateAll(ns=>Promise.all(ns.map(n=>{n.loading='eager';return n.decode().catch(()=>{});})));for(const [name,selector] of [['hero','.hero'],['solution','#overbehandeling'],['ingredients','#ingredienten'],['videos','#videoshaarfiller'],['reviews','#klant'],['prices','#prijs'],['lifestyle','#longevity'],['faq','#veelgesteldevragen']]){await page.locator(selector).evaluate(n=>window.scrollTo({top:n.getBoundingClientRect().top+scrollY-document.querySelector('header').offsetHeight-15,behavior:'instant'}));await page.screenshot({path:`/tmp/sarasin-homepage-qa/${width}-${name}.png`});}await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:`/tmp/sarasin-homepage-qa/${width}-full.png`,fullPage:true});}
assert.deepEqual(errors,[]);console.log(JSON.stringify({base,sourceFragments:source.textNodes.length,sourceHeadings:43,originalItems:165,sourceImageElements:60,sourceLinks:source.links.length,sourceTables:7,checks,tabs:true,overlayWithoutLayoutShift:true,videoDialog:true,reducedMotionPause:true,browserErrors:errors},null,2));
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
