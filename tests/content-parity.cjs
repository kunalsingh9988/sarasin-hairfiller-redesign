const assert=require('node:assert/strict');
const fs=require('node:fs');
const {chromium}=require('playwright');
const source=require('../audit/source-parity-2026-11-08.json');
const base=process.argv[2]||'http://127.0.0.1:8773';
(async()=>{const browser=await chromium.launch();try{
 const page=await browser.newPage({reducedMotion:'reduce'});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const checks=[];
 for(const width of [320,393,768,1440]){
  await page.setViewportSize({width,height:1000});await page.goto(base,{waitUntil:'networkidle'});
  assert.equal(await page.locator('#ervaringen').count(),1);assert.equal(await page.locator('.review-teaser').count(),1);
  assert((await page.locator('#ervaringen').boundingBox()).y<(await page.locator('#prijzen').boundingBox()).y);
  assert.equal(await page.locator('#ervaringen .review-grid blockquote').count(),2);
  assert.equal(await page.locator('#ervaringen .patient-story img').count(),2);
  assert.equal(await page.locator('#ervaringen .media-publications a').count(),2);
  for(const p of source.blocks.filter(b=>b.heading==='Over de auteur'&&b.tag==='P'&&!b.text.startsWith('Bekijk')))assert((await page.locator('#auteur').textContent()).includes(p.text));
  await page.locator('#broncontrole>details').evaluate(n=>n.open=true);
  assert.equal(await page.locator('[data-source-block]').count(),139);
  for(const block of source.blocks){const node=page.locator('#source-'+block.id);assert.equal(await node.count(),1);if(block.rows){assert.deepEqual(await node.locator('tr').evaluateAll(rs=>rs.map(r=>[...r.cells].map(c=>c.textContent.trim()))),block.rows);}else assert((await node.textContent()).includes(block.text),block.id);}
  assert.equal(await page.locator('#broncontrole table').count(),7);
  await page.locator('#meer-informatie details').evaluateAll(ns=>ns.forEach(n=>n.open=true));
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'Expanded content overflow '+width);
  const clipped=await page.locator('.pilot-table td,.pilot-table th').evaluateAll(ns=>ns.filter(n=>n.getBoundingClientRect().height>0 && n.scrollHeight>n.clientHeight+2).map(n=>n.textContent.slice(0,60)));assert.deepEqual(clipped,[]);
  assert.equal(await page.locator('#ingredienten tbody tr').count(),7);
  assert.equal(await page.locator('#protocollen [data-source-table="SRC-059"] tbody tr').count(),4);
  assert.equal(await page.locator('#veiligheid [data-source-table="SRC-063"] tbody tr').count(),3);
  assert.equal(await page.locator('#veiligheid [data-source-table="SRC-066"] tbody tr').count(),7);
  assert.equal(await page.locator('#leefstijl [data-source-table="SRC-099"] tbody tr').count(),8);
  checks.push({width,sourceBlocks:139,sourceTables:7,expandedTablesReadable:true});
 }
 await page.goto(base+'/#source-SRC-043',{waitUntil:'networkidle'});assert.equal(await page.locator('#broncontrole>details').evaluate(n=>n.open),true);
 const checkPage=await page.goto(base+'/content-check/',{waitUntil:'networkidle'});assert.equal(checkPage.status(),200);assert.equal(await page.locator('.source-check-row').count(),139);
 assert.deepEqual(errors,[]);console.log(JSON.stringify({base,checks,sourceHashNavigation:true,contentChecklist:true,browserErrors:errors},null,2));
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
