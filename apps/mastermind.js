// /apps/mastermind.js

import { createWindow } from "../core/windowManager.js";

/* =========================
   CONFIG
========================= */

const COLORS = [
  { name: "Czerwony", emoji: "🔴", color: "#ff0000" },
  { name: "Niebieski", emoji: "🔵", color: "#0000ff" },
  { name: "Zielony", emoji: "🟢", color: "#00ff00" },
  { name: "Żółty", emoji: "🟡", color: "#ffff00" },
  { name: "Pomarańczowy", emoji: "🟠", color: "#ff8800" },
  { name: "Fioletowy", emoji: "🟣", color: "#aa00ff" }
];

const MAX_ATTEMPTS = 10;
const CODE_LENGTH = 4;

/* =========================
   STATE
========================= */

let secretCode = [];
let currentGuess = [];
let attempts = [];
let gameWon = false;

/* =========================
   PUBLIC API
========================= */

export function openMastermind() {
  startNewGame();
}

function startNewGame() {
  // Generuj tajny kod
  secretCode = [];
  for (let i = 0; i < CODE_LENGTH; i++) {
    secretCode.push(Math.floor(Math.random() * COLORS.length));
  }

  console.log("Tajny kod (dev):", secretCode.map(i => COLORS[i].name));

  currentGuess = Array(CODE_LENGTH).fill(-1);
  attempts = [];
  gameWon = false;

  const html = renderGame();

  const win = createWindow(
    "Mastermind - Łamacz Kodów",
    html,
    550,
    650
  );

  bindEvents(win);
}

/* =========================
   SPRAWDZANIE
========================= */

function checkGuess(guess) {
  let blacks = 0; // Dobra pozycja
  let whites = 0; // Zły pozycja

  const secretCopy = [...secretCode];
  const guessCopy = [...guess];

  // Najpierw sprawdź dokładne dopasowania (czarne)
  for (let i = 0; i < CODE_LENGTH; i++) {
    if (guessCopy[i] === secretCopy[i]) {
      blacks++;
      secretCopy[i] = -1;
      guessCopy[i] = -2;
    }
  }

  // Potem sprawdź kolor w złym miejscu (białe)
  for (let i = 0; i < CODE_LENGTH; i++) {
    if (guessCopy[i] >= 0) {
      const idx = secretCopy.indexOf(guessCopy[i]);
      if (idx !== -1) {
        whites++;
        secretCopy[idx] = -1;
      }
    }
  }

  return { blacks, whites };
}

/* =========================
   RENDER
========================= */

