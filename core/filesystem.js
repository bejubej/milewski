// ===================================================
// PEŁNA WERSJA filesystem.js Z WSZYSTKIMI IMPORTAMI
// ===================================================


// /core/filesystem.js

import { FILESYSTEM } from "../data/filesystemData.js";
import { createWindow } from "./windowManager.js";
import { renderIconList, deselectAllIcons } from "./iconRenderer.js";
import { openSnake } from "../apps/snake.js";
import { openCipher } from "../apps/cipher.js";
import { openSudoku } from "../apps/sudoku.js";
import { openMastermind } from "../apps/mastermind.js";
import { openMail } from "../apps/mail.js";
import { openBrowser } from "../apps/browser.js";
import { openTxtFile } from "../apps/txtViewer.js";
import { openTrash } from "../apps/trash.js";
import { openImage } from "../apps/imageViewer.js";
import { openComputer } from "../apps/computer.js";
import { showStatsWindow } from "./achievements.js";

// HELPERS
function findNodeByType(node, type) {
  if (node.type === type) return node;

  if (node.children) {
    for (const child of node.children) {
      const found = findNodeByType(child, type);
      if (found) return found;
    }
  }

  return null;
}

// PUBLIC API
export async function openNode(node) {
  if (!node || !node.type) return;

  switch (node.type) {
    case "txt":
      await openTxt(node);  // ← DODAJ await
      break;

    case "folder":
      openFolder(node);
      break;

    case "image":
      openImage(node);
      break;

    case "mp3":
      await openMp3(node);
      break;

    case "csv":
      await openCsv(node);
      break;

    case "app":
      openApp(node);
      break;

    case "trash":
      openTrash(node);
      break;

    case "link":
      openLink(node);
      break;

    default:
      alert("Nieznany typ pliku");
  }
}

async function openTxt(node) {
  let content = "";

  // Jeśli plik ma src - pobierz z pliku
  if (node.src) {
    try {
      const response = await fetch(node.src);
      if (!response.ok) {
        content = `❌ Błąd: Nie można załadować pliku\n\nPlik: ${node.src}\nStatus: ${response.status}`;
      } else {
        content = await response.text();
      }
    } catch (error) {
      content = `❌ Błąd połączenia\n\nPlik: ${node.src}\nBłąd: ${error.message}`;
    }
  }
  // Jeśli plik ma content - użyj go bezpośrednio
  else if (node.content) {
    content = node.content;
  }
  // Brak treści
  else {
    content = "Plik jest pusty.";
  }

  const html = node.src && node.src.endsWith(".html")
    ? `<iframe src="${node.src}" style="width:100%;height:100%;border:none;"></iframe>`
    : `<pre style="white-space:pre-wrap;font-family:Courier New;font-size:11px;padding:8px;">
${content}
</pre>`;

  createWindow(
    node.name,
    html,
    node.window || { width: 420, height: 320 }
  );

}

export function getDesktopNode() {
  return findNodeByType(FILESYSTEM, "desktop");
}

export function getDesktopApps() {
  const desktop = getDesktopNode();
  if (!desktop) return [];
  return desktop.children.filter(n => n.type === "app");
}

// /core/filesystem.js - Zamień funkcję openFolder na tę:

function openFolder(node) {
  console.log("openFolder wywołane dla:", node);

  if (!node) {
    console.error("openFolder: node is undefined!");
    alert("Błąd: Nie można otworzyć folderu");
    return;
  }

  const items = node.children || [];

  console.log("Zawartość folderu:", items);

  // SPRAWDŹ CZY WSZYSTKIE ELEMENTY MAJĄ DANE
  items.forEach((item, index) => {
    if (!item) {
      console.error(`openFolder: item ${index} is undefined!`);
    } else if (!item.name) {
      console.error(`openFolder: item ${index} has no name!`, item);
    } else {
      console.log(`  ${index}: ${item.name} (${item.type})`);
    }
  });

  // Tworzymy kontener z pustym HTML
  const html = `<div class="folder-content"></div>`;

  const win = createWindow(
    node.name,
    html,
    480,
    360
  );

  // Używamy uniwersalnego rendera do wypełnienia kontenera
  const container = win.querySelector(".folder-content");

  if (!container) {
    console.error("openFolder: Nie znaleziono .folder-content!");
    return;
  }

  console.log("Renderowanie ikon w folderze, items:", items.length);

  renderIconList(items, container, {
    className: "folder-icon",
    imageClass: "folder-icon-image",
    labelClass: "folder-icon-label",
    context: "folder",
    emptyMessage: "Folder jest pusty"
  });

  // Kliknięcie w tło odznacza ikony
  container.addEventListener("click", (e) => {
    if (e.target === container) {
      deselectAllIcons(container);
    }
  });

  console.log("✅ Folder otwarty pomyślnie");
}

async function openMp3(node) {
  // Jeśli ma YouTube - otwórz w nowej karcie
  if (node.youtube) {
    window.open(node.youtube, "_blank");
    return;
  }

  // Jeśli ma lokalny plik - otwórz odtwarzacz
  if (node.src) {
    const html = `
      <div style="padding:20px;text-align:center;background:#000;color:#0f0;font-family:Courier;">
        <p style="margin-bottom:15px;">🎵 Odtwarzacz audio</p>
        <p style="font-size:14px;margin-bottom:20px;">${node.name}</p>
        <audio controls autoplay style="width:100%;max-width:400px;">
          <source src="${node.src}" type="audio/mpeg">
          Twoja przeglądarka nie obsługuje audio HTML5.
        </audio>
        <p style="margin-top:20px;font-size:10px;color:#0a0;">
          ${node.src}
        </p>
      </div>
    `;

    createWindow(
      "Odtwarzacz - " + node.name,
      html,
      480,
      200
    );
    return;
  }

  // Brak źródła
  alert("Brak pliku audio do odtworzenia.");
}

