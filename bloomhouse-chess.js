"use strict";


const PIECE_NAME = {
  K:["Foundation Crown","King"], Q:["Preventive Bloom","Queen"], B:["Witness Spire","Bishop"],
  N:["Garden Sentinel","Knight"], R:["Sanctuary Tower","Rook"], P:["Petition Bloom","Pawn"]
};

const boardEl = document.getElementById("board");
const logEl = document.getElementById("moveLog");
const dialogueEl = document.getElementById("dialogue");
const turnLine = document.getElementById("turnLine");
const gameStateLabel = document.getElementById("gameStateLabel");
const boardMessage = document.getElementById("boardMessage");
const messageTitle = document.getElementById("messageTitle");
const messageBody = document.getElementById("messageBody");
const resetBtn = document.getElementById("resetBtn");
const messageReset = document.getElementById("messageReset");
const undoBtn = document.getElementById("undoBtn");
const legendEl = document.getElementById("legend");

const files = "abcdefgh";
const values = {p:100,n:320,b:330,r:500,q:900,k:20000};
const centerBonus = [
  0,0,0,0,0,0,0,0,
  0,4,6,8,8,6,4,0,
  0,6,10,12,12,10,6,0,
  0,8,12,18,18,12,8,0,
  0,8,12,18,18,12,8,0,
  0,6,10,12,12,10,6,0,
  0,4,6,8,8,6,4,0,
  0,0,0,0,0,0,0,0
];

let state;
let selected = null;
let selectedMoves = [];
let lastMove = null;
let history = [];
let movePairs = [];
let thinking = false;
let gameOver = false;

function initialState(){
  return {
    board:[
      "r","n","b","q","k","b","n","r",
      "p","p","p","p","p","p","p","p",
      null,null,null,null,null,null,null,null,
      null,null,null,null,null,null,null,null,
      null,null,null,null,null,null,null,null,
      null,null,null,null,null,null,null,null,
      "P","P","P","P","P","P","P","P",
      "R","N","B","Q","K","B","N","R"
    ],
    turn:"w",
    castle:{wK:true,wQ:true,bK:true,bQ:true},
    ep:null,
    halfmove:0,
    fullmove:1
  };
}

function cloneState(s){
  return {board:s.board.slice(),turn:s.turn,castle:{...s.castle},ep:s.ep,halfmove:s.halfmove,fullmove:s.fullmove};
}
function colorOf(p){ return p === p?.toUpperCase() ? "w" : "b"; }
function rc(i){ return [Math.floor(i/8),i%8]; }
function idx(r,c){ return r*8+c; }
function inBounds(r,c){ return r>=0&&r<8&&c>=0&&c<8; }
function squareName(i){ const [r,c]=rc(i); return files[c]+(8-r); }

function isAttacked(s, sq, by){
  const b=s.board, [r,c]=rc(sq);
  const pawn = by==="w" ? "P":"p";
  const pawnRow = r + (by==="w" ? 1 : -1);
  for(const dc of [-1,1]){
    const cc=c+dc;
    if(inBounds(pawnRow,cc) && b[idx(pawnRow,cc)]===pawn) return true;
  }
  const knight=by==="w"?"N":"n";
  for(const [dr,dc] of [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]]){
    const rr=r+dr,cc=c+dc;
    if(inBounds(rr,cc)&&b[idx(rr,cc)]===knight) return true;
  }
  const king=by==="w"?"K":"k";
  for(let dr=-1;dr<=1;dr++) for(let dc=-1;dc<=1;dc++) if(dr||dc){
    const rr=r+dr,cc=c+dc;
    if(inBounds(rr,cc)&&b[idx(rr,cc)]===king) return true;
  }
  const bishop=by==="w"?"B":"b", rook=by==="w"?"R":"r", queen=by==="w"?"Q":"q";
  for(const [dr,dc] of [[-1,-1],[-1,1],[1,-1],[1,1]]){
    let rr=r+dr,cc=c+dc;
    while(inBounds(rr,cc)){
      const p=b[idx(rr,cc)];
      if(p){ if(p===bishop||p===queen) return true; break; }
      rr+=dr;cc+=dc;
    }
  }
  for(const [dr,dc] of [[-1,0],[1,0],[0,-1],[0,1]]){
    let rr=r+dr,cc=c+dc;
    while(inBounds(rr,cc)){
      const p=b[idx(rr,cc)];
      if(p){ if(p===rook||p===queen) return true; break; }
      rr+=dr;cc+=dc;
    }
  }
  return false;
}

