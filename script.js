const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

const bootGate = $("#bootGate");
const initializeButton = $("#initializeButton");
const site = $("#site");
const compileOutput = $("#compileOutput");
const finalTransmission = $("#finalTransmission");
const accessButton = $("#accessButton");
const registry = $("#registry");
const variantForm = $("#variantForm");
const clearanceCard = $("#clearanceCard");

let audioEnabled = true;
let audioCtx, master, humOsc, humGain;

const compilation = [
  {t:"[00:00:00.000] // NEXUS KERNEL INITIALISING", c:"system"},
  {t:"[00:00:00.184] loading reality_map.bin ................ OK"},
  {t:"[00:00:00.416] mounting spacetime coordinates ......... OK"},
  {t:"[00:00:00.751] resolving origin universe .............. MuSyChEN–626", c:"violet"},
  {t:"[00:00:01.044] checksum 626: A7F9-11C0-Δ441 ............ VALID"},
  {t:"[00:00:01.337] scanning adjacent branches .............."},
  {t:"[00:00:01.822] branch_017 detected"},
  {t:"[00:00:02.006] branch_108 detected"},
  {t:"[00:00:02.191] branch_???? detected", c:"critical"},
  {t:"[00:00:02.442] WARNING: variant count exceeds model capacity", c:"critical"},
  {t:"[00:00:02.788] establishing NEXUS handshake ........... ESTABLISHED", c:"system"},
  {t:"[00:00:03.184] calculating dimensional integrity ....... 41.7%"},
  {t:"[00:00:03.503] recalculating ............................ 29.3%", c:"critical"},
  {t:"[00:00:03.884] temporal boundary degradation detected", c:"critical"},
  {t:"[00:00:04.229] compiling incoming transmission ........."},
  {t:"[00:00:04.611] decrypting sender signature ............. UNKNOWN"},
  {t:"[00:00:05.023] recipient signature ..................... MATCH FOUND", c:"system"},
  {t:"[00:00:05.412] WARNING: CROSS-REALITY IDENTITY COLLISION", c:"critical"},
  {t:"[00:00:05.852] preparing visual layer .................. OK"},
  {t:"[00:00:06.211] preparing message ....................... OK"},
  {t:"[00:00:06.488] TRANSMISSION COMPILED.", c:"system"},
];

function initAudio() {
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  master = audioCtx.createGain();
  master.gain.value = .20;
  master.connect(audioCtx.destination);

  humOsc = audioCtx.createOscillator();
  humGain = audioCtx.createGain();
  humOsc.type = "sine";
  humOsc.frequency.value = 56;
  humGain.gain.value = .10;
  humOsc.connect(humGain).connect(master);
  humOsc.start();
}

function blip(freq=420, duration=.045, gain=.045) {
  if (!audioEnabled || !audioCtx) return;
  const o = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  o.type = Math.random() > .7 ? "square" : "sine";
  o.frequency.value = freq + Math.random()*100;
  g.gain.setValueAtTime(gain, audioCtx.currentTime);
  g.gain.exponentialRampToValueAtTime(.001, audioCtx.currentTime + duration);
  o.connect(g).connect(master);
  o.start();
  o.stop(audioCtx.currentTime + duration);
}

function glitchBurst() {
  if (!audioEnabled || !audioCtx) return;
  for (let i=0;i<4;i++) setTimeout(()=>blip(180+i*90,.025,.025),i*35);
}

async function typeLine(text, cls="") {
  const line = document.createElement("div");
  if (cls) line.className = cls;
  const cursor = document.createElement("span");
  cursor.className = "cursor";
  line.appendChild(cursor);
  compileOutput.appendChild(line);

  let shown = "";
  for (let i=0;i<text.length;i++) {
    shown += text[i];
    line.firstChild?.remove();
    line.textContent = shown;
    line.appendChild(cursor);
    if (i % 3 === 0) blip(370 + (i%8)*18,.025,.018);
    await new Promise(r=>setTimeout(r, 8 + Math.random()*13));
  }
  cursor.remove();
}

async function runCompilation() {
  for (let i=0;i<compilation.length;i++) {
    await typeLine(compilation[i].t, compilation[i].c || "");
    if ([8,12,17].includes(i)) glitchBurst();
    await new Promise(r=>setTimeout(r, 95));
  }
  await new Promise(r=>setTimeout(r, 450));
  compileOutput.style.display = "none";
  finalTransmission.classList.remove("is-hidden");
  glitchBurst();
}

initializeButton.addEventListener("click", async () => {
  initAudio();
  bootGate.style.display = "none";
  site.classList.remove("hidden-site");
  runCompilation();
});

$("#audioToggle").addEventListener("click", (e) => {
  audioEnabled = !audioEnabled;
  e.target.textContent = `AUDIO: ${audioEnabled ? "ON" : "OFF"}`;
  if (master) master.gain.setTargetAtTime(audioEnabled ? .20 : 0, audioCtx.currentTime, .06);
});

