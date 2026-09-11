const calcText = document.getElementById("calcText");
const accessButton = document.getElementById("accessButton");
const clock = document.getElementById("clock");
const accessOverlay = document.getElementById("accessOverlay");
const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");
const nexusSection = document.getElementById("nexusSection");

let dotCount = 0;
setInterval(() => {
  dotCount = (dotCount + 1) % 4;
  calcText.innerHTML = `PENDING CALCULATION<span class="dots">${".".repeat(dotCount)}</span>`;
}, 520);

function updateClock() {
  const now = new Date();
  clock.textContent = now.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  });
}
updateClock();
setInterval(updateClock, 1000);

accessButton.addEventListener("click", () => {
  accessOverlay.hidden = false;
  document.body.style.overflow = "hidden";
  const messages = [
    "Decoding transmission…",
    "Authenticating Variant signature…",
    "Stabilising Nexus bridge…",
    "Decrypting MuSyChEN–626 protocols…",
    "Access granted."
  ];

  let progress = 0;
  let messageIndex = 0;
  progressText.textContent = messages[0];
  progressBar.style.width = "0%";

  const interval = setInterval(() => {
    progress += 4;
    progressBar.style.width = progress + "%";

    if (progress >= 20 && messageIndex === 0) {
      messageIndex = 1;
      progressText.textContent = messages[1];
    } else if (progress >= 45 && messageIndex === 1) {
      messageIndex = 2;
      progressText.textContent = messages[2];
    } else if (progress >= 70 && messageIndex === 2) {
      messageIndex = 3;
      progressText.textContent = messages[3];
    } else if (progress >= 96 && messageIndex === 3) {
      messageIndex = 4;
      progressText.textContent = messages[4];
    }

    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        accessOverlay.hidden = true;
        document.body.style.overflow = "";
        nexusSection.hidden = false;
        nexusSection.scrollIntoView({ behavior: "smooth", block: "start" });
        accessButton.textContent = "NEXUS ACCESS GRANTED";
        accessButton.disabled = true;
      }, 500);
    }
  }, 85);
});

// CODE RAIN + INTERDIMENSIONAL STREAM
const canvas = document.getElementById("codeRain");
const ctx = canvas.getContext("2d");

let width = 0;
let height = 0;
let fontSize = 15;
let columns = 0;
let drops = [];
const glyphs = "01<>[]{};:=+-*ΔΛΩΣΞΦΨ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function setupCanvas() {
  width = canvas.width = window.innerWidth * window.devicePixelRatio;
  height = canvas.height = window.innerHeight * window.devicePixelRatio;
  canvas.style.width = window.innerWidth + "px";
  canvas.style.height = window.innerHeight + "px";
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

  fontSize = window.innerWidth < 600 ? 12 : 15;
  columns = Math.floor(window.innerWidth / fontSize);
  drops = Array(columns).fill(0).map(() => Math.random() * -80);
}
setupCanvas();
window.addEventListener("resize", setupCanvas);

function drawCodeRain() {
  ctx.fillStyle = "rgba(5, 6, 10, 0.08)";
  ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

  ctx.font = fontSize + "px IBM Plex Mono";
  for (let i = 0; i < drops.length; i++) {
    const text = glyphs[Math.floor(Math.random() * glyphs.length)];
    const x = i * fontSize;
    const y = drops[i] * fontSize;

    const hue = i % 7 === 0 ? "rgba(170,125,255,0.68)" : "rgba(101,243,255,0.66)";
    ctx.fillStyle = hue;
    ctx.fillText(text, x, y);

    if (y > window.innerHeight && Math.random() > 0.975) {
      drops[i] = 0;
    }
    drops[i]++;
  }

  // subtle warp streaks
  for (let i = 0; i < 10; i++) {
    const px = (Math.sin(Date.now() * 0.0006 + i) * 0.5 + 0.5) * window.innerWidth;
    const py = ((Date.now() * 0.08) + i * 90) % window.innerHeight;
    ctx.strokeStyle = "rgba(255,255,255,0.05)";
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.lineTo(px + 20, py + 50);
    ctx.stroke();
  }

  requestAnimationFrame(drawCodeRain);
}
drawCodeRain();
