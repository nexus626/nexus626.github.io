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
// Phase 1 registry endpoint.

const PHASE2_GOOGLE_SHEETS_ENDPOINT = "";
// Phase 2 registry endpoint. Leave blank until the Recognition Center goes live.

// Change ONLY this value when the second phase is ready:
const VARIANT_RECOGNITION_CENTER = "OFFLINE";
// Allowed values: "OFFLINE" or "OPERATIONAL".

let audioEnabled = true;
let audioCtx, master;
let backgroundGlitchInterval = null;

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
  master.gain.value = .62;
  master.connect(audioCtx.destination);
  startBackgroundGlitches();
}

/* Short terminal/UI click. No ambient music. */
function interfaceClick(strength=.7) {
  if (!audioEnabled || !audioCtx) return;

  const buffer = audioCtx.createBuffer(1, Math.floor(audioCtx.sampleRate * 0.018), audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    const env = 1 - i / data.length;
    data[i] = (Math.random() * 2 - 1) * env;
  }

  const source = audioCtx.createBufferSource();
  const filter = audioCtx.createBiquadFilter();
  const gain = audioCtx.createGain();

  source.buffer = buffer;
  filter.type = "bandpass";
  filter.frequency.value = 1900 + Math.random() * 800;
  filter.Q.value = 1.8;
  gain.gain.value = 0.07 * strength;

  source.connect(filter).connect(gain).connect(master);
  source.start();
}

/* Radio / deep-space transmission interference.
   Filtered noise + a very short carrier chirp. */
function radioGlitch(intensity=1) {
  if (!audioEnabled || !audioCtx) return;

  const duration = 0.06 + Math.random() * 0.10;
  const buffer = audioCtx.createBuffer(1, Math.floor(audioCtx.sampleRate * duration), audioCtx.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < data.length; i++) {
    const t = i / data.length;
    const envelope = Math.sin(Math.PI * t) * (0.65 + 0.35 * Math.random());
    data[i] = (Math.random() * 2 - 1) * envelope;
  }

  const source = audioCtx.createBufferSource();
  const filter = audioCtx.createBiquadFilter();
  const gain = audioCtx.createGain();

  source.buffer = buffer;
  filter.type = "bandpass";
  filter.frequency.value = 600 + Math.random() * 1900;
  filter.Q.value = 2.5 + Math.random() * 4;
  gain.gain.value = 0.055 * intensity;

  source.connect(filter).connect(gain).connect(master);
  source.start();

  if (Math.random() > 0.45) {
    const carrier = audioCtx.createOscillator();
    const carrierGain = audioCtx.createGain();
    carrier.type = "sine";
    carrier.frequency.setValueAtTime(1100 + Math.random()*1200, audioCtx.currentTime);
    carrier.frequency.exponentialRampToValueAtTime(250 + Math.random()*300, audioCtx.currentTime + duration);
    carrierGain.gain.setValueAtTime(0.018 * intensity, audioCtx.currentTime);
    carrierGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
    carrier.connect(carrierGain).connect(master);
    carrier.start();
    carrier.stop(audioCtx.currentTime + duration);
  }
}

function glitchBurst(intensity=4) {
  if (!audioEnabled || !audioCtx) return;
  const count = Math.max(1, Math.round(intensity / 2));
  for (let i=0; i<count; i++) {
    setTimeout(() => radioGlitch(0.7 + Math.random()*0.5), i * (55 + Math.random()*60));
  }
}

function startBackgroundGlitches() {
  if (backgroundGlitchInterval) clearInterval(backgroundGlitchInterval);
  backgroundGlitchInterval = setInterval(() => {
    if (!audioEnabled || !audioCtx) return;
    // Sparse, irregular interference — not a constant soundtrack.
    if (Math.random() > 0.48) radioGlitch(0.55 + Math.random()*0.4);
  }, 7000 + Math.random()*2500);
}

async function runCompilation() {
  // v0.8: rapid compilation in glitch bursts instead of slow typewriter.
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
        if (shown.length % 4 === 0) interfaceClick(.55);
        await new Promise(r=>setTimeout(r,7));
      }
      line.textContent = item.t;
      appendInstantLine(burst[1]);
    } else {
      glitchBurst(i === 4 ? 8 : 5);
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
  e.target.textContent = `AUDIO: ${audioEnabled ? "SIGNAL ON" : "OFF"}`;
  if (master && audioCtx) master.gain.setTargetAtTime(audioEnabled ? .62 : 0, audioCtx.currentTime, .05);
});

function updateClock(){
  $("#clock").textContent = new Date().toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:false});
}
updateClock();
setInterval(updateClock,1000);

