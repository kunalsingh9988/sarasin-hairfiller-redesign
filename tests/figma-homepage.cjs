const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {chromium}=require('playwright');
const manifest=require('../audit/figma-homepage-assets.json');
const base=process.argv[2]||'http://localhost:8774';
const output=process.argv[3]||'/tmp/sarasin-figma-homepage-qa';
const asset=(node,name)=>manifest.nodes['40002354-'+node][name];
const close=(actual,expected,label)=>assert(Math.abs(actual-expected)<=2,label+': '+actual+' / '+expected);
(async()=>{
 const browser=await chromium.launch();
 try{
  fs.mkdirSync(output,{recursive:true});
  const page=await browser.newPage({viewport:{width:1728,height:1100},reducedMotion:'reduce'});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base,{waitUntil:'networkidle'});
  assert.equal(await page.locator('html').getAttribute('data-homepage-reference'),'figma-40002354-233');
  assert.equal(await page.locator('html').getAttribute('lang'),'en');
  const text=await page.locator('body').innerText();assert(!/\b(Boek|Bekijk|behandeling|nazorg|Prijzen|Klantervaringen|huid)\b/.test(text),'Dutch UI wording remains');
  const hero=await page.locator('.hero-comparison').boundingBox();
  close(hero.x,884,'Figma hero x');close(hero.y,161,'Figma hero y');close(hero.width,760,'Figma hero width');close(hero.height,645,'Figma hero height');
  const guide=await page.locator('.guide-card').first().boundingBox();close(guide.width,768,'Figma guide width');
  const copy=await page.locator('.consult-copy').boundingBox();assert(copy.width>350,'Consultation copy must have a readable column');
  const slots={
   '#hero-result':asset('3881','imgImageEchteVoorEnNafotoVanHairfillerBijSarasinClinic'),
   '.guide-product':asset('3815','imgRectangle3176'),
   '.consult-portrait':asset('3816','imgImageKarenSarasin'),
   '.solution-visual>img':asset('3817','imgImageIllustrativePhotoOfAClinicalScalpTreatment'),
   '.benefits-product img':asset('1898','imgRectangle3176'),
   '.lifestyle-photo>img':asset('3064','imgImageIllustrativeHomeRoutineWithSarasinCollagen'),
   '.final-consult>div:first-child img':asset('3752','imgImageIllustrativeImageOfAPersonalConsultation')
  };
  for(const [selector,src]of Object.entries(slots))assert.equal(await page.locator(selector).getAttribute('src'),src,selector);
  assert.equal(await page.locator('.video-card').count(),7);
  await page.locator('.rail-next').scrollIntoViewIfNeeded();await page.locator('.rail-next').click();
  assert(await page.locator('.video-rail').evaluate(n=>n.scrollLeft)>0,'Next button must scroll the video rail');
  await page.locator('.video-grid [data-video]').nth(2).click();
  assert((await page.locator('dialog iframe').getAttribute('src')).includes('OeLGZdJCpUE'));
  await page.keyboard.press('Escape');await page.waitForFunction(()=>!document.querySelector('dialog iframe'));
  const widths=[320,393,700,768,900,1024,1440,1728];
  const checks=[];
  for(const width of widths){
   await page.setViewportSize({width,height:1000});await page.goto(base,{waitUntil:'networkidle'});
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'Page overflow '+width);
   const cta=await page.locator('.hero-cta').boundingBox(),visual=await page.locator('.hero-visual').boundingBox();
   if(width<=700){assert(cta.y+cta.height<=visual.y,'Mobile booking CTA must precede hero photo');assert.equal(await page.locator('.hero-copy').evaluate(n=>getComputedStyle(n).textAlign),'left');}
   await page.locator('details').evaluateAll(ns=>ns.forEach(n=>n.open=true));
   await page.locator('img').evaluateAll(ns=>Promise.all(ns.map(n=>{n.loading='eager';return n.decode().catch(()=>{});})));
   const broken=await page.locator('img').evaluateAll(ns=>ns.filter(n=>!n.naturalWidth).map(n=>n.getAttribute('src')));assert.deepEqual(broken,[],'Broken image at '+width);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'Expanded overflow '+width);
   if(width<=700){assert.equal(await page.locator('table').evaluateAll(ns=>ns.every(t=>t.getBoundingClientRect().width<=innerWidth)),true);}
   const figs=await page.locator('img[src^="assets/figma/"]').evaluateAll(ns=>ns.filter(n=>n.checkVisibility()).map(n=>({src:n.getAttribute('src'),w:n.getBoundingClientRect().width,h:n.getBoundingClientRect().height,nw:n.naturalWidth,nh:n.naturalHeight})));
   const originalGeometry=await page.locator('[data-original-image]').evaluateAll(ns=>ns.filter(n=>!n.getBoundingClientRect().width||!n.getBoundingClientRect().height).map(n=>n.getAttribute('src')));assert.deepEqual(originalGeometry,[],'Original image collapsed '+width);
   assert(figs.length>60);assert(figs.every(n=>n.w>0&&n.h>0&&n.nw>0&&n.nh>0),'Figma asset collapsed '+width);
   checks.push({width,pageOverflow:false,brokenImages:0,figmaImageSlots:figs.length});
  }
  for(const width of [1728,393]){
   await page.setViewportSize({width,height:1100});await page.goto(base,{waitUntil:'networkidle'});
   await page.locator('img').evaluateAll(ns=>Promise.all(ns.map(n=>{n.loading='eager';return n.decode().catch(()=>{});})));await page.evaluate(()=>scrollTo(0,0));
   await page.screenshot({path:path.join(output,width+'-hero.png')});
   for(const [name,selector]of [['guides','.page-guides'],['suitability','#wie'],['causes','#oorzaken'],['videos','#videoshaarfiller'],['solution','#overbehandeling'],['benefits','#voordelen'],['ingredients','#ingredienten'],['care','#nazorg'],['prices','#prijs'],['lifestyle','#longevity'],['faq','#veelgesteldevragen']]){
    await page.locator(selector).evaluate(n=>window.scrollTo({top:n.getBoundingClientRect().top+scrollY-document.querySelector('header').offsetHeight-15,behavior:'instant'}));
    await page.screenshot({path:path.join(output,width+'-'+name+'.png')});
   }
  }
  assert.deepEqual(errors,[]);const result={base,frame:manifest.frame,language:'en',desktopHeroGeometryMatches:true,criticalAssetSlotsVerified:Object.keys(slots).length,videoRail:true,videoDialog:true,checks,browserErrors:errors};
  fs.writeFileSync(path.join(output,'results.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result,null,2));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