function updateClock(){
  $("#clock").textContent = new Date().toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:false});
}
updateClock(); setInterval(updateClock,1000);

accessButton.addEventListener("click", () => {
  registry.classList.remove("is-hidden");
  registry.scrollIntoView({behavior:"smooth",block:"start"});
  glitchBurst();
});

function goStep(n){
  $$(".form-step").forEach(s=>s.classList.toggle("active",Number(s.dataset.step)===n));
  $$(".step-dot").forEach(d=>d.classList.toggle("active",Number(d.dataset.step)===n));
}
$$("[data-next]").forEach(b=>b.addEventListener("click",()=>goStep(Number(b.dataset.next))));
$$("[data-back]").forEach(b=>b.addEventListener("click",()=>goStep(Number(b.dataset.back))));

variantForm.addEventListener("submit",(e)=>{
  e.preventDefault();
  const name = $("#guestName").value.trim() || "UNKNOWN";
  const id = "VAR–626–" + Math.random().toString(36).slice(2,6).toUpperCase();

  const data = {
    id,
    name,
    attendance: variantForm.elements.attendance?.value || "",
    manifestation: variantForm.elements.manifestation?.value || "",
    story: $("#variantStory").value.trim(),
    diet: $$('input[name="diet"]:checked').map(x=>x.value),
    foodNotes: $("#foodNotes").value.trim(),
    savedAt: new Date().toISOString()
  };
  localStorage.setItem("nexus626_variant_registration", JSON.stringify(data));

  variantForm.classList.add("is-hidden");
  $(".progress-dots").classList.add("is-hidden");
  $("#variantId").textContent = id;
  $("#clearanceName").textContent = `${name.toUpperCase()} // SIGNAL INDEXED`;
  clearanceCard.classList.remove("is-hidden");
  clearanceCard.scrollIntoView({behavior:"smooth",block:"center"});
  glitchBurst();
});

// Falling code
const canvas = $("#codeRain");
const ctx = canvas.getContext("2d");
let dpr=1,w=0,h=0,fontSize=14,columns=0,drops=[];
const glyphs="01<>[]{};:=+-*ΔΛΩΣΞΦΨ∴⋮626ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function setupCanvas(){
  dpr=Math.max(1,Math.min(2,window.devicePixelRatio||1));
  w=window.innerWidth;h=window.innerHeight;
  canvas.width=w*dpr;canvas.height=h*dpr;
  canvas.style.width=w+"px";canvas.style.height=h+"px";
  ctx.setTransform(dpr,0,0,dpr,0,0);
  fontSize=w<650?12:14;
  columns=Math.ceil(w/fontSize);
  drops=Array.from({length:columns},()=>Math.random()*-80);
}
setupCanvas();window.addEventListener("resize",setupCanvas);

function rain(){
  ctx.fillStyle="rgba(3,5,10,.075)";
  ctx.fillRect(0,0,w,h);
  ctx.font=`${fontSize}px "IBM Plex Mono", monospace`;
  for(let i=0;i<drops.length;i++){
    const ch=glyphs[Math.floor(Math.random()*glyphs.length)];
    const x=i*fontSize,y=drops[i]*fontSize;
    ctx.fillStyle=(i%6===0)?"rgba(176,140,255,.72)":"rgba(105,245,255,.70)";
    ctx.fillText(ch,x,y);
    if(y>h && Math.random()>.972)drops[i]=Math.random()*-20;
    drops[i]+=.86+Math.random()*.25;
  }
  requestAnimationFrame(rain);
}
rain();

// Side compile rails
const logTemplates = [
  "TRACE timeline/{n}/variant_signature",
  "GET nexus://626/branch/{n}",
  "CRC reality_chunk_{n} .... OK",
  "Δt drift +0.{n}ns",
  "MAP identity_hash/{n}",
  "SYNC quantum_state[{n}]",
  "WARN unresolved branch 0x{n}",
  "READ spacetime_buffer[{n}]",
  "LINK variant/{n} -> 626",
  "COMPILE possibility_tree::{n}",
  "ASSERT reality != null",
  "PING NEXUS_GATE_{n}",
];

function addRailLine(el){
  const tpl=logTemplates[Math.floor(Math.random()*logTemplates.length)];
  const n=Math.floor(Math.random()*9999).toString().padStart(4,"0");
  const line=document.createElement("div");
  line.className="log-line"+(tpl.startsWith("WARN")?" log-error":(tpl.includes("OK")?" log-ok":""));
  line.textContent=tpl.replaceAll("{n}",n);
  el.appendChild(line);
  while(el.children.length>48)el.firstChild.remove();
}
setInterval(()=>{addRailLine($("#leftRail")); if(Math.random()>.25)addRailLine($("#rightRail"));},150);
