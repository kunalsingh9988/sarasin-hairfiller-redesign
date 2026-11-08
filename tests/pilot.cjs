const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const {chromium} = require('playwright');
const root = path.resolve(__dirname,'..');
const mapping = require('../audit/content-map.json');
const data = require('../content/pilot.json');
const base = process.argv[2] || 'http://127.0.0.1:8772';
(async()=>{
 const browser=await chromium.launch();
 try {
 const page=await browser.newPage({reducedMotion:'reduce'});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base,{waitUntil:'networkidle'});
 assert.equal(mapping.entries.length,41);
 for(const entry of mapping.entries) assert(await page.locator(entry.destination).count(),entry.sourceHeading);
 for(const file of mapping.gallery) assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(root,file.local))).digest('hex'),file.sha256);
 assert.equal(await page.locator('.gallery-archive').evaluate(n=>n.open),false);
 assert.equal(await page.locator('.source-gallery img').count(),40);
 await page.locator('.gallery-archive summary').click();
 await page.locator('.source-gallery img').evaluateAll(imgs=>Promise.all(imgs.map(img=>img.decode())));
 const images=await page.locator('.source-gallery img').evaluateAll(imgs=>imgs.every(i=>i.naturalWidth>0 && i.clientWidth<=i.closest('figure').clientWidth+1));assert(images);
 const schema=await page.locator('#page-structured-data').textContent();
 const faq=JSON.parse(schema)['@graph'].find(x=>x['@type']==='FAQPage');
 assert.equal(faq.mainEntity.length,14);
 assert.deepEqual(faq.mainEntity.map(x=>x.name),data.faq.map(f=>f.q));
 assert.equal(await page.locator('[data-video]').count(),11);
 const ids=await page.locator('[data-video]').evaluateAll(nodes=>nodes.map(n=>n.dataset.video));assert.equal(new Set(ids).size,9);
 const domIDs=await page.locator('[id]').evaluateAll(nodes=>nodes.map(n=>n.id));assert.equal(new Set(domIDs).size,domIDs.length,'Duplicate IDs');
 await page.evaluate(()=>{
  window.dataLayer=[];window.observed=[];
  window.addEventListener('sarasin:measurement',e=>window.observed.push(e.detail));
  document.addEventListener('click',e=>{if(e.target.closest('a'))e.preventDefault();});
 });
 await page.locator('.hero-buttons .button').click();assert.deepEqual(await page.evaluate(()=>window.observed),[]);
 await page.evaluate(()=>window.sarasinMeasurement.setConsent({analytics:true}));
 await page.locator('.hero-buttons .button').click();
 assert.deepEqual(await page.evaluate(()=>window.observed),[{event:'consultation_click',placement:'hero'}]);
 assert.equal(await page.evaluate(()=>window.dataLayer.length),1);
 await page.evaluate(()=>window.sarasinMeasurement.setConsent({analytics:false}));
 await page.locator('.hero-buttons .button').click();assert.equal(await page.evaluate(()=>window.observed.length),1);
 // Internal resource and link checks are read-only; external booking actions are never submitted.
 await page.goto(base,{waitUntil:'networkidle'});
 const links=await page.locator('a[href]').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('href')));
 for(const href of new Set(links.filter(h=>h.startsWith('#')))) assert(await page.locator(href).count(),href);
 const routes=['/','/blog/',...data.articles.map(a=>`/blog/${a.slug}/`),'/project/'];
 const download=await page.request.head(base+'/downloads/sarasin-hairfiller-wordpress-review.zip');assert.equal(download.status(),200);
 if(base.includes('vercel.app')) assert((download.headers()['x-robots-tag']||'').includes('noindex'));
 const titles=[];const shots='/tmp/sarasin-pilot-qa';fs.mkdirSync(shots,{recursive:true});
 for(const route of routes){
  const response=await page.goto(base+route,{waitUntil:'networkidle'});assert.equal(response.status(),200,route);
  assert.equal(await page.locator('h1').count(),1,route);
  assert((await page.locator('meta[name="robots"]').getAttribute('content')).includes('noindex'));
  titles.push(await page.title());
  for(const width of [320,393,768,1024,1440,1920]){
   await page.setViewportSize({width,height:1000});
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,route+' overflow '+width);
  }
  if(route==='/project/' || route===`/blog/${data.articles[0].slug}/`) await page.screenshot({path:path.join(shots,route==='/project/'?'project.png':'article.png'),fullPage:true});
 }
 assert.equal(new Set(titles).size,routes.length);
 await page.goto(base,{waitUntil:'networkidle'});
 const assets=await page.locator('[src],link[rel="stylesheet"]').evaluateAll(ns=>ns.map(n=>n.getAttribute('src')||n.getAttribute('href')).filter(h=>h && !/^(https?:|data:)/.test(h)));
 for(const asset of new Set(assets)){const response=await page.request.get(new URL(asset,base+'/').href);assert.equal(response.status(),200,asset);}
 for(const width of [393,1440]){
  await page.setViewportSize({width,height:1000});await page.goto(base,{waitUntil:'networkidle'});
  for(const [name,selector] of [['hero','.hero'],['zones','#prijzen'],['info','#meer-informatie'],['reviews','#ervaringen']]){
   await page.locator(selector).scrollIntoViewIfNeeded();await page.screenshot({path:path.join(shots,`${width}-${name}.png`)});
  }
 }
 const wxr=fs.readFileSync(path.join(root,'wordpress/article-drafts.xml'),'utf8');assert.equal((wxr.match(/<wp:status>draft<\/wp:status>/g)||[]).length,3);
 const plugin=fs.readFileSync(path.join(root,'wordpress/sarasin-hairfiller-pilot/sarasin-hairfiller-pilot.php'),'utf8');assert(plugin.includes("!defined('ABSPATH')"));assert(!plugin.includes('register_activation_hook'));
 assert.deepEqual(errors,[]);
 console.log(JSON.stringify({base,sourceTopics:41,unchangedPatientPhotos:40,faq:14,videos:9,articleDrafts:3,routes:routes.length,responsiveChecks:36,measurementDefaultDeniedAndRevocable:true,resources:'passed',browserErrors:errors,screenshots:shots,wordpressRuntime:'NOT TESTED — access required'},null,2));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
