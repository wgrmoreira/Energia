
/* Sculpted cable and glass components, rendered as layered vectors. */
(function(root){
function cablePath(mask){
const ports=[[50,0],[100,50],[50,100],[0,50]],dirs=[];for(let d=0;d<4;d++)if(mask&(1<<d))dirs.push(d);
if(dirs.length===2){const a=ports[dirs[0]],b=ports[dirs[1]];
if((dirs[1]-dirs[0])%2===0)return 'M'+a+' L'+b;
const a1=[50+(a[0]-50)*.42,50+(a[1]-50)*.42],b1=[50+(b[0]-50)*.42,50+(b[1]-50)*.42];
return 'M'+a+' L'+a1+' Q50 50 '+b1+' L'+b;
}return dirs.map(d=>'M50 50 L'+ports[d]).join(' ');
}
function componentSVG(c,i,source){
const id='glass'+i;
const defs='<defs><radialGradient id="'+id+'Off" cx=".32" cy=".2" r=".8"><stop stop-color="#c4ced1" stop-opacity=".8"/><stop offset=".35" stop-color="#77979b" stop-opacity=".65"/><stop offset="1" stop-color="#20303a" stop-opacity=".97"/></radialGradient><radialGradient id="'+id+'On" cx=".42" cy=".4" r=".65"><stop stop-color="#fffffa"/><stop offset=".36" stop-color="#fff6be"/><stop offset=".73" stop-color="#ffd46d"/><stop offset="1" stop-color="#e9a839"/></radialGradient><radialGradient id="'+id+'Aura"><stop stop-color="#fff4b0" stop-opacity=".65"/><stop offset=".5" stop-color="#ffe285" stop-opacity=".26"/><stop offset="1" stop-color="#ffcb5f" stop-opacity="0"/></radialGradient><linearGradient id="'+id+'Metal"><stop stop-color="#8e6427"/><stop offset=".25" stop-color="#f5dd91"/><stop offset=".55" stop-color="#bd9448"/><stop offset=".8" stop-color="#f8dfa1"/><stop offset="1" stop-color="#765020"/></linearGradient><linearGradient id="'+id+'Steel"><stop stop-color="#42556a"/><stop offset=".35" stop-color="#9db2bb"/><stop offset=".6" stop-color="#6b8596"/><stop offset="1" stop-color="#2f435d"/></linearGradient></defs>';
let icon='';
if(source){icon='<ellipse cx="51" cy="58" rx="24" ry="24" fill="#0e1c34" opacity=".5"/><circle cx="50" cy="50" r="23" fill="url(#'+id+'Steel)" stroke="#1a2a42" stroke-width="2"/><circle cx="50" cy="50" r="18" fill="#142c42" stroke="#b5c7c7" stroke-width=".8"/><circle cx="50" cy="50" r="13" fill="#294252" stroke="#dcbb71" stroke-width="1.5"/><path class="source-aura" d="M54 34 40 53h10l-4 14 16-22H51Z" fill="#ffe8a3"/><path d="M39 32q10-7 21 0" stroke="#e9f2ef" stroke-opacity=".5" stroke-linecap="round" stroke-width="1.5"/>';}
else if(c.bulb){
const glass='M35 37C35 15 65 15 65 37C65 47 57 49 57 57H43C43 49 35 47 35 37Z';
icon='<circle class="bulb-aura" cx="50" cy="37" r="40" fill="url(#'+id+'Aura)"/><ellipse cx="51" cy="72" rx="19" ry="13" fill="#0d1e36" opacity=".6"/><ellipse cx="50" cy="68" rx="17" ry="13" fill="url(#'+id+'Metal)" stroke="#705025" stroke-width="1.5"/><ellipse cx="50" cy="66" rx="12" ry="8" fill="#a97732" stroke="#f4d58b" stroke-width=".8"/><path class="bulb-off" d="'+glass+'" fill="url(#'+id+'Off)" stroke="#9fadb0" stroke-width="1"/><path class="bulb-on bulb-glass-lit" d="'+glass+'" fill="url(#'+id+'On)" stroke="#fff0bb" stroke-width="1"/><path d="M44 55V43l3-6 3 7 3-7 3 6v12" class="filament"/><path d="M42 29q-5 6-3 13" stroke="#fff" stroke-opacity=".62" stroke-width="2.6" stroke-linecap="round"/><ellipse cx="57" cy="28" rx="2.3" ry="1.5" fill="#f9ffff" opacity=".65"/><path d="M43 56h14v9q-7 6-14 0Z" fill="url(#'+id+'Steel)" stroke="#31424b" stroke-width=".9"/><path d="M43 58l14 1m-14 2 14 1m-14 2 14 1" stroke="#243341" stroke-width="1.4"/><path d="M46 68h8" stroke="#eee0ab" stroke-width="1.5" stroke-linecap="round"/>';
}
return icon?'<svg class="component" viewBox="0 0 100 100" aria-hidden="true">'+defs+icon+'</svg>':'';
}
function tileMarkup(c,i,source){
const path=cablePath(c.mask);
return '<div class="tile-inner"><svg viewBox="0 0 100 100" aria-hidden="true"><g class="wire-paths"><path d="'+path+'" class="cable-shadow"/><path d="'+path+'" class="cable-glow"/><path d="'+path+'" class="cable-rim"/><path d="'+path+'" class="cable-jacket"/><path d="'+path+'" class="cable-core"/><path d="'+path+'" class="cable-highlight"/></g></svg></div>'+componentSVG(c,i,source)+(c.fixed?'<span class="lock" aria-hidden="true">▣</span>':'');
}
root.tileMarkup=tileMarkup;
})(typeof window!=='undefined'?window:globalThis);

