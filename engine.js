
/* Energia: pure circuit rules, shared by the browser and the validation script. */
(function(root){
'use strict';
const directions=[[-1,0,1,4],[0,1,2,8],[1,0,4,1],[0,-1,8,2]];
function rng(seed){let a=seed>>>0;return()=>{a+=0x6D2B79F5;let t=a;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296;};}
function rotate(mask,turns=1){turns=((turns%4)+4)%4;return((mask<<turns)|(mask>>(4-turns)))&15;}
function neighbor(i,d,n){const r=Math.floor(i/n)+directions[d][0],c=i%n+directions[d][1];return r>=0&&r<n&&c>=0&&c<n?r*n+c:-1;}
function evaluate(p){
const masks=p.cells.map(c=>rotate(c.mask,c.rot)),powered=new Set([p.source]),q=[p.source];let leaks=0;
for(let k=0;k<q.length;k++){const i=q[k];for(let d=0;d<4;d++){if(!(masks[i]&directions[d][2]))continue;const j=neighbor(i,d,p.size);if(j<0||!(masks[j]&directions[d][3])){leaks++;continue;}if(!powered.has(j)){powered.add(j);q.push(j);}}}
return{powered,leaks,solved:powered.size===p.cells.length&&leaks===0,bulbs:p.cells.filter((c,i)=>c.bulb&&powered.has(i)).length};
}
function generate(level,seed){
const random=rng(seed),n=3+Math.floor((level-1)/6),count=n*n,source=Math.floor(n/2)*n+Math.floor(n/2);
const masks=Array(count).fill(0),seen=new Set([source]),stack=[source];
while(stack.length){const pick=random()<.78?stack.length-1:Math.floor(random()*stack.length),i=stack[pick],options=[];
for(let d=0;d<4;d++){const j=neighbor(i,d,n);if(j>=0&&!seen.has(j))options.push([d,j]);}
if(!options.length){stack.splice(pick,1);continue;}
const[d,j]=options[Math.floor(random()*options.length)];masks[i]|=directions[d][2];masks[j]|=directions[d][3];seen.add(j);stack.push(j);}
const lockCount=Math.floor((level-1)/6),eligible=masks.map((m,i)=>i).filter(i=>i!==source&&((masks[i]&(masks[i]-1))!==0));
const locked=new Set();while(locked.size<lockCount&&eligible.length){const k=Math.floor(random()*eligible.length);locked.add(eligible.splice(k,1)[0]);}
const cells=masks.map((mask,i)=>({mask,rot:locked.has(i)?0:Math.floor(random()*4),fixed:locked.has(i),bulb:i!==source&&(mask&(mask-1))===0}));
let p={level,seed:seed>>>0,size:n,source,cells,moves:0,hints:0,history:[],initial:[],target:0,done:false};
if(evaluate(p).solved){const i=cells.findIndex(c=>!c.fixed&&c.mask!==15);cells[i].rot=(cells[i].rot+1)%4;}
p.initial=cells.map(c=>c.rot);
const effort=cells.reduce((s,c)=>{let k=0;while(rotate(c.mask,(c.rot+k)%4)!==c.mask&&k<4)k++;return s+k;},0);
p.target=Math.ceil(effort*1.3);return p;
}
function valid(p){if(!p||!Number.isInteger(p.level)||p.level<1||p.level>24||p.size!==3+Math.floor((p.level-1)/6)||!Array.isArray(p.cells)||p.cells.length!==p.size*p.size||!Number.isInteger(p.source)||p.source<0||p.source>=p.cells.length||!Array.isArray(p.initial)||p.initial.length!==p.cells.length||!p.initial.every(r=>Number.isInteger(r)&&r>=0&&r<4)||!Number.isSafeInteger(p.moves)||p.moves<0||!Number.isInteger(p.hints)||p.hints<0||!Array.isArray(p.history))return false;
if(!p.cells.every(c=>Number.isInteger(c.mask)&&c.mask>0&&c.mask<=15&&Number.isInteger(c.rot)&&c.rot>=0&&c.rot<4&&(!c.fixed||c.rot===0)))return false;
return evaluate({...p,cells:p.cells.map(c=>({...c,rot:0}))}).solved;
}
const api={rng,rotate,neighbor,evaluate,generate,valid};root.Energy=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);

