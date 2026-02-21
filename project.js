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

function getWinnings(rows, bet, lines) {
  let winnings = 0;
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
  if (winnings > 0) {
    resultEl.innerText = "🎉 You won $" + winnings + "!";
    resultEl.style.color = "#FFD700";
  } else {
    resultEl.innerText = "😢 No win this time";
    resultEl.style.color = "#888";
  }

  if (balance <= 0) {
    alert("Game Over!");
  }
}
