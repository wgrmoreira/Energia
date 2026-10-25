
(()=>{
'use strict';
const $=id=>document.getElementById(id),KEY='energia_remaster_v1';
const names=['Um começo possível','Um passo de cada vez','Encontrar o caminho','Pequenas descobertas','A força de tentar','A primeira vizinhança','Caminhos que se cruzam','Um lugar para chegar','Apoio pelo caminho','Outras perspectivas','O valor do encontro','Ninguém precisa ir só','Um horizonte possível','Olhar com calma','Entre idas e vindas','Novas possibilidades','Dar espaço ao novo','Além do que se vê','Uma pausa, um respiro','O tempo de florescer','O que nos conecta','Recomeçar também é seguir','Quase amanhecer','Há luz por aqui'];
const chapters=['A primeira luz','Encontros','Horizonte','Amanhecer'];
const messages=[
'Você não precisa iluminar tudo de uma vez.',
'Um pequeno passo também é um passo.',
'Você pode mudar de direção e continuar.',
'Nem tudo precisa fazer sentido agora.',
'Tentar de novo pode ser um gesto de cuidado.',
'Celebre o que foi possível hoje.',
'Pedir apoio também é uma forma de coragem.',
'Você merece encontrar espaços de acolhimento.',
'Você não precisa carregar tudo sozinho.',
'Olhar de outro jeito pode abrir um caminho.',
'Seu valor vai além do que você consegue fazer.',
'Há espaço para você, mesmo nos dias difíceis.',
'Você pode ir no seu próprio ritmo.',
'Uma pausa não apaga o caminho percorrido.',
'Sentir dificuldade não é estar fracassando.',
'Você não precisa ter todas as respostas.',
'Mudar de ideia faz parte do caminho.',
'Pequenas conexões podem fazer diferença.',
'Descansar também faz parte de seguir.',
'Seu tempo merece respeito.',
'Você merece cuidado, inclusive de si.',
'Recomeçar não apaga o que você aprendeu.',
'Você chegou até aqui. Pode respirar.',
'Que você encontre acolhimento também fora daqui.'
];
let state={version:1,completed:0,puzzle:null,calm:false,music:true,volume:.35,started:false},persist=true,winTimer=0,angles=[];
function seed(){return window.crypto?.getRandomValues?crypto.getRandomValues(new Uint32Array(1))[0]:Date.now()>>>0;}
try{const raw=JSON.parse(localStorage.getItem(KEY));if(raw&&raw.version===1&&Number.isInteger(raw.completed)&&raw.completed>=0&&raw.completed<=24&&Energy.valid(raw.puzzle)&&raw.completed===(raw.puzzle.done?raw.puzzle.level:raw.puzzle.level-1)){state={...state,...raw};state.puzzle.history=state.puzzle.history.filter(h=>Number.isInteger(h.i)&&h.i>=0&&h.i<state.puzzle.cells.length&&Number.isInteger(h.rot)&&h.rot>=0&&h.rot<4&&!state.puzzle.cells[h.i].fixed).slice(-5000);}}catch(e){}
if(!state.puzzle)state.puzzle=Energy.generate(1,seed());
// Keep an existing journey when its bulbs already satisfy the corrected rule.
if(Energy.evaluate(state.puzzle).solved){state.puzzle.done=true;state.completed=state.puzzle.level;}
const music=$('music');music.volume=.35;
function save(){try{localStorage.setItem(KEY,JSON.stringify(state));}catch(e){persist=false;$('mode-note').textContent='Progresso apenas nesta sessão';}}
function soundLabel(playing){$('sound').setAttribute('aria-pressed',String(playing));$('sound').setAttribute('aria-label',playing?'Pausar música':'Ativar música');$('sound').querySelector('.sound-label').textContent=playing?'Música ligada':'Música desligada';}
async function startMusic(){if(!state.music)return;try{await music.play();soundLabel(true);}catch(e){soundLabel(false);}}
$('sound').onclick=async()=>{if(!music.paused){music.pause();state.music=false;soundLabel(false);}else{state.music=true;await startMusic();}save();};
function buildBoard(){
const p=state.puzzle;$('board').style.gridTemplateColumns='repeat('+p.size+',1fr)';$('board').style.gridTemplateRows='repeat('+p.size+',1fr)';$('board').innerHTML='';angles=p.cells.map(c=>c.rot*90);
p.cells.forEach((c,i)=>{
const b=document.createElement('button');b.className='tile';b.type='button';b.dataset.index=i;b.setAttribute('aria-label','Linha '+(Math.floor(i/p.size)+1)+', coluna '+(i%p.size+1)+(i===p.source?', fonte':c.bulb?', lâmpada':'')+(c.fixed?', fixa':', girar circuito'));b.tabIndex=i===0?0:-1;
b.innerHTML=tileMarkup(c,i,i===p.source);
b.onclick=()=>turn(i,1);b.onkeydown=e=>{if(e.key==='Enter'&&e.shiftKey){e.preventDefault();turn(i,-1);}const dirs={ArrowUp:-p.size,ArrowDown:p.size,ArrowLeft:-1,ArrowRight:1};if(e.key in dirs){e.preventDefault();const next=i+dirs[e.key];if(next>=0&&next<p.cells.length&&!(e.key==='ArrowLeft'&&i%p.size===0)&&!(e.key==='ArrowRight'&&i%p.size===p.size-1)){b.tabIndex=-1;$('board').children[next].tabIndex=0;$('board').children[next].focus();}}};
b.onfocus=()=>{[...$('board').children].forEach(t=>t.tabIndex=t===b?0:-1);};$('board').appendChild(b);});repaint();
}
function renderCity(){
const done=state.completed;updateCity(done);$('completed').textContent=done;$('progress-fill').style.width=done/24*100+'%';$('city-percent').textContent=Math.round(done/24*100)+'%';
$('district-caption').textContent=done===0?'A cidade espera sua primeira luz':done===24?'Amanheceu. Sua cidade está toda iluminada.':['As primeiras janelas se acendem','A vizinhança volta a se encontrar','A luz atravessa o rio','Um novo dia começa a aparecer'][Math.min(3,Math.floor((done-1)/6))];
document.querySelectorAll('.chapters span').forEach((e,i)=>e.classList.toggle('current',i===Math.min(3,Math.floor(done/6))));$('reflection').textContent='“'+messages[Math.max(0,done-1)]+'”';
}
function repaint(custom){
const p=state.puzzle,e=Energy.evaluate(p);$('level-title').textContent=names[p.level-1];$('chapter').textContent='CAPÍTULO '+String(Math.ceil(p.level/6)).padStart(2,'0')+' · '+chapters[Math.floor((p.level-1)/6)].toUpperCase();$('level-badge').innerHTML=String(p.level).padStart(2,'0')+'<span>/24</span>';
$('network').textContent=e.bulbs+' / '+e.totalBulbs;$('bulb-state').textContent=e.bulbs+'/'+e.totalBulbs;$('moves').textContent=p.moves;$('target').textContent=state.calm?'Livre':p.target;
$('locked-key').hidden=!p.cells.some(c=>c.fixed);
[...$('board').children].forEach((el,i)=>{const c=p.cells[i];el.classList.toggle('powered',e.powered.has(i));el.classList.toggle('fixed',!!c.fixed);el.setAttribute('aria-disabled',String(p.done||c.fixed));el.setAttribute('aria-description',e.powered.has(i)?'Com energia':'Sem energia');el.querySelector('.tile-inner').style.transform='rotate('+angles[i]+'deg)';});
$('undo').disabled=p.done||!p.history.length;$('hint').disabled=p.done||(!state.calm&&p.hints>=3);$('hint-count').textContent=state.calm?'∞':Math.max(0,3-p.hints);$('calm').checked=state.calm;$('restart').innerHTML=p.done?'<span>→</span> '+(p.level===24?'Nova jornada':'Próxima fase'):'<span>⟳</span> Recomeçar';
if(p.done){$('status').textContent=p.level===24?'Toda a cidade está iluminada. Obrigado por jogar.':'Todas acesas! Mais uma luz para a cidade.';}else if(custom){$('status').textContent=custom;}else{$('status').textContent=p.level===1?'Leve a energia ϟ até a lâmpada.':e.bulbs+' de '+e.totalBulbs+' lâmpadas acesas. Conecte os fios.';}
if(persist)$('mode-note').textContent=state.calm?'Pistas à vontade':'No seu ritmo';
}
function checkWin(){if(!state.puzzle.done&&Energy.evaluate(state.puzzle).solved){state.puzzle.done=true;state.completed=state.puzzle.level;renderCity();repaint();clearTimeout(winTimer);winTimer=setTimeout(showWin,1000);}save();}
function turn(i,dir){const p=state.puzzle,c=p.cells[i];if(p.done||c.fixed)return;p.history.push({i,rot:c.rot});if(p.history.length>5000)p.history.shift();c.rot=(c.rot+dir+4)%4;angles[i]+=dir*90;p.moves++;repaint();checkWin();}
function showWin(){const p=state.puzzle;if(!p.done)return;$('win-kicker').textContent=p.level===24?'24 FASES · UMA CIDADE ACESA':'FASE '+String(p.level).padStart(2,'0')+' CONCLUÍDA';$('win-title').textContent=p.level===24?'Um novo dia para sua cidade.':p.level%6===0?'Um capítulo de luz se completa.':'A cidade ficou mais viva.';$('win-reflection').textContent='“'+messages[p.level-1]+'”';$('win-stats').textContent=p.moves+' movimentos · '+p.hints+' pistas'+(!state.calm&&p.moves<=p.target&&p.hints===0?' · Dentro da meta ✧':' · Mais um passo dado');$('next').innerHTML=(p.level===24?'Começar uma nova jornada':'Seguir para a próxima luz')+' <span>→</span>';if(!$('win-dialog').open)$('win-dialog').showModal();}
$('undo').onclick=()=>{const p=state.puzzle;if(p.done||!p.history.length)return;const h=p.history.pop();p.cells[h.i].rot=h.rot;angles[h.i]=h.rot*90;repaint('Um passo atrás. Um novo olhar.');save();};
$('hint').onclick=()=>{const p=state.puzzle;if(p.done||(!state.calm&&p.hints>=3))return;const e=Energy.evaluate(p),candidates=p.cells.map((c,i)=>i).filter(i=>!p.cells[i].fixed&&p.cells[i].essential!==false&&Energy.rotate(p.cells[i].mask,p.cells[i].rot)!==p.cells[i].mask);
candidates.sort((a,b)=>Number(e.powered.has(b))-Number(e.powered.has(a)));const i=candidates[0];if(i===undefined)return;const c=p.cells[i];p.history.push({i,rot:c.rot});c.rot=0;angles[i]=Math.ceil(angles[i]/360)*360;p.hints++;p.moves++;repaint('Pista: este fio está na direção certa.');$('board').children[i].classList.add('hinted');setTimeout(()=>{$('board').children[i]?.classList.remove('hinted');},2100);checkWin();};
function advance(){clearTimeout(winTimer);if($('win-dialog').open)$('win-dialog').close();if(state.puzzle.level===24){$('confirm-dialog').showModal();return;}state.puzzle=Energy.generate(state.puzzle.level+1,seed());buildBoard();save();$('board').children[0].focus();}
$('next').onclick=advance;$('admire').onclick=()=>{$('win-dialog').close();$('restart').focus();};
$('restart').onclick=()=>{const p=state.puzzle;if(p.done){advance();return;}p.cells.forEach((c,i)=>c.rot=p.initial[i]);p.history=[];p.moves=0;buildBoard();repaint('Recomeço. As pistas usadas continuam registradas.');save();};
$('calm').onchange=()=>{state.calm=$('calm').checked;repaint();save();};
$('help').onclick=()=>$('help-dialog').showModal();$('close-help').onclick=()=>$('help-dialog').close();
$('begin').onclick=()=>{state.started=true;$('welcome').close();save();startMusic();$('board').children[0].focus();};
$('welcome').addEventListener('cancel',()=>{state.started=true;save();});
$('new-journey').onclick=()=>$('confirm-dialog').showModal();$('cancel-new').onclick=()=>$('confirm-dialog').close();
$('confirm-new').onclick=()=>{clearTimeout(winTimer);$('confirm-dialog').close();state.completed=0;state.puzzle=Energy.generate(1,seed());buildBoard();renderCity();save();};
document.querySelector('.brand').onclick=e=>{e.preventDefault();window.scrollTo({top:0,behavior:'smooth'});};
buildBoard();renderCity();if(!state.started)$('welcome').showModal();save();
})();

