// Executed through Figma's use_figma API; never imports a screenshot of the UI.
const createdNodeIds=[];
const pendingImages=[];
const ink={r:20/255,g:59/255,b:56/255};
const bodyInk={r:60/255,g:82/255,b:80/255};
const mint={r:231/255,g:241/255,b:237/255};
const line={r:217/255,g:225/255,b:218/255};
const white={r:1,g:1,b:1};
const font={family:'Bricolage Grotesque',style:'Regular'};
const bold={family:'Bricolage Grotesque',style:'SemiBold'};
await Promise.all([figma.loadFontAsync(font),figma.loadFontAsync(bold)]);
function remember(n){createdNodeIds.push(n.id);return n;}
function fill(color){return[{type:'SOLID',color}];}
function stack(parent,name,width,gap=14,bg=null,pad=0,direction='VERTICAL'){
 const f=remember(figma.createAutoLayout(direction));f.name=name;f.fills=bg?fill(bg):[];f.itemSpacing=gap;f.paddingTop=f.paddingBottom=f.paddingLeft=f.paddingRight=pad;parent.appendChild(f);f.resize(width,10);f.primaryAxisSizingMode=direction==='HORIZONTAL'?'FIXED':'AUTO';f.counterAxisSizingMode=direction==='HORIZONTAL'?'AUTO':'FIXED';f.layoutSizingHorizontal='FIXED';return f;
}
function text(parent,value,width,size=16,weight=false,color=bodyInk,name='Text'){
 const n=remember(figma.createText());n.name=name;n.fontName=weight?bold:font;n.fontSize=size;n.lineHeight={unit:'PERCENT',value:size>=28?120:155};n.fills=fill(color);n.characters=value||' ';n.textAutoResize='HEIGHT';n.resize(Math.max(20,width),n.height);parent.appendChild(n);return n;
}
function link(parent,value,width,url,button=false){
 const r=stack(parent,button?'Consultation CTA':'Link',Math.min(width,button?360:width),10,button?{r:220/255,g:231/255,b:132/255}:null,button?16:0,'HORIZONTAL');
 r.cornerRadius=button?12:0;
 const t=text(r,value,Math.max(20,r.width-(button?60:28)),14,true,ink);if(url&&!/^(mailto:|tel:)/.test(url))t.hyperlink={type:'URL',value:/^https?:/.test(url)?url:'https://hairfiller-redesign.vercel.app/'+url.replace(/^\//,'')};
 const arrow=remember(figma.createNodeFromSvg('<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 7h10v10M7 17 17 7" stroke="#143b38" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'));r.appendChild(arrow);return r;
}
function photo(parent,item,width,maxHeight=500){
 const ratio=(item.h||600)/(item.w||600);const h=Math.min(width*ratio,maxHeight);const n=remember(figma.createRectangle());n.name='Source asset: '+item.src;n.resize(width,Math.max(40,h));n.fills=fill(mint);n.cornerRadius=12;parent.appendChild(n);pendingImages.push({id:n.id,src:item.src});return n;
}
function table(parent,item,width,mobile){
 const t=stack(parent,item.title||'Table',width,0,null,0);t.cornerRadius=12;t.strokes=fill(line);t.strokeWeight=1;
 if(item.title)text(t,item.title,width,17,true,ink,'Table caption');
 const count=Math.max(...item.rows.map(r=>r.length));const cols=Array.from({length:count},(_,i)=>count===3?(i===0?width*.24:width*.38):width/count);
 if(!mobile){const head=stack(t,'Column headings',width,0,mint,0,'HORIZONTAL');item.rows[0].forEach((c,i)=>{const cell=stack(head,'Heading cell',cols[i],0,null,12);text(cell,c,cols[i]-24,14,true,ink);});}
 item.rows.slice(1).forEach((row,index)=>{
  const r=stack(t,'Row '+(index+1),width,mobile?6:0,index%2?null:{r:.96,g:.98,b:.97},mobile?14:0,mobile?'VERTICAL':'HORIZONTAL');
  if(mobile){row.forEach((c,i)=>{if(i>0)text(r,item.rows[0][i]||'Informatie',width-28,12,true,ink);text(r,c,width-28,i?14:15,i===0,bodyInk);});}
  else row.forEach((c,i)=>{const cell=stack(r,'Cell '+(i+1),cols[i]||width/count,0,null,12);text(cell,c,(cols[i]||width/count)-24,14,i===0,bodyInk);});
 });return t;
}
function blocks(parent,items,width,mobile){
 for(const item of items){
  if(item.kind==='heading')text(parent,item.text,width,item.level===1?(mobile?40:64):item.level===2?(mobile?30:46):22,true,ink,'Heading / '+item.text);
  else if(item.kind==='paragraph'||item.kind==='caption'||item.kind==='bullet')text(parent,(item.kind==='bullet'?'• ':'')+item.text,Math.min(width,mobile?width:1050),item.kind==='caption'?12:mobile?15:17,false,bodyInk);
  else if(['button','link','video'].includes(item.kind))link(parent,item.text,width,item.url,item.kind==='button');
  else if(item.kind==='image')photo(parent,item,Math.min(width,mobile?width:700),mobile?440:520);
  else if(item.kind==='table')table(parent,item,width,mobile);
  else if(item.kind==='quote'){
   let master=figma.currentPage.children.find(n=>n.type==='COMPONENT'&&n.name==='Sarasin / Genuine clinic review');
   if(!master){master=remember(figma.createComponent());master.name='Sarasin / Genuine clinic review';master.description='Reusable sourced general-clinic review; never imply a Hairfiller-specific outcome.';master.layoutMode='VERTICAL';master.primaryAxisSizingMode='AUTO';master.counterAxisSizingMode='FIXED';master.paddingTop=master.paddingBottom=master.paddingLeft=master.paddingRight=20;master.itemSpacing=10;master.resize(350,100);master.fills=fill(mint);master.cornerRadius=16;master.x=Math.max(...figma.currentPage.children.map(n=>n.x+n.width))+200;master.y=100;
    const quote=text(master,'Review',310,18,false,ink);quote.layoutSizingHorizontal='FILL';const author=text(master,'Source',310,13,true,ink);author.layoutSizingHorizontal='FILL';const qk=master.addComponentProperty('Quote','TEXT','Review');const ak=master.addComponentProperty('Source','TEXT','Source');quote.componentPropertyReferences={characters:qk};author.componentPropertyReferences={characters:ak};
   }
   const props=master.componentPropertyDefinitions;const keys=Object.keys(props);const instance=remember(master.createInstance());parent.appendChild(instance);instance.resize(Math.min(width,900),instance.height);instance.setProperties({[keys.find(k=>k.startsWith('Quote'))]:'“'+item.text+'”',[keys.find(k=>k.startsWith('Source'))]:item.author});instance.layoutSizingVertical='HUG';
  }else if(item.kind==='disclosure'){
   const d=stack(parent,'Details / '+item.title,width,14,null,0);text(d,item.title,width,19,true,ink,'Disclosure heading');blocks(d,item.items,width,mobile);
  }else if(item.kind==='gallery'){
   text(parent,item.title,width,20,true,ink);const gallery=stack(parent,'40 original patient photos',width,14,null,0);const columns=mobile?2:5;const w=(width-14*(columns-1))/columns;
   for(let i=0;i<item.images.length;i+=columns){const row=stack(gallery,'Patient image row',width,14,null,0,'HORIZONTAL');for(const image of item.images.slice(i,i+columns)){const c=stack(row,'Patient photo and source caption',w,6,null,0);photo(c,image,w,mobile?160:220);text(c,image.alt,w,11,false,bodyInk);}}
  }
 }
}