// /core/filesystem.js - Zamień całą funkcję openCsv na tę:

async function openCsv(node) {
  // ⚠️ NAJPIERW SPRAWDŹ CZY NODE ISTNIEJE - ZANIM UŻYJESZ node.name!
  if (!node) {
    console.error("openCsv: node is undefined!");
    alert("Błąd: Brak danych pliku CSV");
    return;
  }

  if (!node.name) {
    console.error("openCsv: node.name is undefined!", node);
    alert("Błąd: Plik CSV nie ma nazwy");
    return;
  }

  console.log("Otwieranie CSV:", node.name, node);

  // ✅ TERAZ MOŻEMY BEZPIECZNIE UŻYĆ node.name
  const win = createWindow(
    node.name,
    `<div style="padding:20px;text-align:center;">
      <p>⏳ Ładowanie danych CSV...</p>
      <p style="font-size:10px;color:#808080;">${node.src || 'brak ścieżki'}</p>
    </div>`,
    600,
    400
  );

  if (!node.src) {
    updateWindowContent(win, `
      <div style="padding:20px;color:red;">
        ❌ Błąd: Brak ścieżki do pliku CSV<br><br>
        Nazwa: ${node.name}<br>
        Typ: ${node.type}
      </div>
    `);
    return;
  }

  try {
    console.log("Pobieranie CSV z:", node.src);

    const response = await fetch(node.src);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const csvText = await response.text();
    console.log("CSV załadowany, długość:", csvText.length);

    const tableHtml = parseCSVToTable(csvText);

    updateWindowContent(win, `
      <div style="overflow:auto;height:100%;">
        ${tableHtml}
      </div>
    `);

    console.log("✅ CSV wyświetlony pomyślnie");

  } catch (error) {
    console.error("❌ Błąd ładowania CSV:", error);

    updateWindowContent(win, `
      <div style="padding:20px;color:red;">
        ❌ Błąd ładowania CSV<br><br>
        Plik: ${node.src}<br>
        Błąd: ${error.message}
      </div>
    `);
  }
}

// === HELPER FUNCTIONS (dodaj jeśli ich nie masz) ===

function updateWindowContent(win, htmlContent) {
  if (!win) {
    console.error("updateWindowContent: win is undefined");
    return;
  }

  const contentDiv = win.querySelector(".content");
  if (contentDiv) {
    contentDiv.innerHTML = htmlContent;
  } else {
    console.error("updateWindowContent: Nie znaleziono .content");
  }
}

function parseCSVToTable(csvText) {
  try {
    const lines = csvText.trim().split('\n');

    if (lines.length === 0) {
      return '<p style="padding:20px;">CSV jest pusty</p>';
    }

    const rows = lines.map(line => line.split(',').map(cell => cell.trim()));
    const headers = rows[0];
    const dataRows = rows.slice(1);

    let html = `
      <table style="width:100%;border-collapse:collapse;font-size:11px;font-family:Arial;">
        <thead>
          <tr style="background:#000080;color:#fff;">
    `;

    headers.forEach(h => {
      html += `<th style="padding:6px;border:1px solid #808080;text-align:left;">${escapeHTML(h)}</th>`;
    });

    html += `
          </tr>
        </thead>
        <tbody>
    `;

    dataRows.forEach((row, idx) => {
      const bgColor = idx % 2 === 0 ? '#ffffff' : '#f0f0f0';
      html += `<tr style="background:${bgColor};">`;

      row.forEach(cell => {
        html += `<td style="padding:6px;border:1px solid #808080;">${escapeHTML(cell)}</td>`;
      });

      html += '</tr>';
    });

    html += `
        </tbody>
      </table>
      <div style="padding:8px;font-size:10px;color:#808080;background:#f5f5f5;border-top:1px solid #ccc;">
        📊 Wierszy: ${dataRows.length} | Kolumn: ${headers.length}
      </div>
    `;

    return html;

  } catch (error) {
    console.error("parseCSVToTable error:", error);
    return `<p style="padding:20px;color:red;">Błąd parsowania: ${error.message}</p>`;
  }
}

function escapeHTML(str) {
  if (str == null || str === undefined) return '';
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
function openApp(node) {
  switch (node.app) {
    case "snake":
      openSnake();
      break;

    case "cipher":
      openCipher();
      break;

    case "sudoku":
      openSudoku();
      break;

    case "mastermind":
      openMastermind();
      break;

    case "stats":
      showStatsWindow();
      break;

    case "mail":
      openMail();
      break;

    case "browser":
      openBrowser();
      break;

    case "computer":  // ← DODAJ TO
      openComputer();
      break;

    default:
      alert("Nieznana aplikacja");
  }
}

function openLink(node) {
  if (!node.url) {
    console.warn("Link bez URL:", node.name);
    alert("Brak adresu URL dla tego linku.");
    return;
  }

  // Opcja 1: Otwórz w nowej karcie
  //window.open(node.url, "_blank");

// Opcja 2: Pytaj użytkownika (bardziej immersyjne dla Win98)
  const confirm = window.confirm(
    `Czy chcesz otworzyć:\n${node.name}\n\nAdres: ${node.url}`
  );
  if (confirm) {
    window.open(node.url, "_blank");
  }
}