accessButton.addEventListener("click", () => {
  registry.classList.remove("is-hidden");
  registry.scrollIntoView({behavior:"smooth",block:"start"});
  glitchBurst(5);
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

  const firstName = $("#guestFirstName").value.trim() || "UNKNOWN";
  const lastName = $("#guestLastName").value.trim() || "UNKNOWN";
  const fullName = `${firstName} ${lastName}`.trim();
  const partySize = Math.max(1, Number($("#partySize").value) || 1);
  const id = createVariantId();

  const dateFlags = {};
  for (let d = 10; d <= 19; d++) {
    const key = `2026-12-${String(d).padStart(2,"0")}`;
    dateFlags[key] = selectedDates.includes(key);
  }

  const data = {
    timestamp: new Date().toISOString(),
    nexusId: id,
    firstName,
    lastName,
    fullName,
    partySize,
    availableDates: selectedDates,
    ...dateFlags,
    dietaryRequirements: $$('input[name="diet"]:checked').map(x => x.value).join(", "),
    foodNotes: $("#foodNotes").value.trim()
  };

  localStorage.setItem("nexus626_access_registry", JSON.stringify(data));

  const result = await submitToSheet(data);

  variantForm.classList.add("is-hidden");
  $("#variantId").textContent = id;
  $("#clearanceName").textContent = `${fullName.toUpperCase()} // TEMPORAL SIGNATURE INDEXED`;

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


// ---------- DORMANT PHASE 2 ----------
function configureRecognitionCenter() {
  const center = $("#recognitionCenter");
  const status = $("#recognitionStatus");
  const offline = $("#recognitionOffline");
  const operational = $("#recognitionOperational");

  if (!center || !status || !offline || !operational) return;

  if (VARIANT_RECOGNITION_CENTER === "OPERATIONAL") {
    center.classList.remove("offline");
    center.classList.add("operational");
    status.textContent = "● OPERATIONAL";
    status.classList.remove("offline-status");
    status.classList.add("online-status");
    offline.classList.add("is-hidden");
    operational.classList.remove("is-hidden");
  } else {
    center.classList.add("offline");
    center.classList.remove("operational");
    status.textContent = "● OFFLINE";
    status.classList.add("offline-status");
    status.classList.remove("online-status");
    offline.classList.remove("is-hidden");
    operational.classList.add("is-hidden");
  }
}
configureRecognitionCenter();

function resolveNexusIdForRecognition() {
  const params = new URLSearchParams(window.location.search);
  const fromLink = params.get("nexus");

  let fromLocal = "";
  try {
    const phase1 = JSON.parse(localStorage.getItem("nexus626_access_registry") || "{}");
    fromLocal = phase1.nexusId || "";
  } catch (e) {}

  const resolved = (fromLink || fromLocal || "").trim().toUpperCase();
  const hidden = $("#phase2NexusId");
  const display = $("#phase2NexusDisplay");

  if (hidden) hidden.value = resolved;

  if (display) {
    display.textContent = resolved || "IDENTITY LINK REQUIRED";
    display.classList.toggle("id-error", !resolved);
  }

  return resolved;
}
resolveNexusIdForRecognition();



const phase2Form = $("#phase2Form");
if (phase2Form) {
  const crossingRadios = $$('input[name="crossingStatus"]');
  const declarationFields = $("#variantDeclarationFields");

  crossingRadios.forEach(radio => {
    radio.addEventListener("change", () => {
      const status = phase2Form.elements.crossingStatus?.value || "";
      const willConverge = status === "I WILL CONVERGE";
      declarationFields.style.opacity = willConverge ? "1" : ".35";
      $("#phase2PartySizeWrap").style.opacity = willConverge ? "1" : ".35";
      $("#variantDeclaration").required = willConverge;
      $("#speciesClassification").required = willConverge;
      $("#phase2PartySize").required = willConverge;
    });
  });

  phase2Form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (VARIANT_RECOGNITION_CENTER !== "OPERATIONAL") return;

    const nexusId = resolveNexusIdForRecognition();
    if (!nexusId) {
      $("#phase2NexusDisplay").textContent = "IDENTITY LINK REQUIRED";
      $("#phase2NexusDisplay").classList.add("id-error");
      radioGlitch(1.1);
      return;
    }

    const crossingStatus = phase2Form.elements.crossingStatus?.value || "";
    const firstName = $("#phase2FirstName").value.trim();
    const lastName = $("#phase2LastName").value.trim();
    const fullName = `${firstName} ${lastName}`.trim();
    const finalPartySize = crossingStatus === "I WILL CONVERGE"
      ? Math.max(1, Number($("#phase2PartySize").value) || 1)
      : 0;

    const data = {
      timestamp: new Date().toISOString(),
      nexusId,
      firstName,
      lastName,
      fullName,
      crossingStatus,
      finalPartySize,
      variantDeclaration: crossingStatus === "I WILL CONVERGE"
        ? $("#variantDeclaration").value.trim()
        : "",
      species: crossingStatus === "I WILL CONVERGE"
        ? $("#speciesClassification").value.trim()
        : ""
    };

    localStorage.setItem("nexus626_variant_recognition", JSON.stringify(data));

    let remoteSent = false;
    if (PHASE2_GOOGLE_SHEETS_ENDPOINT) {
      try {
        await fetch(PHASE2_GOOGLE_SHEETS_ENDPOINT, {
          method: "POST",
          mode: "no-cors",
          headers: {"Content-Type":"text/plain;charset=utf-8"},
          body: JSON.stringify(data)
        });
        remoteSent = true;
      } catch (err) {
        console.error("Phase 2 transmission failed:", err);
      }
    }

    phase2Form.classList.add("is-hidden");
    $("#phase2Success").classList.remove("is-hidden");

    const status = $("#phase2StorageStatus");
    status.textContent = remoteSent
      ? "Recognition database status: RECORD TRANSMITTED TO PRIVATE REGISTRY."
      : "Recognition database status: LOCAL FALLBACK — remote registry not configured or unreachable.";

    glitchBurst(8);
  });
}

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