function kingIndex(s,color){
  return s.board.indexOf(color==="w"?"K":"k");
}
function inCheck(s,color){
  const k=kingIndex(s,color);
  return k>=0 && isAttacked(s,k,color==="w"?"b":"w");
}

function pseudoMoves(s, color=s.turn){
  const moves=[], b=s.board;
  const push=(from,to,extra={})=>moves.push({from,to,...extra});
  for(let from=0;from<64;from++){
    const p=b[from]; if(!p||colorOf(p)!==color) continue;
    const type=p.toLowerCase(), [r,c]=rc(from);

    if(type==="p"){
      const dir=color==="w"?-1:1, start=color==="w"?6:1, promo=color==="w"?0:7;
      const r1=r+dir;
      if(inBounds(r1,c)&&!b[idx(r1,c)]){
        const to=idx(r1,c);
        push(from,to,r1===promo?{promotion:"q"}:{});
        const r2=r+2*dir;
        if(r===start&&!b[idx(r2,c)]) push(from,idx(r2,c),{double:true});
      }
      for(const dc of [-1,1]){
        const rr=r+dir,cc=c+dc;if(!inBounds(rr,cc))continue;
        const to=idx(rr,cc), target=b[to];
        if(target&&colorOf(target)!==color) push(from,to,rr===promo?{promotion:"q",capture:true}:{capture:true});
        else if(s.ep===to) push(from,to,{ep:true,capture:true});
      }
    }

    if(type==="n"){
      for(const [dr,dc] of [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]]){
        const rr=r+dr,cc=c+dc;if(!inBounds(rr,cc))continue;
        const to=idx(rr,cc),t=b[to]; if(!t||colorOf(t)!==color) push(from,to,{capture:!!t});
      }
    }

    if(type==="b"||type==="r"||type==="q"){
      const dirs=[];
      if(type==="b"||type==="q") dirs.push([-1,-1],[-1,1],[1,-1],[1,1]);
      if(type==="r"||type==="q") dirs.push([-1,0],[1,0],[0,-1],[0,1]);
      for(const [dr,dc] of dirs){
        let rr=r+dr,cc=c+dc;
        while(inBounds(rr,cc)){
          const to=idx(rr,cc),t=b[to];
          if(!t) push(from,to);
          else{ if(colorOf(t)!==color) push(from,to,{capture:true}); break; }
          rr+=dr;cc+=dc;
        }
      }
    }

    if(type==="k"){
      for(let dr=-1;dr<=1;dr++)for(let dc=-1;dc<=1;dc++)if(dr||dc){
        const rr=r+dr,cc=c+dc;if(!inBounds(rr,cc))continue;
        const to=idx(rr,cc),t=b[to];if(!t||colorOf(t)!==color)push(from,to,{capture:!!t});
      }
      const enemy=color==="w"?"b":"w";
      if(!inCheck(s,color)){
        if(color==="w"&&from===60){
          if(s.castle.wK&&!b[61]&&!b[62]&&b[63]==="R"&&!isAttacked(s,61,enemy)&&!isAttacked(s,62,enemy)) push(60,62,{castle:"K"});
          if(s.castle.wQ&&!b[59]&&!b[58]&&!b[57]&&b[56]==="R"&&!isAttacked(s,59,enemy)&&!isAttacked(s,58,enemy)) push(60,58,{castle:"Q"});
        }
        if(color==="b"&&from===4){
          if(s.castle.bK&&!b[5]&&!b[6]&&b[7]==="r"&&!isAttacked(s,5,enemy)&&!isAttacked(s,6,enemy)) push(4,6,{castle:"K"});
          if(s.castle.bQ&&!b[3]&&!b[2]&&!b[1]&&b[0]==="r"&&!isAttacked(s,3,enemy)&&!isAttacked(s,2,enemy)) push(4,2,{castle:"Q"});
        }
      }
    }
  }
  return moves;
}

