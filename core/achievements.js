// /core/achievements.js

import { getDesktopNode } from "./filesystem.js";
import { refreshDesktop } from "./desktop.js";

/* =========================
   STORAGE KEY
========================= */

const STORAGE_KEY = "detective_achievements";

/* =========================
   ACHIEVEMENTS CONFIG
========================= */

const ACHIEVEMENTS = {
  snake_score_20: {
    game: "snake",
    requirement: { type: "score", value: 20 },
    reward: {
      type: "txt",
      name: "Nagroda_Snake.txt",
      content: `GRATULACJE!

Osiągnięto wynik 20 w Snake!

Ukryta wiadomość:
"Kod do sejfu: 1998"

To nie przypadek że akurat ta liczba...`
    },
    message: "🎉 OSIĄGNIĘCIE! Odblokowałeś plik: Nagroda_Snake.txt"
  },

  cipher_total_500: {
    game: "cipher",
    requirement: { type: "total_score", value: 500 },
    reward: {
      type: "txt",
      name: "Tajny_Dokument.txt",
      content: `ŚCIŚLE TAJNE

Mistrz kryptografii!

Odkryto:
Ukryta lokalizacja: 52.2297, 21.0122
(Współrzędne miejsca spotkania)

Data: 15.03.1998, 23:00`
    },
    message: "🔓 OSIĄGNIĘCIE! Odszyfrowano: Tajny_Dokument.txt"
  },

  sudoku_win_easy: {
    game: "sudoku",
    requirement: { type: "win", difficulty: "easy" },
    reward: {
      type: "txt",
      name: "Notatka_Logika.txt",
      content: `Gratulacje za ukończenie Sudoku!

Twoja logika jest niesamowita.

Wskazówka do sprawy:
"Sprawdź parking o północy"

- Nieznany`
    },
    message: "🧩 OSIĄGNIĘCIE! Znaleziono: Notatka_Logika.txt"
  },

  sudoku_win_hard: {
    game: "sudoku",
    requirement: { type: "win", difficulty: "hard" },
    reward: {
      type: "txt",
      name: "Raport_Ekspert.txt",
      content: `RAPORT EKSPERTA

Ukończono trudne Sudoku!

Odkryto nową informację:
"Świadek mieszka na ulicy Marszałkowskiej 142"

Status: DO SPRAWDZENIA`
    },
    message: "🏆 OSIĄGNIĘCIE! Ekspert logiki! Odblokowałeś: Raport_Ekspert.txt"
  },

  mastermind_win_under_5: {
    game: "mastermind",
    requirement: { type: "win_attempts", max: 5 },
    reward: {
      type: "txt",
      name: "Kod_Dostępu.txt",
      content: `KOD DOSTĘPU ODKRYTY

Złamano kod w mniej niż 5 prób!

PIN do archiwum: 7734
Hasło: DETECTIVE

Użyj mądrze.`
    },
    message: "🎯 OSIĄGNIĘCIE! Mistrz kodów! Odblokowałeś: Kod_Dostępu.txt"
  },

  all_games_played: {
    requirement: { type: "all_games" },
    reward: {
      type: "txt",
      name: "FINAŁ.txt",
      content: `=== KONIEC GRY ===

Gratulacje Detektywie!

Zagrałeś we wszystkie gry i odkryłeś wszystkie tropy.

Prawda o sprawie 17/98:
[TREŚĆ ZOSTAŁA USUNIĘTA]

Czy jesteś gotowy poznać prawdę?

>>> GAME COMPLETED <<<`
    },
    message: "🌟 UKOŃCZONO GRĘ! Finałowy dokument odblokowany!"
  }
};

/* =========================
   STORAGE
========================= */

function loadProgress() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    return {
      scores: {},
      unlocked: [],
      gamesPlayed: []
    };
  }
  return JSON.parse(data);
}

