const ROWS = 3;
const COLS = 3;

const SYMBOLS_COUNT = {
  A: 2,
  B: 4,
  C: 6,
  D: 8,
};

const SYMBOL_VALUES = {
  A: 5,
  B: 4,
  C: 3,
  D: 2,
};

// Map symbols to emojis for visual display
const SYMBOL_DISPLAY = {
  A: "7️⃣",
  B: "🔔",
  C: "🍋",
  D: "🍒",
};

let balance = 0;
// 🔊 Sound Effects
const spinSound = new Audio("assets/sounds/spin.mp3");
const winSound = new Audio("assets/sounds/win.mp3");
const loseSound = new Audio("assets/sounds/lose.mp3");
let soundEnabled = true;

function deposit() {
  const deposit = parseFloat(document.getElementById("deposit").value);
  if (isNaN(deposit) || deposit <= 0) {
    alert("Invalid deposit amount");
    return;
  }
  balance += deposit;
  document.getElementById("balance").innerText = balance;
}

function spin() {
  const symbols = [];
  for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
    for (let i = 0; i < count; i++) {
      symbols.push(symbol);
    }
  }

  const reels = [];
  for (let i = 0; i < COLS; i++) {
    reels.push([]);
    const reelSymbols = [...symbols];
    for (let j = 0; j < ROWS; j++) {
      const randomIndex = Math.floor(Math.random() * reelSymbols.length);
      const selectedSymbol = reelSymbols[randomIndex];
      reels[i].push(selectedSymbol);
      reelSymbols.splice(randomIndex, 1);
    }
  }
  return reels;
}

function transpose(reels) {
  const rows = [];
  for (let i = 0; i < ROWS; i++) {
    rows.push([]);
    for (let j = 0; j < COLS; j++) {
      rows[i].push(reels[j][i]);
    }
  }
  return rows;
}

function getWinnings(rows, bet, lines) {
  let winnings = 0;

  // 🔹 Horizontal win check
  for (let row = 0; row < lines; row++) {
    const symbols = rows[row];
    let allSame = true;

    for (const symbol of symbols) {
      if (symbol !== symbols[0]) {
        allSame = false;
        break;
      }
    }

    if (allSame) {
      winnings += bet * SYMBOL_VALUES[symbols[0]];
    }
  }

  // 🔹 Vertical win check
  for (let col = 0; col < COLS; col++) {
    const firstSymbol = rows[0][col];
    let allSame = true;

    for (let row = 1; row < ROWS; row++) {
      if (rows[row][col] !== firstSymbol) {
        allSame = false;
        break;
      }
    }

    if (allSame) {
      winnings += bet * SYMBOL_VALUES[firstSymbol];
    }
  }

  return winnings;
}

function displayReels(rows, winningRows) {
  const display = document.getElementById("slot-display");
  display.innerHTML = "";

  // Build a 3x3 grid
  const grid = document.createElement("div");
  grid.className = "reel-grid";

  for (let r = 0; r < rows.length; r++) {
    for (let c = 0; c < rows[r].length; c++) {
      const cell = document.createElement("div");
      cell.className = "reel-cell";

      if (winningRows.includes(r)) {
        cell.classList.add("reel-win");
      }

      cell.textContent = SYMBOL_DISPLAY[rows[r][c]];
      grid.appendChild(cell);
    }
  }

  display.appendChild(grid);
}
function animateSpin(duration = 1500) {
  const display = document.getElementById("slot-display");

  const interval = setInterval(() => {
    const grid = document.createElement("div");
    grid.className = "reel-grid";

    for (let i = 0; i < 9; i++) {
      const cell = document.createElement("div");
      cell.className = "reel-cell";

      // Random emoji
      const emojis = Object.values(SYMBOL_DISPLAY);
      const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
      cell.textContent = randomEmoji;

      grid.appendChild(cell);
    }

    display.innerHTML = "";
    display.appendChild(grid);

  }, 100); // change every 100ms

  setTimeout(() => {
    clearInterval(interval);
  }, duration);
}
function play() {
  const lines = parseInt(document.getElementById("lines").value);
  const bet = parseFloat(document.getElementById("bet").value);

  if (
    isNaN(lines) || lines <= 0 || lines > 3 ||
    isNaN(bet) || bet <= 0 ||
    bet * lines > balance
  ) {
    alert("Invalid bet or lines");
    return;
  }

  balance -= bet * lines;

  // 🔊 Start spin sound
  spinSound.currentTime = 0;
  if (soundEnabled) spinSound.play();
  animateSpin(1500);

  // ⏳ Delay result to simulate spinning
  setTimeout(() => {

    const reels = spin();
    const rows = transpose(reels);

    // Find winning rows
    const winningRows = [];
    for (let row = 0; row < lines; row++) {
      const symbols = rows[row];
      const allSame = symbols.every(s => s === symbols[0]);
      if (allSame) winningRows.push(row);
    }

    displayReels(rows, winningRows);

    const winnings = getWinnings(rows, bet, lines);
    balance += winnings;

    document.getElementById("balance").innerText = balance;

    const resultEl = document.getElementById("result");

    // 🛑 Stop spin sound
    spinSound.pause();
    spinSound.currentTime = 0;

    if (winnings > 0) {
      if (soundEnabled) {
        winSound.currentTime = 0;
        winSound.play();
      }

      resultEl.innerText = "🎉 You won $" + winnings + "!";
      resultEl.style.color = "#FFD700";
    } else {
      if (soundEnabled) {
        loseSound.currentTime = 0;
        loseSound.play();
      }

      resultEl.innerText = "😢 No win this time";
      resultEl.style.color = "#888";
    }

    if (balance <= 0) {
      alert("Game Over!");
    }

  }, 1500); // 1.5 second delay
}
// How To Play Toggle
document.addEventListener("DOMContentLoaded", function () {
  const btn = document.getElementById("howToPlayBtn");
  const section = document.getElementById("howToPlaySection");

  btn.addEventListener("click", function () {
    if (section.style.display === "block") {
      section.style.display = "none";
    } else {
      section.style.display = "block";
    }
  });
});
function toggleSound() {
  soundEnabled = !soundEnabled;

  const btn = document.getElementById("soundToggleBtn");

  if (soundEnabled) {
    btn.innerText = "🔊 Sound ON";
  } else {
    btn.innerText = "🔇 Sound OFF";

    spinSound.pause();
    spinSound.currentTime = 0;
    winSound.pause();
    loseSound.pause();
  }
}