function applyMove(s,m){
  const n=cloneState(s), b=n.board, p=b[m.from], color=colorOf(p), type=p.toLowerCase();
  const captured = m.ep ? b[m.to + (color==="w"?8:-8)] : b[m.to];
  b[m.to]=p; b[m.from]=null;
  if(m.ep) b[m.to + (color==="w"?8:-8)] = null;
  if(m.promotion) b[m.to]=color==="w"?m.promotion.toUpperCase():m.promotion.toLowerCase();
  if(m.castle==="K"){
    if(color==="w"){b[61]=b[63];b[63]=null;} else {b[5]=b[7];b[7]=null;}
  }
  if(m.castle==="Q"){
    if(color==="w"){b[59]=b[56];b[56]=null;} else {b[3]=b[0];b[0]=null;}
  }
  if(type==="k"){
    if(color==="w"){n.castle.wK=false;n.castle.wQ=false;} else {n.castle.bK=false;n.castle.bQ=false;}
  }
  if(type==="r"){
    if(m.from===63)n.castle.wK=false;if(m.from===56)n.castle.wQ=false;if(m.from===7)n.castle.bK=false;if(m.from===0)n.castle.bQ=false;
  }
  if(captured==="R"){if(m.to===63)n.castle.wK=false;if(m.to===56)n.castle.wQ=false;}
  if(captured==="r"){if(m.to===7)n.castle.bK=false;if(m.to===0)n.castle.bQ=false;}
  n.ep = m.double ? m.from + (color==="w"?-8:8) : null;
  n.halfmove = (type==="p"||captured)?0:s.halfmove+1;
  n.turn = color==="w"?"b":"w";
  n.fullmove = s.fullmove + (color==="b"?1:0);
  return n;
}

function legalMoves(s){
  const color=s.turn;
  return pseudoMoves(s,color).filter(m=>!inCheck(applyMove(s,m),color));
}

function notation(s,m,next){
  if(m.castle) return m.castle==="K"?"O-O":"O-O-O";
  const p=s.board[m.from], type=p.toUpperCase();
  let txt=(type==="P"?"":type)+squareName(m.from)+(m.capture?"×":"–")+squareName(m.to);
  if(m.promotion) txt+="="+m.promotion.toUpperCase();
  if(inCheck(next,next.turn)){
    const lm=legalMoves(next); txt += lm.length===0?"#":"+";
  }
  return txt;
}

function evaluate(s){
  let score=0;
  for(let i=0;i<64;i++){
    const p=s.board[i]; if(!p)continue;
    const sign=colorOf(p)==="b"?1:-1;
    const t=p.toLowerCase();
    score += sign*values[t];
    if(t!=="k") score += sign*centerBonus[i];
    const [r]=rc(i);
    if(t==="p") score += sign*((colorOf(p)==="b"?r:(7-r))*5);
  }
  if(inCheck(s,"w")) score+=18;
  if(inCheck(s,"b")) score-=18;
  return score;
}

function minimax(s,depth,alpha,beta){
  const lm=legalMoves(s);
  if(depth===0||lm.length===0){
    if(lm.length===0&&inCheck(s,s.turn)) return s.turn==="b"?-999999:999999;
    return evaluate(s);
  }
  if(s.turn==="b"){
    let best=-Infinity;
    for(const m of lm){
      best=Math.max(best,minimax(applyMove(s,m),depth-1,alpha,beta));alpha=Math.max(alpha,best);if(beta<=alpha)break;
    }
    return best;
  }else{
    let best=Infinity;
    for(const m of lm){
      best=Math.min(best,minimax(applyMove(s,m),depth-1,alpha,beta));beta=Math.min(beta,best);if(beta<=alpha)break;
    }
    return best;
  }
}

