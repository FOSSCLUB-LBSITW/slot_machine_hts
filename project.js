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

function startGame() {
  const deposit = parseFloat(document.getElementById("deposit").value);
  if (isNaN(deposit) || deposit <= 0) {
    alert("Invalid deposit amount");
    return;
  }
  balance = deposit;
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

function getWinnings(rows, bet) {
  let winnings = 0;

  for (let row = 0; row < ROWS; row++) {
    const symbols = rows[row];

    if (symbols.every(s => s === symbols[0])) {
      winnings += bet * SYMBOL_VALUES[symbols[0]];
    }
  }

  return winnings;
}

function displayReels(rows) {
  const display = document.getElementById("slot-display");
  display.innerHTML = "";

  const grid = document.createElement("div");
  grid.className = "reel-grid";

  for (let c = 0; c < COLS; c++) {
    const column = document.createElement("div");
    column.className = "reel-column";

    const strip = document.createElement("div");
    strip.className = "reel-strip";

    // Add many random symbols for scrolling illusion
    for (let i = 0; i < 20; i++) {
      const randomSymbol =
        Object.keys(SYMBOL_DISPLAY)[
          Math.floor(Math.random() * 4)
        ];

      const cell = document.createElement("div");
      cell.className = "reel-cell";
      cell.textContent = SYMBOL_DISPLAY[randomSymbol];
      strip.appendChild(cell);
    }

    column.appendChild(strip);
    grid.appendChild(column);
  }

  display.appendChild(grid);
}
function play() {
  const spinBtn = document.querySelector(".spin-section button");

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
  document.getElementById("balance").innerText = balance;
  document.getElementById("result").innerText = "🎰 Spinning...";

  spinBtn.disabled = true;

  displayReels();

  const strips = document.querySelectorAll(".reel-strip");

  strips.forEach((strip, index) => {
    strip.classList.add("spinning");

    const spinDistance = 1500 + index * 400;

    setTimeout(() => {
      strip.style.transform = `translateY(-${spinDistance}px)`;
    }, 50);
  });

  // Generate real result
  const reels = spin();
  const rows = transpose(reels);

  setTimeout(() => {
    strips.forEach(strip => strip.classList.remove("spinning"));

    // Replace strip with final exact 3 rows
    const columns = document.querySelectorAll(".reel-column");

const winningRows = [];

for (let row = 0; row < ROWS; row++) {
  if (rows[row].every(s => s === rows[row][0])) {
    winningRows.push(row);
  }
}

columns.forEach((column, cIndex) => {
  column.innerHTML = "";

  const strip = document.createElement("div");
  strip.className = "reel-strip";

  for (let r = 0; r < ROWS; r++) {
    const cell = document.createElement("div");
    cell.className = "reel-cell";
    cell.textContent = SYMBOL_DISPLAY[rows[r][cIndex]];

    if (winningRows.includes(r)) {
      cell.classList.add("reel-win");
    }

    strip.appendChild(cell);
  }

  column.appendChild(strip);
});

    const winnings = getWinnings(rows, bet);
    balance += winnings;
    document.getElementById("balance").innerText = balance;

    const resultEl = document.getElementById("result");
    if (winnings > 0) {
      resultEl.innerText = "🎉 JACKPOT! You won $" + winnings + "!";
      resultEl.style.color = "#FFD700";
    } else {
      resultEl.innerText = "😢 No win this time";
      resultEl.style.color = "#888";
    }

    spinBtn.disabled = false;

  }, 2200);
}
