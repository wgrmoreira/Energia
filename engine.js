
/* Victory is defined exclusively by illuminated bulbs. Spare wires are optional. */
(function(root){
'use strict';
const directions=[[-1,0,1,4],[0,1,2,8],[1,0,4,1],[0,-1,8,2]];
function rng(seed){let a=seed>>>0;return()=>{a+=0x6D2B79F5;let t=a;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296;};}
function rotate(mask,turns=1){turns=((turns%4)+4)%4;return((mask<<turns)|(mask>>(4-turns)))&15;}
function neighbor(i,d,n){const r=Math.floor(i/n)+directions[d][0],c=i%n+directions[d][1];return r>=0&&r<n&&c>=0&&c<n?r*n+c:-1;}
function evaluate(p){
const masks=p.cells.map(c=>rotate(c.mask,c.rot)),powered=new Set([p.source]),q=[p.source];let leaks=0;
for(let k=0;k<q.length;k++){const i=q[k];for(let d=0;d<4;d++){if(!(masks[i]&directions[d][2]))continue;const j=neighbor(i,d,p.size);if(j<0||!(masks[j]&directions[d][3])){leaks++;continue;}if(!powered.has(j)){powered.add(j);q.push(j);}}}
const totalBulbs=p.cells.filter(c=>c.bulb).length,bulbs=p.cells.filter((c,i)=>c.bulb&&powered.has(i)).length;
return{powered,leaks,bulbs,totalBulbs,solved:totalBulbs>0&&bulbs===totalBulbs};
}
function generate(level,seed){
const random=rng(seed),n=3+Math.floor((level-1)/6),count=n*n;
let source=Math.floor(n/2)*n+Math.floor(n/2);
const masks=Array(count).fill(0),seen=new Set([source]),stack=[source],parent=Array(count).fill(null),depth=Array(count).fill(0);
while(stack.length){const pick=random()<.8?stack.length-1:Math.floor(random()*stack.length),i=stack[pick],options=[];
for(let d=0;d<4;d++){const j=neighbor(i,d,n);if(j>=0&&!seen.has(j))options.push([d,j]);}
if(!options.length){stack.splice(pick,1);continue;}
const[d,j]=options[Math.floor(random()*options.length)];masks[i]|=directions[d][2];masks[j]|=directions[d][3];seen.add(j);parent[j]=i;depth[j]=depth[i]+1;stack.push(j);}
const leaves=masks.map((mask,i)=>({mask,i})).filter(c=>c.i!==source&&(c.mask&(c.mask-1))===0).map(c=>c.i);
leaves.sort((a,b)=>depth[b]-depth[a]);const desired=level<=3?1:level<=6?2:level<=12?3:level<=18?4:5;
let bulbs=new Set(leaves.slice(0,desired)),essential=new Set([source]);
for(const b of bulbs){let i=b;while(i!==null){essential.add(i);i=parent[i];}}
if(level===1){source=6;bulbs=new Set([2]);essential=new Set([6,3,4,1,2]);masks.fill(0);masks[6]=1;masks[3]=6;masks[4]=9;masks[1]=6;masks[2]=8;}
const decoys=[3,5,6,7,9,10,11,12,13,14];
const cells=masks.map((mask,i)=>{
let m=0;if(essential.has(i)){for(let d=0;d<4;d++)if((mask&directions[d][2])&&essential.has(neighbor(i,d,n)))m|=directions[d][2];}
else m=decoys[Math.floor(random()*decoys.length)];
return{mask:m,rot:0,fixed:false,bulb:bulbs.has(i),essential:essential.has(i)};
});
const lockCount=Math.floor((level-1)/6),eligible=cells.map((c,i)=>i).filter(i=>i!==source&&cells[i].essential&&!cells[i].bulb&&cells[i].mask!==15);
for(let k=0;k<lockCount&&eligible.length;k++){const pos=Math.floor(random()*eligible.length),i=eligible.splice(pos,1)[0];cells[i].fixed=true;}
const p={level,seed:seed>>>0,size:n,source,cells,moves:0,hints:0,history:[],initial:[],target:0,done:false};
let attempts=0;do{for(const c of cells)c.rot=c.fixed?0:Math.floor(random()*4);attempts++;}while(evaluate(p).solved&&attempts<100);
if(evaluate(p).solved)return generate(level,(seed+1)>>>0);
p.initial=cells.map(c=>c.rot);
p.target=Math.max(1,Math.ceil(cells.reduce((s,c)=>{if(!c.essential)return s;let k=0;while(rotate(c.mask,(c.rot+k)%4)!==c.mask&&k<4)k++;return s+k;},0)*1.35));return p;
}
function valid(p){
if(!p||!Number.isInteger(p.level)||p.level<1||p.level>24||p.size!==3+Math.floor((p.level-1)/6)||!Array.isArray(p.cells)||p.cells.length!==p.size*p.size||!Number.isInteger(p.source)||p.source<0||p.source>=p.cells.length||!Array.isArray(p.initial)||p.initial.length!==p.cells.length||!p.initial.every(r=>Number.isInteger(r)&&r>=0&&r<4)||!Number.isSafeInteger(p.moves)||p.moves<0||!Number.isInteger(p.hints)||p.hints<0||!Array.isArray(p.history))return false;
if(!p.cells.every(c=>Number.isInteger(c.mask)&&c.mask>0&&c.mask<=15&&Number.isInteger(c.rot)&&c.rot>=0&&c.rot<4&&(!c.fixed||c.rot===0)))return false;
return evaluate({...p,cells:p.cells.map(c=>({...c,rot:0}))}).solved;
}
const api={rng,rotate,neighbor,evaluate,generate,valid};root.Energy=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);