function dianeMove(){
  if(gameOver||state.turn!=="b") return;
  thinking=true; turnLine.innerHTML='DIANE CROSS // <strong>CONSIDERING OUTCOMES…</strong>';
  dialogue("Give me a moment. I promised not to cheat.");
  setTimeout(()=>{
    const lm=legalMoves(state);
    if(!lm.length){thinking=false;finishIfNeeded();return;}
    const scored=lm.map(m=>{
      const next=applyMove(state,m);
      let score=minimax(next,2,-Infinity,Infinity);
      if(m.capture) score+=8;
      if(inCheck(next,"w")) score+=12;
      return {m,score};
    }).sort((a,b)=>b.score-a.score);
    const top=scored[0].score;
    const pool=scored.filter(x=>x.score>=top-18).slice(0,4);
    const choice=pool[Math.floor(Math.random()*pool.length)].m;
    commitMove(choice,true);
    thinking=false;
  },340);
}

function commitMove(m,isDiane=false){
  const before=cloneState(state);
  const moving=before.board[m.from];
  const captured = m.ep ? before.board[m.to + (colorOf(moving)==="w"?8:-8)] : before.board[m.to];
  const next=applyMove(state,m);
  const note=notation(before,m,next);
  history.push({state:before,lastMove:lastMove ? {...lastMove} : null,movePairs:JSON.parse(JSON.stringify(movePairs))});
  state=next; lastMove={from:m.from,to:m.to};
  recordMove(note,isDiane);
  selected=null;selectedMoves=[];
  render();
  petalBurst(isDiane?5:3);
  if(captured){
    dialogue(isDiane ? "That piece was carrying too much future." : "Good. You saw the hinge.");
  } else if(inCheck(state,state.turn)){
    dialogue(isDiane ? "Check. Not a verdict. A warning." : "There you are.");
  } else if(isDiane){
    const lines=["Your turn. I’m curious what you preserve.","A quiet move can still alter the whole room.","Position first. Panic is expensive.","I don’t chase outcomes. I arrive before they are needed."];
    dialogue(lines[Math.floor(Math.random()*lines.length)]);
  } else {
    const lines=["Mm. Intentional. I like that.","You’re making the board answer questions.","Keep going. Don’t rush the position.","Interesting. You’re not playing the piece; you’re playing the consequence."];
    dialogue(lines[Math.floor(Math.random()*lines.length)]);
  }
  if(!finishIfNeeded() && state.turn==="b") dianeMove();
}

function finishIfNeeded(){
  const lm=legalMoves(state);
  if(lm.length) return false;
  gameOver=true;
  const check=inCheck(state,state.turn);
  if(check){
    const dianeWon=state.turn==="w";
    messageTitle.textContent=dianeWon?"CHECKMATE // DIANE CROSS":"CHECKMATE // IVORY BLOOM";
    messageBody.textContent=dianeWon
      ?"The board closes here. The person does not. Again?"
      :"Excellent. Keep that line of thought. You found the future I missed.";
    dialogue(dianeWon?"The board closes here. The person does not. Shall we play again?":"Excellent. You found the future I missed.");
  } else {
    messageTitle.textContent="STALEMATE // NO CLAIM";
    messageBody.textContent="No legal move. No winner. A very Bloomhouse conclusion.";
    dialogue("No one loses. Bureaucratically inconvenient. Personally delightful.");
  }
  boardMessage.classList.add("show");
  return true;
}

function recordMove(note,isDiane){
  if(!isDiane){
    movePairs.push([note,""]);
  } else {
    if(!movePairs.length||movePairs[movePairs.length-1][1]) movePairs.push(["",note]);
    else movePairs[movePairs.length-1][1]=note;
  }
  renderLog();
}

function renderLog(){
  logEl.innerHTML="";
  movePairs.forEach((pair,i)=>{
    const row=document.createElement("div");row.className="move-row";
    row.innerHTML=`<span>${i+1}.</span><span>${pair[0]||"—"}</span><span class="diane-move">${pair[1]||"…"}</span>`;
    logEl.appendChild(row);
  });
  logEl.scrollTop=logEl.scrollHeight;
}

