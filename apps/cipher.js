import { createWindow } from "../core/windowManager.js";

/* =========================
   KONFIGURACJA – HASŁA
========================= */

const VALID_PASSWORDS = [
  "Jesli sprobujesz isc droga formalna trafisz na mur ktory sam pilnuje wlasnych piekniec sprawy umieraja szybciej niz ludzie ktorych dotycza na liscie pracownikow sa osoby ktore nie mogly dzis wstac z lozka a jednak codziennie odbijaja karte",
  "LAMACZ SZYFROW",
  "KRYPTOGRAFIA",
  "OPERACJA NOC",
  "DOSTEP PRZYZNANY"
];

/* =========================
   STATE
========================= */

let attempts = 0;

/* =========================
   PUBLIC API
========================= */

export function openCipher() {
  attempts = 0;

  const html = renderGame();

  const win = createWindow(
    "Łamacz Szyfrów",
    html,
    520,
    400
  );

  bindEvents(win);
}

/* =========================
   RENDER
========================= */

function renderGame() {
  return `
    <div style="padding:12px;background:#c0c0c0;font-family:Courier New;height:100%;">

      <div style="background:#000080;color:#ffff00;padding:8px;text-align:center;font-weight:bold;margin-bottom:12px;">
        🔐 ŁAMACZ SZYFRÓW
      </div>

      <div style="background:#fff;border:2px inset;padding:8px;font-size:11px;margin-bottom:12px;">
        Wklej <b>zaszyfrowany tekst</b> (alfabet A–Z), wybierz szyfr i spróbuj go złamać.
      </div>

      <div style="margin-bottom:8px;">
        <div style="font-size:11px;margin-bottom:4px;"><b>ZASZYFROWANY TEKST:</b></div>
        <textarea id="encryptedInput" rows="3"
          style="width:100%;font-family:monospace;font-size:13px;"></textarea>
      </div>

      <div style="display:flex;gap:8px;margin-bottom:8px;align-items:center;">
        <select id="cipherType" style="flex:1;font-size:12px;">
          <option value="caesar">Szyfr Cezara</option>
          <option value="rot13">ROT13</option>
          <option value="atbash">Atbash</option>
          <option value="reverse">Odwrócony</option>
        </select>

        <input id="caesarKey" type="number" value="0" min="0" max="25"
          style="width:60px;font-size:12px;"
          title="Klucz (tylko Cezar)">
      </div>

      <div style="display:flex;gap:8px;margin-bottom:12px;">
        <button id="checkBtn"
          style="flex:1;padding:8px;background:#00aa00;color:#fff;
                 font-weight:bold;border:2px outset;cursor:pointer;">
          🔍 ROZSZYFRUJ
        </button>
      </div>

      <div id="resultBox"
        style="background:#ffffff;border:2px inset;
               padding:8px;font-size:13px;min-height:40px;
               margin-bottom:8px;">
        <i>Wynik rozszyfrowania pojawi się tutaj…</i>
      </div>

      <div id="statusBox"
        style="background:#ffffcc;border:2px solid #808080;
               padding:8px;font-size:11px;">
        Próby: <b><span id="attempts">0</span></b>
      </div>

    </div>
  `;
}

/* =========================
   EVENTS
========================= */

function bindEvents(win) {
  const encryptedInput = win.querySelector("#encryptedInput");
  const cipherType = win.querySelector("#cipherType");
  const caesarKey = win.querySelector("#caesarKey");
  const checkBtn = win.querySelector("#checkBtn");
  const resultBox = win.querySelector("#resultBox");
  const statusBox = win.querySelector("#statusBox");
  const attemptsSpan = win.querySelector("#attempts");

  checkBtn.addEventListener("click", () => {
    const encrypted = encryptedInput.value.trim();
    const type = cipherType.value;
    const key = parseInt(caesarKey.value) || 0;

    if (!encrypted) {
      statusBox.textContent = "❗ Wklej zaszyfrowany tekst.";
      return;
    }

    if (!isAsciiAlphabetOnly(encrypted)) {
      statusBox.innerHTML = `
        <div style="color:#cc0000;font-weight:bold;">
          ❌ Niedozwolone znaki
        </div>
        <div style="margin-top:4px;">
          Obsługiwany jest wyłącznie alfabet A–Z (bez polskich znaków).
        </div>
      `;
      return;
    }

    attempts++;
    attemptsSpan.textContent = attempts;

    const decrypted = decrypt(type, encrypted, key);
    const normalized = normalize(decrypted);
    const validSet = VALID_PASSWORDS.map(normalize);

    resultBox.textContent = decrypted;

    if (validSet.includes(normalized)) {
      statusBox.innerHTML = `
        <div style="color:#00aa00;font-weight:bold;">
          ✅ POPRAWNE HASŁO ODSZYFROWANE
        </div>
        <div style="margin-top:4px;">
          Próby: ${attempts}
        </div>
      `;
      checkBtn.disabled = true;
      checkBtn.style.background = "#808080";
    } else {
      statusBox.innerHTML = `
        <div style="color:#cc0000;font-weight:bold;">
          ❌ To nie jest poprawne hasło
        </div>
        <div style="margin-top:4px;">
          Próby: ${attempts}
        </div>
      `;
    }
  });
}

/* =========================
   SZYFRY
========================= */

function decrypt(type, text, key) {
  switch (type) {
    case "caesar":
      return caesarDecrypt(text, key);
    case "rot13":
      return caesarDecrypt(text, 13);
    case "atbash":
      return atbashDecrypt(text);
    case "reverse":
      return reverseDecrypt(text);
    default:
      return text;
  }
}

function caesarDecrypt(text, shift) {
  return text.replace(/[A-Z]/gi, c => {
    const base = c <= 'Z' ? 65 : 97;
    return String.fromCharCode(
      ((c.charCodeAt(0) - base - shift + 26) % 26) + base
    );
  });
}

function atbashDecrypt(text) {
  return text.replace(/[A-Z]/gi, c => {
    const base = c <= 'Z' ? 65 : 97;
    return String.fromCharCode(
      base + (25 - (c.charCodeAt(0) - base))
    );
  });
}

function reverseDecrypt(text) {
  return text.split('').reverse().join('');
}

/* =========================
   HELPERS
========================= */

function normalize(text) {
  return text
    .toUpperCase()
    .replace(/\s+/g, '');
}

function isAsciiAlphabetOnly(text) {
  return /^[A-Z\s]+$/i.test(text);
}