function renderGame() {
  return `
    <div class="mastermind-game" style="padding:12px;background:#c0c0c0;font-family:Arial;">
      
      <!-- Header -->
      <div style="background:#000080;color:#fff;padding:8px;text-align:center;font-weight:bold;margin-bottom:12px;">
        🎨 MASTERMIND - Łamacz Kodów
      </div>
      
      <!-- Info -->
      <div style="background:#fff;border:2px inset;padding:8px;margin-bottom:12px;font-size:11px;">
        <b>Cel:</b> Odgadnij 4-kolorowy kod w max ${MAX_ATTEMPTS} próbach<br>
        <b>Wskazówki:</b> ⚫ = dobry kolor i pozycja | ⚪ = dobry kolor, zła pozycja
      </div>
      
      <!-- Historia prób -->
      <div style="background:#d4d0c8;border:2px inset;padding:8px;margin-bottom:12px;max-height:300px;overflow-y:auto;">
        <div style="font-size:11px;font-weight:bold;margin-bottom:8px;">
          PRÓBY (${attempts.length}/${MAX_ATTEMPTS}):
        </div>
        <div id="attemptsHistory">
          ${renderAttempts()}
        </div>
      </div>
      
      <!-- Aktualna próba -->
      <div style="background:#fff;border:2px solid #000;padding:12px;margin-bottom:12px;">
        <div style="font-size:11px;font-weight:bold;margin-bottom:8px;">
          TWOJA PRÓBA #${attempts.length + 1}:
        </div>
        <div style="display:flex;gap:8px;justify-content:center;margin-bottom:12px;">
          ${Array(CODE_LENGTH).fill(0).map((_, i) => `
            <div 
              class="guess-slot" 
              data-index="${i}"
              style="
                width:60px;
                height:60px;
                border:3px solid #000;
                border-radius:50%;
                background:${currentGuess[i] >= 0 ? COLORS[currentGuess[i]].color : '#e0e0e0'};
                cursor:pointer;
                display:flex;
                align-items:center;
                justify-content:center;
                font-size:40px;
              "
            >
              ${currentGuess[i] >= 0 ? COLORS[currentGuess[i]].emoji : '?'}
            </div>
          `).join('')}
        </div>
        
        <div style="text-align:center;">
          <button id="submitBtn" style="padding:8px 24px;background:#00aa00;color:#fff;font-weight:bold;border:2px outset;cursor:pointer;font-size:14px;">
            ✓ SPRAWDŹ KOD
          </button>
        </div>
      </div>
      
      <!-- Paleta kolorów -->
      <div style="margin-bottom:12px;">
        <div style="font-size:11px;font-weight:bold;margin-bottom:8px;text-align:center;">
          WYBIERZ KOLOR:
        </div>
        <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;">
          ${COLORS.map((c, i) => `
            <button 
              class="color-btn" 
              data-color="${i}"
              style="
                width:50px;
                height:50px;
                border:3px solid #000;
                border-radius:50%;
                background:${c.color};
                cursor:pointer;
                font-size:30px;
                display:flex;
                align-items:center;
                justify-content:center;
              "
              title="${c.name}"
            >
              ${c.emoji}
            </button>
          `).join('')}
        </div>
      </div>
      
      <!-- Przyciski -->
      <div style="display:flex;gap:8px;margin-bottom:12px;">
        <button id="clearBtn" style="flex:1;padding:8px;background:#ff6666;color:#fff;font-weight:bold;border:2px outset;cursor:pointer;">
          ✕ WYCZYŚĆ
        </button>
        <button id="newGameBtn" style="flex:1;padding:8px;background:#0066cc;color:#fff;font-weight:bold;border:2px outset;cursor:pointer;">
          🔄 NOWA GRA
        </button>
      </div>
      
      <!-- Status -->
      <div id="statusBox" style="background:#ffffcc;border:2px solid #808080;padding:8px;font-size:11px;text-align:center;">
        Wybierz kolory i naciśnij "SPRAWDŹ KOD"
      </div>
      
    </div>
  `;
}

function renderAttempts() {
  if (attempts.length === 0) {
    return '<div style="text-align:center;color:#808080;font-size:11px;">Brak prób</div>';
  }

  return attempts.map((att, idx) => `
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;padding:4px;background:${idx % 2 === 0 ? '#fff' : '#f0f0f0'};">
      <div style="width:30px;font-weight:bold;font-size:11px;">#${idx + 1}</div>
      <div style="display:flex;gap:4px;">
        ${att.guess.map(colorIdx => `
          <div style="width:35px;height:35px;border:2px solid #000;border-radius:50%;background:${COLORS[colorIdx].color};font-size:20px;display:flex;align-items:center;justify-content:center;">
            ${COLORS[colorIdx].emoji}
          </div>
        `).join('')}
      </div>
      <div style="margin-left:auto;display:flex;gap:4px;align-items:center;">
        <span style="font-size:11px;">
          ${'⚫'.repeat(att.result.blacks)}${'⚪'.repeat(att.result.whites)}
        </span>
      </div>
    </div>
  `).join('');
}

/* =========================
   EVENTS
========================= */

