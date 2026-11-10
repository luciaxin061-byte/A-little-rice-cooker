// Three simplified menu choices. Durations are demo seconds, NOT real cooking times.
const modes = [
  { name: "Rice Cooking", duration: 10 },
  { name: "Congee", duration: 12 },
  { name: "Claypot-Style Rice", duration: 15 }
];

// State variables: null means nothing is selected; 0, 1, 2 are mode positions.
let selectedMode = null;
let status = "idle";
let remainingTime = 0;
let timer = null;

const functionButton = document.querySelector("#function-button");
const startButton = document.querySelector("#start-button");
const message = document.querySelector("#message");

// Show the current variables on screen whenever state changes.
function updateDisplay() {
  const stateLabels = {
    idle: "Standby",
    cooking: "Cooking",
    keepingWarm: "Keep Warm"
  };
  document.querySelector(".cooker").dataset.state = status;
  document.querySelector("#state-label").textContent = stateLabels[status];

  if (selectedMode === null) {
    document.querySelector("#selected-label").textContent = "Choose a mode";
  } else {
    const mode = modes[selectedMode];
    document.querySelector("#selected-label").textContent = mode.name;
  }

  // The time sits below the mode name on the cooker screen.
  const timeDisplay = document.querySelector("#time");
  timeDisplay.hidden = selectedMode === null || status === "keepingWarm";
  if (selectedMode !== null) {
    const seconds = status === "cooking" ? remainingTime : modes[selectedMode].duration;
    timeDisplay.textContent = `${seconds}s`;
  }
  document.querySelectorAll(".mode-light").forEach((light, index) => {
    light.classList.toggle("active", index === selectedMode);
  });

  // A simplified rule: finish the current cooking cycle before choosing again.
  functionButton.disabled = status === "cooking";
  startButton.disabled = status !== "idle";
}

// A click is an event. This function runs each time Function is clicked.
functionButton.addEventListener("click", function () {
  if (status === "cooking") return;

  if (selectedMode === null) {
    selectedMode = 0;
  } else {
    // The remainder operator makes the three choices loop back to the start.
    selectedMode = (selectedMode + 1) % modes.length;
  }

  status = "idle";
  remainingTime = 0;
  message.textContent = "Mode selected. Press Start to cook.";
  updateDisplay();
});

startButton.addEventListener("click", function () {
  if (status !== "idle") return;

  if (selectedMode === null) {
    message.textContent = "Please choose a mode with Function first.";
    return;
  }

  status = "cooking";
  remainingTime = modes[selectedMode].duration;
  message.textContent = "Cooking simulation in progress. Please wait.";
  updateDisplay();

  // A timer event updates the countdown once per second.
  timer = setInterval(function () {
    remainingTime = remainingTime - 1;

    if (remainingTime <= 0) {
      clearInterval(timer);
      timer = null;
      remainingTime = 0;
      status = "keepingWarm";
      message.textContent = "Done! Keeping warm. Press Function to choose the next mode.";
    }

    updateDisplay();
  }, 1000);
});

updateDisplay();
