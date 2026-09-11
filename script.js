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

/*
  GOOGLE SHEETS CONNECTION
  Paste the deployed Apps Script /exec URL between the quotes below.
  Leave blank while testing locally.
*/
const GOOGLE_SHEETS_ENDPOINT = "";
// This endpoint now points only to the Phase 1 attendance registry.
// December's Variant Recognition Center will use a separate registry.

let audioEnabled = true;
let audioCtx, master, humOsc, humGain;

const compilationBursts = [
  [
    {t:"[00:00:00.000] // NEXUS KERNEL INITIALISING", c:"system"},
    {t:"[00:00:00.081] loading reality_map.bin ................ OK"},
  ],
  [
    {t:"[00:00:00.194] resolving origin universe .............. MuSyChEN–626", c:"violet"},
    {t:"[00:00:00.271] scanning adjacent reality branches ....."},
    {t:"[00:00:00.338] branch_017 / branch_108 / branch_????", c:"critical"},
  ],
  [
    {t:"[00:00:00.471] WARNING: variant count exceeds model capacity", c:"critical"},
    {t:"[00:00:00.533] establishing NEXUS handshake ........... ESTABLISHED", c:"system"},
  ],
  [
    {t:"[00:00:00.682] dimensional integrity ................... 29.3%", c:"critical"},
    {t:"[00:00:00.741] temporal boundary degradation detected", c:"critical"},
    {t:"[00:00:00.799] recipient signature ..................... MATCH FOUND", c:"system"},
  ],
  [
    {t:"[00:00:00.928] WARNING: CROSS-REALITY IDENTITY COLLISION", c:"critical"},
    {t:"[00:00:00.986] compiling incoming transmission ........."},
  ],
  [
    {t:"[00:00:01.121] TRANSMISSION COMPILED.", c:"system"},
  ]
];

function initAudio() {
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  master = audioCtx.createGain();
  master.gain.value = .38; // louder than v0.3
  master.connect(audioCtx.destination);

  humOsc = audioCtx.createOscillator();
  humGain = audioCtx.createGain();
  humOsc.type = "sine";
  humOsc.frequency.value = 56;
  humGain.gain.value = .14;
  humOsc.connect(humGain).connect(master);
  humOsc.start();

  // Subtle higher harmonic for a more dimensional hum
  const overtone = audioCtx.createOscillator();
  const overtoneGain = audioCtx.createGain();
  overtone.type = "triangle";
  overtone.frequency.value = 112;
  overtoneGain.gain.value = .025;
  overtone.connect(overtoneGain).connect(master);
  overtone.start();
}

function blip(freq=420, duration=.045, gain=.055) {
  if (!audioEnabled || !audioCtx) return;
  const o = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  o.type = Math.random() > .68 ? "square" : "sine";
  o.frequency.value = freq + Math.random()*120;
  g.gain.setValueAtTime(gain, audioCtx.currentTime);
  g.gain.exponentialRampToValueAtTime(.001, audioCtx.currentTime + duration);
  o.connect(g).connect(master);
  o.start();
  o.stop(audioCtx.currentTime + duration);
}

function glitchBurst(intensity=5) {
  if (!audioEnabled || !audioCtx) return;
  for (let i=0;i<intensity;i++) {
    setTimeout(()=>blip(150+i*95,.025,.035),i*24);
  }
}

function appendInstantLine(item) {
  const line = document.createElement("div");
  if (item.c) line.className = item.c;
  line.textContent = item.t;
  compileOutput.appendChild(line);
}