function bindEvents(win) {
  const guessSlots = win.querySelectorAll(".guess-slot");
  const colorBtns = win.querySelectorAll(".color-btn");
  const submitBtn = win.querySelector("#submitBtn");
  const clearBtn = win.querySelector("#clearBtn");
  const newGameBtn = win.querySelector("#newGameBtn");
  const statusBox = win.querySelector("#statusBox");

  let selectedSlot = null;

  // Wybór slotu
  guessSlots.forEach(slot => {
    slot.addEventListener("click", () => {
      if (gameWon) return;

      guessSlots.forEach(s => s.style.border = "3px solid #000");
      slot.style.border = "3px solid #ff0000";
      selectedSlot = parseInt(slot.dataset.index);
      statusBox.textContent = `Wybrano pozycję ${selectedSlot + 1} - kliknij kolor`;
    });
  });

  // Wybór koloru
  colorBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      if (gameWon) return;

      if (selectedSlot === null) {
        statusBox.textContent = "Najpierw wybierz pozycję (kółko z ?)";
        return;
      }

      const colorIdx = parseInt(btn.dataset.color);
      currentGuess[selectedSlot] = colorIdx;

      // Aktualizuj slot
      const slot = win.querySelector(`.guess-slot[data-index="${selectedSlot}"]`);
      slot.style.background = COLORS[colorIdx].color;
      slot.textContent = COLORS[colorIdx].emoji;

      // Przejdź do następnego slotu
      selectedSlot = (selectedSlot + 1) % CODE_LENGTH;
      guessSlots.forEach(s => s.style.border = "3px solid #000");
      guessSlots[selectedSlot].style.border = "3px solid #ff0000";

      statusBox.textContent = `Wybrano ${COLORS[colorIdx].name}. Pozycja ${selectedSlot + 1} aktywna.`;
    });
  });

  // Sprawdź kod
  submitBtn.addEventListener("click", () => {
    if (gameWon) return;

    // Sprawdź czy wszystkie kolory wybrane
    if (currentGuess.includes(-1)) {
      statusBox.textContent = "Uzupełnij wszystkie 4 pozycje!";
      return;
    }

    // Sprawdź odpowiedź
    const result = checkGuess(currentGuess);

    attempts.push({
      guess: [...currentGuess],
      result: result
    });

    // Sprawdź wygraną
    if (result.blacks === CODE_LENGTH) {
      gameWon = true;
      gameOver(win, true);
      return;
    }

    // Sprawdź czy koniec prób
    if (attempts.length >= MAX_ATTEMPTS) {
      gameWon = true;
      gameOver(win, false);
      return;
    }

    // Kontynuuj grę
    currentGuess = Array(CODE_LENGTH).fill(-1);
    selectedSlot = 0;
    updateGame(win);

    statusBox.textContent = `Próba ${attempts.length}/${MAX_ATTEMPTS}: ${result.blacks}⚫ ${result.whites}⚪`;
  });

  // Wyczyść
  clearBtn.addEventListener("click", () => {
    if (gameWon) return;
    currentGuess = Array(CODE_LENGTH).fill(-1);
    selectedSlot = 0;
    updateGame(win);
    statusBox.textContent = "Wyczyszczono - wybierz kolory ponownie";
  });

  // Nowa gra
  newGameBtn.addEventListener("click", () => {
    win.remove();
    startNewGame();
  });
}

/* =========================
   HELPERS
========================= */

function updateGame(win) {
  const content = win.querySelector(".content");
  content.innerHTML = renderGame();
  bindEvents(win);
}

function gameOver(win, won) {
  const statusBox = win.querySelector("#statusBox");

  if (won) {
    statusBox.innerHTML = `
      <div style="color:#00aa00;font-weight:bold;font-size:14px;">
        🎉 GRATULACJE! Kod złamany!
      </div>
      <div style="margin-top:4px;">
        Odgadłeś w ${attempts.length} próbach!<br>
        Kod: ${secretCode.map(i => COLORS[i].emoji).join(' ')}
      </div>
    `;

    // System osiągnięć
    import("../core/achievements.js").then(ach => {
      ach.recordWin("mastermind", {
        lastWinAttempts: attempts.length
      });
    });
  } else {
    statusBox.innerHTML = `
      <div style="color:#cc0000;font-weight:bold;font-size:14px;">
        ❌ Koniec gry! Wykorzystano ${MAX_ATTEMPTS} prób.
      </div>
      <div style="margin-top:4px;">
        Tajny kod był: ${secretCode.map(i => COLORS[i].emoji).join(' ')}
      </div>
    `;
  }

  // Pokaż tajny kod na górze
  const attemptsHistory = win.querySelector("#attemptsHistory");
  attemptsHistory.innerHTML = `
    <div style="background:#ffeeee;border:2px solid #ff0000;padding:8px;margin-bottom:8px;text-align:center;">
      <b>TAJNY KOD:</b><br>
      <div style="display:flex;gap:4px;justify-content:center;margin-top:4px;">
        ${secretCode.map(colorIdx => `
          <div style="width:40px;height:40px;border:2px solid #000;border-radius:50%;background:${COLORS[colorIdx].color};font-size:25px;display:flex;align-items:center;justify-content:center;">
            ${COLORS[colorIdx].emoji}
          </div>
        `).join('')}
      </div>
    </div>
  ` + attemptsHistory.innerHTML;
}