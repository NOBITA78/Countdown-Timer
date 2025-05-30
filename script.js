const startButton = document.getElementById("start-button");
const dateTimePicker = document.getElementById("datetime-picker");
const completeMsg = document.getElementById("complete-msg");

let countdownInterval;
let alarmSound = new Audio("./sounds/happy-bells.mp3"); // Path to your alarm sound file
alarmSound.loop = true; // Make the alarm sound loop until stopped

startButton.addEventListener("click", () => {
  const targetDate = new Date(dateTimePicker.value);

  if (isNaN(targetDate.getTime())) {
    alert("Please select a valid date and time.");
    return;
  }

  // Save to LocalStorage
  localStorage.setItem("countdown", targetDate.toISOString());

  startCountdown(targetDate);
});

const presetButtons = document.querySelectorAll(".preset-btn");
presetButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const dateTime = button.getAttribute("data-time");
    dateTimePicker.value = dateTime;
  });
});

// Theme toggle functionality
const themeToggle = document.getElementById("theme-toggle");
let isDark = true;

themeToggle.addEventListener("click", () => {
  if (isDark) {
    document.documentElement.style.setProperty("--bg-color", "#f3f4f6");
    document.documentElement.style.setProperty("--card-bg", "#ffffffcc");
    document.documentElement.style.setProperty("--text-color", "#111");
    document.documentElement.style.setProperty("--timer-card-bg", "#e0e0e0");
    document.documentElement.style.setProperty("--button-bg", "#007bff");
    document.documentElement.style.setProperty("--button-hover", "#0056b3");
    document.documentElement.style.setProperty("--success-color", "#28a745");
    themeToggle.innerText = "Switch to Dark Theme";
  } else {
    document.documentElement.style.setProperty("--bg-color", "#1f1c2c");
    document.documentElement.style.setProperty(
      "--card-bg",
      "rgba(255, 255, 255, 0.1)"
    );
    document.documentElement.style.setProperty("--text-color", "#fff");
    document.documentElement.style.setProperty(
      "--timer-card-bg",
      "rgba(255, 255, 255, 0.2)"
    );
    document.documentElement.style.setProperty("--button-bg", "#ff6f61");
    document.documentElement.style.setProperty("--button-hover", "#ff3b2e");
    document.documentElement.style.setProperty("--success-color", "#90ff90");
    themeToggle.innerText = "Switch to Light Theme";
  }

  isDark = !isDark;
});

function startCountdown(targetDate) {
  clearInterval(countdownInterval);
  completeMsg.classList.add("hidden");
  alarmSound.pause(); // Stop any currently playing alarm
  alarmSound.currentTime = 0; // Reset sound to beginning

  countdownInterval = setInterval(() => {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
      clearInterval(countdownInterval);
      completeMsg.classList.remove("hidden");
      document.getElementById("days").innerText = 0;
      document.getElementById("hours").innerText = 0;
      document.getElementById("minutes").innerText = 0;
      document.getElementById("seconds").innerText = 0;

      // Play alarm sound
      alarmSound.play();

      // 🎉 Confetti effect
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
      });

      // Clear saved countdown
      localStorage.removeItem("countdown");
      return;
    }

    document.getElementById("days").innerText = Math.floor(
      distance / (1000 * 60 * 60 * 24)
    );
    document.getElementById("hours").innerText = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    document.getElementById("minutes").innerText = Math.floor(
      (distance % (1000 * 60 * 60)) / (1000 * 60)
    );
    document.getElementById("seconds").innerText = Math.floor(
      (distance % (1000 * 60)) / 1000
    );
  }, 1000);
}

window.addEventListener("DOMContentLoaded", () => {
  const savedCountdown = localStorage.getItem("countdown");
  if (savedCountdown) {
    const savedDate = new Date(savedCountdown);
    dateTimePicker.value = savedCountdown.slice(0, 16); // Format for input
    startCountdown(savedDate);
  }
});

// Add a button to stop the alarm sound
document.addEventListener("DOMContentLoaded", () => {
  const stopAlarmBtn = document.createElement("button");
  stopAlarmBtn.id = "stop-alarm";
  stopAlarmBtn.textContent = "Stop Sound";
  stopAlarmBtn.classList.add("preset-btn");
  stopAlarmBtn.style.display = "none";
  stopAlarmBtn.style.marginTop = "10px";
  document.querySelector(".container").appendChild(stopAlarmBtn);

  stopAlarmBtn.addEventListener("click", () => {
    alarmSound.pause();
    alarmSound.currentTime = 0;
    stopAlarmBtn.style.display = "none";
  });

  // Show stop button when alarm plays
  alarmSound.onplay = () => {
    stopAlarmBtn.style.display = "inline-block";
  };
});