async function runCompilation() {
  // v0.4: rapid compilation in glitch bursts instead of slow typewriter.
  for (let i=0;i<compilationBursts.length;i++) {
    const burst = compilationBursts[i];

    if (i === 0) {
      // Only the very first line visibly types itself.
      const item = burst[0];
      const line = document.createElement("div");
      line.className = item.c || "";
      compileOutput.appendChild(line);
      let shown = "";
      for (const ch of item.t) {
        shown += ch;
        line.textContent = shown + "█";
        if (shown.length % 4 === 0) blip(390,.02,.02);
        await new Promise(r=>setTimeout(r,7));
      }
      line.textContent = item.t;
      appendInstantLine(burst[1]);
    } else {
      glitchBurst(i === 4 ? 8 : 4);
      document.body.classList.add("micro-glitch");
      burst.forEach(appendInstantLine);
      await new Promise(r=>setTimeout(r,65));
      document.body.classList.remove("micro-glitch");
    }

    await new Promise(r=>setTimeout(r, i < 2 ? 180 : 115));
  }

  await new Promise(r=>setTimeout(r,180));
  compileOutput.style.display = "none";
  finalTransmission.classList.remove("is-hidden");
  glitchBurst(10);
}

initializeButton.addEventListener("click", () => {
  initAudio();
  bootGate.style.display = "none";
  site.classList.remove("hidden-site");
  runCompilation();
});

$("#audioToggle").addEventListener("click", (e) => {
  audioEnabled = !audioEnabled;
  e.target.textContent = `AUDIO: ${audioEnabled ? "ON" : "OFF"}`;
  if (master) master.gain.setTargetAtTime(audioEnabled ? .38 : 0, audioCtx.currentTime, .06);
});

function updateClock(){
  $("#clock").textContent = new Date().toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:false});
}
updateClock();
setInterval(updateClock,1000);

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

function createVariantId() {
  const bytes = new Uint32Array(1);
  crypto.getRandomValues(bytes);
  return "VAR–626–" + (bytes[0] % (36**4)).toString(36).toUpperCase().padStart(4,"0");
}

async function submitToSheet(data) {
  if (!GOOGLE_SHEETS_ENDPOINT) return {connected:false};

  try {
    /*
      text/plain avoids a CORS preflight with Apps Script.
      The Apps Script stores the JSON and the client doesn't need to expose credentials.
    */
    await fetch(GOOGLE_SHEETS_ENDPOINT, {
      method: "POST",
      mode: "no-cors",
      headers: {"Content-Type":"text/plain;charset=utf-8"},
      body: JSON.stringify(data)
    });
    return {connected:true};
  } catch (err) {
    console.error("Nexus database transmission failed:", err);
    return {connected:false, error:true};
  }
}

variantForm.addEventListener("submit", async (e)=>{
  e.preventDefault();

  const selectedDates = $$('input[name="dates"]:checked').map(x => x.value);
  const validation = $("#dateValidation");

  if (selectedDates.length === 0) {
    validation.classList.remove("is-hidden");
    glitchBurst(5);
    return;
  }
  validation.classList.add("is-hidden");

  const name = $("#guestName").value.trim() || "UNKNOWN";
  const id = createVariantId();

  const dateFlags = {};
  for (let d = 10; d <= 19; d++) {
    const key = `2026-12-${String(d).padStart(2,"0")}`;
    dateFlags[key] = selectedDates.includes(key);
  }

  const data = {
    timestamp: new Date().toISOString(),
    nexusId: id,
    name,
    availableDates: selectedDates,
    ...dateFlags,
    dietaryRequirements: $$('input[name="diet"]:checked').map(x => x.value).join(", "),
    foodNotes: $("#foodNotes").value.trim()
  };

  localStorage.setItem("nexus626_access_registry", JSON.stringify(data));

  const result = await submitToSheet(data);

  variantForm.classList.add("is-hidden");
  $("#variantId").textContent = id;
  $("#clearanceName").textContent = `${name.toUpperCase()} // TEMPORAL SIGNATURE INDEXED`;

  const status = $("#storageStatus");
  if (result.connected) {
    status.textContent = "Nexus database status: TEMPORAL SIGNATURE SENT TO PRIVATE ACCESS REGISTRY.";
  } else if (GOOGLE_SHEETS_ENDPOINT) {
    status.textContent = "Nexus database status: REMOTE LINK FAILED — LOCAL BACKUP CREATED.";
  } else {
    status.textContent = "Nexus database status: LOCAL FALLBACK — Google Sheet endpoint not configured yet.";
  }

  clearanceCard.classList.remove("is-hidden");
  clearanceCard.scrollIntoView({behavior:"smooth",block:"center"});
  glitchBurst(8);
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
