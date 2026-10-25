
/* Original vector city. Geometry stays consistent across all 25 illumination states. */
(function(root){
function citySVG(level=0){
const R=Energy.rng(90210);let win=0;
function windows(x,y,w,h,cols,rows,round=false){let s='';for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){const a=x+c*w/cols+3,b=y+r*h/rows+4,ww=Math.max(3,w/cols-9),hh=Math.max(4,h/rows-9),phase=(win++*7%24)+1;
s+='<rect class="city-window" data-phase="'+phase+'" x="'+a+'" y="'+b+'" width="'+ww+'" height="'+hh+'" rx="'+(round?ww/2:1)+'" fill="'+(phase<=level?'#efcb86':'#263e4e')+'"/>';
if(ww>6)s+='<path d="M'+(a+ww/2)+' '+b+'v'+hh+'" stroke="#1a2b3b" stroke-width="1"/>';}return s;}
let s='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 430" preserveAspectRatio="xMidYMid slice" fill="none"><defs><linearGradient id="sky" x2="0" y2="1"><stop id="skyTop" stop-color="#10222f"/><stop id="skyBottom" offset="1" stop-color="#29424c"/></linearGradient><linearGradient id="river" x2="0" y2="1"><stop stop-color="#19353e"/><stop offset="1" stop-color="#0a1923"/></linearGradient><linearGradient id="vignette" x2="0" y2="1"><stop stop-color="#0a1821" stop-opacity="0"/><stop offset="1" stop-color="#0a1821"/></linearGradient><radialGradient id="moonAura"><stop stop-color="#c4d5c2" stop-opacity=".12"/><stop offset="1" stop-color="#c4d5c2" stop-opacity="0"/></radialGradient><radialGradient id="lampGlow"><stop stop-color="#edc98b" stop-opacity=".45"/><stop offset="1" stop-color="#edc98b" stop-opacity="0"/></radialGradient><filter id="softGlow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="2"/></filter><clipPath id="scene"><rect width="800" height="430" rx="20"/></clipPath></defs><g clip-path="url(#scene)"><rect x="0" y="0" width="800" height="430" fill="url(#sky)"/>';
s+='<circle cx="681" cy="66" r="100" fill="url(#moonAura)"/><circle cx="681" cy="66" r="18" fill="#c4d2c0"/><circle cx="688" cy="60" r="17" fill="#162b37"/><g class="stars" fill="#c3d8cf">';
for(let i=0;i<65;i++){s+='<circle cx="'+(15+R()*770).toFixed(1)+'" cy="'+(10+R()*190).toFixed(1)+'" r="'+(.4+R()*.8).toFixed(1)+'" opacity="'+(.25+R()*.6).toFixed(2)+'"/>';}s+='</g>';
s+='<g class="mist" stroke="#759397" stroke-opacity=".12"><path d="M40 95h130m-70 7h95m310-70h100m-53 6h80M570 141h110m-40 5h80"/></g><path d="M0 245 55 223 115 240 190 210 252 228 320 207 387 232 463 201 541 230 611 209 700 232 800 206V343H0Z" fill="#1b3442"/>';
// Far skyline.
for(let x=0;x<800;){let w=22+R()*28,h=30+R()*70,y=304-h;s+='<path d="M'+x+' 307V'+y+'h'+w+'v'+(307-y)+'Z" fill="#203846" stroke="#2a4650" stroke-width=".6"/>';s+=windows(x+2,y+5,w-2,h-8,3,Math.max(2,Math.floor(h/12)));x+=w+4;}
// Rear silhouettes and aerials.
s+='<path d="M131 239V162h9v-14h3v14h8v77m174 1V144h10v-20h4v20h10v96m61 0V173h9v-10h3v10h10v67" fill="#233945"/>';
const buildings=[
[14,224,66,103,'#314451',0],[84,198,62,129,'#3b4857',1],[149,236,55,91,'#2c424e',0],
[208,183,83,144,'#40505c',2],[296,225,68,102,'#2c414d',1],[368,204,70,123,'#3a4b57',0],
[445,245,51,82,'#324653',1],[560,208,75,119,'#3c4c57',2],[638,232,60,95,'#30414e',0],[704,193,81,134,'#394b56',1]];
for(const[x,y,w,h,color,roof]of buildings){
s+='<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" fill="'+color+'"/><rect x="'+(x+w-7)+'" y="'+y+'" width="7" height="'+h+'" fill="#142a36" opacity=".5"/>';
if(roof===1)s+='<path d="M'+(x-4)+' '+y+'l'+(w/2+4)+' -23 '+(w/2+4)+' 23Z" fill="#1a2d3d" stroke="#53616b" stroke-width="1"/><rect x="'+(x+8)+'" y="'+(y-25)+'" width="6" height="14" fill="#2c3d4a"/>';
else if(roof===2)s+='<path d="M'+(x-3)+' '+y+'l9-18h'+(w-12)+'l9 18Z" fill="#233240" stroke="#5b6670" stroke-width="1"/><path d="M'+(x+12)+' '+(y-15)+'h12v10h-12m25-10h12v10h-12" fill="#3e5362"/>';
else s+='<rect x="'+(x-3)+'" y="'+(y-3)+'" width="'+(w+6)+'" height="5" fill="#627079" opacity=".6"/>';
s+=windows(x+5,y+8,w-7,h-24,Math.floor(w/16),Math.floor(h/21),roof===1);
s+='<path d="M'+(x-2)+' '+(y+h-8)+'h'+(w+4)+'M'+x+' '+(y+27)+'h'+w+'" stroke="#79818a" stroke-opacity=".25" stroke-width="2"/>';
s+='<rect x="'+(x+w*.41)+'" y="'+(y+h-20)+'" width="'+(w*.17)+'" height="20" rx="5" fill="#172d38"/>';
}
// Clock tower, a consistent landmark.
s+='<path d="M510 326V169h35v157" fill="#4b5360"/><path d="M545 169h8v157h-8" fill="#2e3d4c"/><path d="M505 169h53v-8h-53z" fill="#758087"/><path d="M507 160l20-40 28 40Z" fill="#203242" stroke="#66757b"/><path d="M527 120v-16" stroke="#87918b"/><circle cx="527" cy="102" r="2" fill="#d9c69a"/><circle cx="529" cy="188" r="12" fill="#b7b69d" opacity=".8"/><circle cx="529" cy="188" r="9.5" fill="#263c47"/><path d="M529 181v7l5 3" stroke="#e7d3a0" stroke-width="1.8"/>';
s+=windows(514,212,28,82,2,4,true);
s+='<rect x="504" y="299" width="55" height="28" fill="#3d4c58"/><path d="M522 327v-14a7 7 0 0114 0v14" fill="#162f3a"/>';
// Quay, embankment and river.
s+='<path d="M0 322H800V351H0z" fill="#233b45"/><path d="M0 322H800M0 328H800" stroke="#577075" stroke-opacity=".6"/><path d="M0 342H800" stroke="#0c222c" stroke-width="8"/><path d="M0 351H800V430H0z" fill="url(#river)"/>';
// warm reflections, unlocked in the same order.
s+='<g class="water-shimmer">';
for(let i=0;i<36;i++){const x=16+i*22,phase=i*7%24+1;s+='<g class="city-lamp" data-phase="'+phase+'" opacity="'+(phase<=level?.65:0)+'">';for(let r=0;r<5;r++){const ww=4+R()*18;s+='<path d="M'+(x-ww/2)+' '+(355+r*9+R()*4)+'h'+ww+'" stroke="#d1ae73" stroke-opacity="'+(.6-r*.09)+'" stroke-width="'+(1+R())+'"/>';}s+='</g>';}s+='</g>';
// Bridge: stone arches over the water.
s+='<path d="M248 348Q397 287 555 348v28h-20q-14-37-51-10h-20q-35-47-69-1h-20q-39-46-74 9h-24Z" fill="#354a54"/><path d="M247 346Q397 285 556 346" stroke="#849090" stroke-width="4"/><path d="M247 338Q397 277 556 338" stroke="#6b8287" stroke-width="1.5"/>';
for(let i=0;i<=22;i++){const x=250+i*13.6,y=338-55*Math.sin(Math.PI*i/22);s+='<path d="M'+x+' '+y+'v9" stroke="#5b737b" stroke-width="1.5"/>';}
s+='<path d="M248 377q23-7 49-1m8-9 69-1m21 0h65m25 1 50 10" stroke="#607b80" stroke-opacity=".35"/>';
// Small tram, shop awnings and parked bicycle.
s+='<path d="M115 305h65v18h-65z" fill="#516863"/><path d="M113 304h69" stroke="#89968b" stroke-width="2"/><path d="M125 304l9-12h22l9 12" stroke="#617981"/><path d="M134 292h23" stroke="#8a9b95"/>';
s+=windows(118,306,59,13,5,1);
s+='<circle cx="128" cy="324" r="3" fill="#0a2029"/><circle cx="167" cy="324" r="3" fill="#0a2029"/><path d="M0 293h236m-130 0v9" stroke="#5c767b" stroke-width=".7" opacity=".7"/>';
for(const x of [32,223,582,715])s+='<path d="M'+x+' 308h32l-4-7h-24Z" fill="#6b7770"/><path d="M'+x+' 308v9m8-9v9m8-9v9m8-9v9m8-9v9" stroke="#c0af8d" stroke-width="3" opacity=".55"/>';
s+='<g stroke="#708b88" stroke-width="1.2"><circle cx="666" cy="324" r="5"/><circle cx="681" cy="324" r="5"/><path d="M666 324l5-8 10 8h-15l8-6-3-3m7-1h6"/></g>';
// Lamps and tree-lined waterfront.
for(let i=0;i<10;i++){const x=28+i*82,y=320-(i>2&&i<7?10:0),phase=i*5%24+1;s+='<path d="M'+x+' '+y+'v-30q0-5 5-5h4" stroke="#637478" stroke-width="1.7"/><path d="M'+(x+5)+' '+(y-35)+'h8l-2 7h-4Z" fill="#273e47" stroke="#7b8986" stroke-width=".8"/><g class="city-lamp" data-phase="'+phase+'" opacity="'+(phase<=level?1:0)+'"><circle cx="'+(x+9)+'" cy="'+(y-31)+'" r="29" fill="url(#lampGlow)"/><path d="M'+(x+6)+' '+(y-34)+'h6l-1 5h-4Z" fill="#ffe0a0"/><ellipse cx="'+(x+9)+'" cy="'+y+'" rx="17" ry="3" fill="#d6bb7e" opacity=".13"/></g>';}
for(const x of [5,195,466,608,790]){s+='<path d="M'+x+' 327v-38" stroke="#263c43" stroke-width="4"/><path d="M'+x+' 286l-14 24h28Z" fill="#1c3b40"/><path d="M'+x+' 278l-13 24h26Z" fill="#29484a"/><path d="M'+x+' 272l-10 22h20Z" fill="#315153"/>';}
s+='<path d="M0 407q110-18 212 4t245-1 343-1v21H0Z" fill="#0b1b24"/><path d="M0 410q110-18 212 4t245-1 343-1" stroke="#2f4850" stroke-opacity=".4"/><rect y="390" width="800" height="40" fill="url(#vignette)"/></g></svg>';
return s;
}
function updateCity(level){
const city=document.getElementById('city');if(!city.querySelector('svg'))city.innerHTML=citySVG(0);
city.querySelectorAll('[data-phase]').forEach(el=>{const lit=Number(el.dataset.phase)<=level;if(el.classList.contains('city-window'))el.setAttribute('fill',lit?'#efcb86':'#263e4e');else el.setAttribute('opacity',lit?(el.parentElement.classList.contains('water-shimmer')?.65:1):0);});
const t=Math.max(0,(level-18)/6);function mix(a,b,t){return '#'+a.match(/../g).map((s,i)=>Math.round(parseInt(s,16)*(1-t)+parseInt(b.slice(i*2,i*2+2),16)*t).toString(16).padStart(2,'0')).join('');}
city.querySelector('#skyTop').setAttribute('stop-color',mix('10222f','344052',t));city.querySelector('#skyBottom').setAttribute('stop-color',mix('29424c','bd967a',t));
city.setAttribute('aria-label','Cidade com '+Math.round(level/24*100)+'% das luzes restauradas');
}
root.citySVG=citySVG;root.updateCity=updateCity;
})(typeof window!=='undefined'?window:globalThis);