function render(){
  boardEl.innerHTML="";
  const legal=legalMoves(state);
  for(let i=0;i<64;i++){
    const [r,c]=rc(i), sq=document.createElement("button");
    sq.className="square "+(((r+c)%2)?"dark":"light");
    sq.dataset.index=i;
    sq.setAttribute("aria-label",squareName(i));
    if(selected===i)sq.classList.add("selected");
    const m=selectedMoves.find(x=>x.to===i);
    if(m)sq.classList.add(m.capture?"capture":"legal");
    if(lastMove&&(lastMove.from===i||lastMove.to===i))sq.classList.add("last");
    const p=state.board[i];
    if(p&&p.toLowerCase()==="k"&&inCheck(state,colorOf(p)))sq.classList.add("check");
    if(r===7){const f=document.createElement("span");f.className="coord file";f.textContent=files[c];sq.appendChild(f);}
    if(c===0){const rank=document.createElement("span");rank.className="coord rank";rank.textContent=8-r;sq.appendChild(rank);}
    if(p){
      const img=document.createElement("img");img.className="piece";
      const key=(colorOf(p)==="w"?"w":"b")+p.toUpperCase();
      img.src=PIECE_ART[key];img.alt=(colorOf(p)==="w"?"Ivory ":"Midnight ")+(PIECE_NAME[p.toUpperCase()]?.[1]||p);
      sq.appendChild(img);
    }
    sq.addEventListener("click",()=>onSquare(i));
    boardEl.appendChild(sq);
  }
  if(gameOver) turnLine.innerHTML='GAME STATUS // <strong>COMPLETE</strong>';
  else if(thinking) turnLine.innerHTML='DIANE CROSS // <strong>CONSIDERING OUTCOMES…</strong>';
  else turnLine.innerHTML=state.turn==="w"?'CURRENT TURN // <strong>IVORY BLOOM</strong>':'CURRENT TURN // <strong>MIDNIGHT BLOOM</strong>';
  const ply=movePairs.length;
  gameStateLabel.textContent=ply<5?"Opening":ply<14?"Middlegame":"Endgame";
  undoBtn.disabled=history.length<2||thinking;
}

function onSquare(i){
  if(gameOver||thinking||state.turn!=="w")return;
  const p=state.board[i];
  if(selected!==null){
    const move=selectedMoves.find(m=>m.to===i);
    if(move){commitMove(move,false);return;}
  }
  if(p&&colorOf(p)==="w"){
    selected=i;selectedMoves=legalMoves(state).filter(m=>m.from===i);render();
  } else {
    selected=null;selectedMoves=[];render();
  }
}

function dialogue(text){dialogueEl.textContent=text;}

function resetGame(){
  state=initialState();selected=null;selectedMoves=[];lastMove=null;history=[];movePairs=[];thinking=false;gameOver=false;
  boardMessage.classList.remove("show");
  dialogue("No jurisdiction. No future sight. No Bloomhouse powers. Just skill. Have fun.");
  renderLog();render();petalBurst(9);
}

function undoPair(){
  if(thinking||history.length<2)return;
  // Step back to the position before the player's previous move.
  const snap=history[history.length-2];
  state=cloneState(snap.state);lastMove=snap.lastMove?{...snap.lastMove}:null;movePairs=JSON.parse(JSON.stringify(snap.movePairs));
  history=history.slice(0,-2);selected=null;selectedMoves=[];gameOver=false;boardMessage.classList.remove("show");
  dialogue("Reconsidered. The record has been amended.");
  renderLog();render();
}

function petalBurst(n=5){
  for(let i=0;i<n;i++){
    const p=document.createElement("i");p.className="petal";p.style.left=(8+Math.random()*84)+"vw";
    p.style.setProperty("--drift",(Math.random()*180-90)+"px");p.style.animationDuration=(3.8+Math.random()*2.6)+"s";
    p.style.animationDelay=(Math.random()*.35)+"s";document.body.appendChild(p);setTimeout(()=>p.remove(),7000);
  }
}

function buildLegend(){
  legendEl.innerHTML="";
  for(const t of ["K","Q","B","N","R","P"]){
    const row=document.createElement("div");row.className="legend-row";
    row.innerHTML=`<img src="${PIECE_ART["w"+t]}" alt=""><div><strong>${PIECE_NAME[t][0]}</strong><small>${PIECE_NAME[t][1]}</small></div>`;
    legendEl.appendChild(row);
  }
}

resetBtn.addEventListener("click",resetGame);
messageReset.addEventListener("click",resetGame);
undoBtn.addEventListener("click",undoPair);
buildLegend();
resetGame();