function saveProgress(progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

/* =========================
   PUBLIC API
========================= */

// Zapisz wynik gry
export function recordScore(game, score, extraData = {}) {
  const progress = loadProgress();

  console.log(`Recording score for ${game}: ${score}`, extraData);

  // Zapisz high score
  if (!progress.scores[game] || score > progress.scores[game]) {
    progress.scores[game] = score;
  }

  // Dodaj grę do zagranych
  if (!progress.gamesPlayed.includes(game)) {
    progress.gamesPlayed.push(game);
  }

  // Zapisz dodatkowe dane
  if (!progress[game]) {
    progress[game] = {};
  }
  Object.assign(progress[game], extraData);

  saveProgress(progress);

  // Sprawdź osiągnięcia
  checkAchievements(progress);
}

// Zapisz wygraną
export function recordWin(game, extraData = {}) {
  const progress = loadProgress();

  console.log(`Recording win for ${game}`, extraData);

  if (!progress[game]) {
    progress[game] = {};
  }

  progress[game].wins = (progress[game].wins || 0) + 1;
  Object.assign(progress[game], extraData);

  if (!progress.gamesPlayed.includes(game)) {
    progress.gamesPlayed.push(game);
  }

  saveProgress(progress);

  // Sprawdź osiągnięcia
  checkAchievements(progress);
}

// Pobierz high score
export function getHighScore(game) {
  const progress = loadProgress();
  return progress.scores[game] || 0;
}

// Pobierz statystyki
export function getStats(game) {
  const progress = loadProgress();
  return progress[game] || {};
}

// Pobierz wszystkie statystyki
export function getAllStats() {
  return loadProgress();
}

// Reset (dla testowania)
export function resetProgress() {
  localStorage.removeItem(STORAGE_KEY);
  console.log("Progress reset!");
}

/* =========================
   SPRAWDZANIE OSIĄGNIĘĆ
========================= */

function checkAchievements(progress) {
  const newUnlocks = [];

  for (const [key, achievement] of Object.entries(ACHIEVEMENTS)) {
    // Sprawdź czy już odblokowane
    if (progress.unlocked.includes(key)) continue;

    // Sprawdź warunki
    if (checkRequirement(achievement.requirement, progress)) {
      // ODBLOKUJ!
      progress.unlocked.push(key);
      newUnlocks.push(achievement);

      // Dodaj plik na pulpit
      addRewardToDesktop(achievement.reward);

      // Pokaż powiadomienie
      showAchievementNotification(achievement);
    }
  }

  if (newUnlocks.length > 0) {
    saveProgress(progress);
    refreshDesktop();
  }
}

function checkRequirement(req, progress) {
  switch (req.type) {
    case "score":
      return progress.scores[req.game] >= req.value;

    case "total_score":
      const total = Object.values(progress.scores).reduce((a, b) => a + b, 0);
      return total >= req.value;

    case "win":
      const gameData = progress[req.game] || {};
      if (req.difficulty) {
        return gameData[`win_${req.difficulty}`] === true;
      }
      return gameData.wins >= 1;

    case "win_attempts":
      const data = progress[req.game] || {};
      return data.lastWinAttempts && data.lastWinAttempts <= req.max;

    case "all_games":
      const requiredGames = ["snake", "cipher", "sudoku", "mastermind"];
      return requiredGames.every(g => progress.gamesPlayed.includes(g));

    default:
      return false;
  }
}

/* =========================
   DODAWANIE NAGRÓD
========================= */

function addRewardToDesktop(reward) {
  const desktop = getDesktopNode();
  if (!desktop) {
    console.error("Nie znaleziono pulpitu!");
    return;
  }

  // Sprawdź czy już istnieje
  const exists = desktop.children.some(child => child.name === reward.name);
  if (exists) {
    console.log("Nagroda już istnieje:", reward.name);
    return;
  }

  // Dodaj plik
  desktop.children.push(reward);

  console.log("Dodano nagrodę:", reward.name);
}

/* =========================
   POWIADOMIENIA
========================= */

function showAchievementNotification(achievement) {
  // Utwórz okno w stylu Win98
  const notification = document.createElement("div");
  notification.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #c0c0c0;
    border: 2px solid;
    border-color: #ffffff #000000 #000000 #ffffff;
    padding: 0;
    z-index: 10000;
    font-family: "MS Sans Serif", Tahoma, Arial, sans-serif;
    font-size: 11px;
    min-width: 320px;
    box-shadow: 2px 2px 0 rgba(0,0,0,0.5);
    animation: achievementSlide 0.3s ease-out;
  `;

  notification.innerHTML = `
    <!-- Titlebar -->
    <div style="
      background: linear-gradient(to right, #000080, #1084d0);
      color: #ffffff;
      padding: 2px 4px;
      font-weight: bold;
      display: flex;
      justify-content: space-between;
      align-items: center;
    ">
      <span>Osiągnięcie odblokowane</span>
      <button style="
        width: 16px;
        height: 14px;
        background: #c0c0c0;
        border: 1px solid;
        border-color: #ffffff #000000 #000000 #ffffff;
        font-size: 8px;
        line-height: 12px;
        padding: 0;
      " onclick="this.closest('div').parentElement.remove()">×</button>
    </div>
    
    <!-- Content -->
    <div style="padding: 12px; background: #c0c0c0;">
      <div style="display: flex; align-items: center; gap: 12px;">
        <div style="font-size: 32px;">🏆</div>
        <div style="flex: 1;">
          <div style="font-weight: bold; margin-bottom: 4px;">Nowe osiągnięcie!</div>
          <div style="font-size: 11px;">${achievement.message}</div>
        </div>
      </div>
      <div style="margin-top: 12px; text-align: center;">
        <button onclick="this.closest('div').parentElement.remove()" style="
          padding: 2px 12px;
          background: #c0c0c0;
          border: 2px solid;
          border-color: #ffffff #000000 #000000 #ffffff;
          font-size: 11px;
          cursor: pointer;
        ">OK</button>
      </div>
    </div>
  `;

  // Dodaj animację
  const style = document.createElement("style");
  style.textContent = `
    @keyframes achievementSlide {
      0% { transform: translate(-50%, -150%); opacity: 0; }
      100% { transform: translate(-50%, -50%); opacity: 1; }
    }
  `;
  document.head.appendChild(style);

  document.body.appendChild(notification);

  // Auto-usuń po 5 sekundach
  setTimeout(() => {
    if (notification.parentElement) {
      notification.remove();
    }
    style.remove();
  }, 5000);
}

/* =========================
   HELPERS
========================= */

export function showStatsWindow() {
  import("./windowManager.js").then(wm => {
    const progress = loadProgress();

    const html = `
      <div style="padding:0;background:#c0c0c0;font-family:'MS Sans Serif',Tahoma,Arial;">
        
        <!-- Tabs w stylu Win98 -->
        <div style="background:#c0c0c0;padding:4px 4px 0 4px;border-bottom:2px solid #808080;">
          <button style="
            padding:4px 16px;
            background:#ffffff;
            border:2px solid;
            border-color:#ffffff #808080 #808080 #ffffff;
            border-bottom:none;
            font-size:11px;
            font-weight:bold;
            position:relative;
            top:2px;
          ">Osiągnięcia</button>
        </div>
        
        <!-- Content -->
        <div style="padding:12px;background:#c0c0c0;">
          
          <!-- High Scores -->
          <fieldset style="border:2px groove #ffffff;padding:8px;margin-bottom:12px;">
            <legend style="font-weight:bold;font-size:11px;"> High Scores </legend>
            <table style="width:100%;font-size:11px;" cellpadding="4">
              <tr>
                <td>🐍 Snake:</td>
                <td align="right"><b>${progress.scores?.snake || 0}</b> pkt</td>
              </tr>
              <tr style="background:#f0f0f0;">
                <td>🔐 Cipher:</td>
                <td align="right"><b>${progress.scores?.cipher || 0}</b> pkt</td>
              </tr>
              <tr>
                <td>🔢 Sudoku:</td>
                <td align="right"><b>${progress.sudoku?.wins || 0}</b> wygranych</td>
              </tr>
              <tr style="background:#f0f0f0;">
                <td>🎨 Mastermind:</td>
                <td align="right"><b>${progress.mastermind?.wins || 0}</b> wygranych</td>
              </tr>
            </table>
          </fieldset>
          
          <!-- Osiągnięcia -->
          <fieldset style="border:2px groove #ffffff;padding:8px;margin-bottom:12px;">
            <legend style="font-weight:bold;font-size:11px;"> Odblokowane (${progress.unlocked?.length || 0}/${Object.keys(ACHIEVEMENTS).length}) </legend>
            <div style="background:#ffffff;border:2px inset;padding:8px;max-height:150px;overflow-y:auto;font-size:11px;">
              ${progress.unlocked && progress.unlocked.length > 0
      ? progress.unlocked.map(key => {
        const ach = ACHIEVEMENTS[key];
        return `<div style="padding:4px;border-bottom:1px solid #d0d0d0;">
                      ✓ ${ach?.reward?.name || key}
                    </div>`;
      }).join('')
      : '<div style="color:#808080;text-align:center;padding:20px;">Brak osiągnięć<br>Zagraj w gry aby odblokować!</div>'}
            </div>
          </fieldset>
          
          <!-- Postęp -->
          <div style="background:#ffffff;border:2px inset;padding:8px;margin-bottom:12px;font-size:11px;">
            <div style="margin-bottom:4px;"><b>Postęp ogólny:</b></div>
            <div style="background:#000080;height:20px;border:1px solid #808080;position:relative;">
              <div style="
                background:#00aa00;
                height:100%;
                width:${(progress.unlocked?.length || 0) / Object.keys(ACHIEVEMENTS).length * 100}%;
              "></div>
              <div style="
                position:absolute;
                top:0;
                left:0;
                right:0;
                text-align:center;
                line-height:20px;
                color:#ffffff;
                font-weight:bold;
                text-shadow:1px 1px 0 #000;
              ">
                ${Math.floor((progress.unlocked?.length || 0) / Object.keys(ACHIEVEMENTS).length * 100)}%
              </div>
            </div>
          </div>
          
          <!-- Przyciski -->
          <div style="display:flex;gap:8px;justify-content:center;">
            <button id="closeBtn" style="
              padding:4px 20px;
              background:#c0c0c0;
              border:2px solid;
              border-color:#ffffff #000000 #000000 #ffffff;
              font-size:11px;
              cursor:pointer;
            ">OK</button>
            <button id="resetBtn" style="
              padding:4px 20px;
              background:#c0c0c0;
              border:2px solid;
              border-color:#ffffff #000000 #000000 #ffffff;
              font-size:11px;
              cursor:pointer;
            ">Reset (DEV)</button>
          </div>
          
        </div>
      </div>
    `;

    const win = wm.createWindow("Osiągnięcia i statystyki", html, 420, 480);

    const closeBtn = win.querySelector("#closeBtn");
    const resetBtn = win.querySelector("#resetBtn");

    if (closeBtn) {
      closeBtn.onclick = () => win.remove();
    }

    if (resetBtn) {
      resetBtn.onclick = () => {
        if (confirm("Czy na pewno chcesz zresetować wszystkie osiągnięcia?\n\nTA OPERACJA NIE MOŻE BYĆ COFNIĘTA!")) {
          resetProgress();
          win.remove();

          // Pokaż dialog Win98
          setTimeout(() => {
            alert("Osiągnięcia zostały zresetowane.\n\nOdśwież pulpit aby zobaczyć zmiany.");
          }, 100);
        }
      };
    }
  });
}