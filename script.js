const calcText = document.getElementById("calcText");
const accessButton = document.getElementById("accessButton");
const nexusPanel = document.getElementById("nexusPanel");
const clock = document.getElementById("clock");

let dotCount = 0;
setInterval(() => {
  dotCount = (dotCount + 1) % 4;
  calcText.innerHTML = `PENDING CALCULATION<span class="dots">${".".repeat(dotCount)}</span>`;
}, 520);

accessButton.addEventListener("click", () => {
  nexusPanel.hidden = false;
  accessButton.textContent = "NEXUS ACCESS REQUESTED";
  accessButton.disabled = true;
  nexusPanel.scrollIntoView({ behavior: "smooth", block: "center" });
});

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
