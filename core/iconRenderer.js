// /core/iconRenderer.js

/* =========================
   UNIWERSALNY RENDERER IKON
   Używany przez desktop.js i filesystem.js
========================= */

import { openNode } from "./filesystem.js";

/* =========================
   GŁÓWNA FUNKCJA
========================= */

/**
 * Tworzy element ikony z obsługą kliknięć
 * @param {Object} node - Węzeł z filesystemData
 * @param {Object} options - Opcje renderowania
 * @returns {HTMLElement} Element ikony
 */
export function createIconElement(node, options = {}) {
  const {
    className = "icon",
    imageClass = "icon-image",
    labelClass = "icon-label",
    onSelect = null,
    context = "desktop" // "desktop" lub "folder"
  } = options;

  const el = document.createElement("div");

  el.className = className;
  el.dataset.nodeName = node.name;
  el.dataset.nodeType = node.type;

  // Struktura ikony
  el.innerHTML = `
    <div class="${imageClass}">${getIconGraphic(node)}</div>
    <span class="${labelClass}">${node.name}</span>
  `;

  // Obsługa kliknięć
  setupIconEvents(el, node, onSelect, context);

  return el;
}

/* =========================
   GRAFIKA IKONY
========================= */

/**
 * Zwraca HTML grafiki ikony (PNG lub SVG)
 * @param {Object} node - Węzeł z filesystemData
 * @returns {string} HTML grafiki
 */
export function getIconGraphic(node) {
  // Jeśli node ma custom icon - użyj go
  if (node.icon) {
    return `<img src="${node.icon}" alt="${node.name}">`;
  }

  // === WERSJA Z PNG (domyślna) ===
  const iconPaths = {
    folder: "assets/icons/folder.png",
    txt: "assets/icons/document.png",
    image: "assets/icons/image.png",
    mp3: "assets/icons/music.png",
    trash: "assets/icons/trash.png",
    app: "assets/icons/application.png",
    default: "assets/icons/unknown.png",
    computer: "assets/icons/computer.png",
    link: "assets/icons/link.png",
    csv: "assets/icons/csv.png"
  };

  const path = iconPaths[node.type] || iconPaths.default;
  return `<img src="${path}" alt="${node.name}">`;

  // === ALTERNATYWNIE: SVG ===
  // Odkomentuj poniżej i zakomentuj PNG jeśli wolisz SVG
  /*
  const icons = {
    folder: `
      <svg width="32" height="32" viewBox="0 0 32 32">
        <rect x="2" y="8" width="28" height="20" fill="#ffcc00" stroke="#000" stroke-width="1"/>
        <path d="M2,8 L2,6 L14,6 L16,8 Z" fill="#ffcc00" stroke="#000" stroke-width="1"/>
        <rect x="3" y="9" width="26" height="2" fill="#ffd700"/>
      </svg>
    `,
    txt: `
      <svg width="32" height="32" viewBox="0 0 32 32">
        <rect x="6" y="4" width="20" height="24" fill="#fff" stroke="#000" stroke-width="1"/>
        <line x1="9" y1="10" x2="23" y2="10" stroke="#000" stroke-width="1"/>
        <line x1="9" y1="14" x2="23" y2="14" stroke="#000" stroke-width="1"/>
        <line x1="9" y1="18" x2="20" y2="18" stroke="#000" stroke-width="1"/>
        <line x1="9" y1="22" x2="18" y2="22" stroke="#000" stroke-width="1"/>
      </svg>
    `,
    image: `
      <svg width="32" height="32" viewBox="0 0 32 32">
        <rect x="4" y="4" width="24" height="24" fill="#87ceeb" stroke="#000" stroke-width="1"/>
        <circle cx="10" cy="10" r="3" fill="#ffff00"/>
        <path d="M4,24 L12,16 L16,20 L24,12 L28,16 L28,28 L4,28 Z" fill="#90ee90"/>
      </svg>
    `,
    mp3: `
      <svg width="32" height="32" viewBox="0 0 32 32">
        <rect x="6" y="4" width="20" height="24" fill="#ff69b4" stroke="#000" stroke-width="1"/>
        <circle cx="16" cy="16" r="6" fill="#fff" stroke="#000" stroke-width="1"/>
        <path d="M16,10 L16,22 M10,16 L22,16" stroke="#000" stroke-width="2"/>
      </svg>
    `,
    trash: `
      <svg width="32" height="32" viewBox="0 0 32 32">
        <rect x="8" y="10" width="16" height="18" rx="2" fill="#c0c0c0" stroke="#000" stroke-width="1"/>
        <rect x="6" y="8" width="20" height="3" fill="#808080" stroke="#000" stroke-width="1"/>
        <rect x="12" y="4" width="8" height="4" fill="#808080" stroke="#000" stroke-width="1"/>
        <line x1="11" y1="14" x2="11" y2="24" stroke="#000" stroke-width="1"/>
        <line x1="16" y1="14" x2="16" y2="24" stroke="#000" stroke-width="1"/>
        <line x1="21" y1="14" x2="21" y2="24" stroke="#000" stroke-width="1"/>
      </svg>
    `,
    app: `
      <svg width="32" height="32" viewBox="0 0 32 32">
        <rect x="4" y="4" width="24" height="24" fill="#008080" stroke="#000" stroke-width="1"/>
        <rect x="6" y="6" width="20" height="3" fill="#000080"/>
        <rect x="8" y="12" width="16" height="12" fill="#fff" stroke="#000" stroke-width="1"/>
      </svg>
    `,
    default: `
      <svg width="32" height="32" viewBox="0 0 32 32">
        <rect x="6" y="6" width="20" height="20" fill="#c0c0c0" stroke="#000" stroke-width="1"/>
        <text x="16" y="20" text-anchor="middle" font-size="16">?</text>
      </svg>
    `
  };

  return icons[node.type] || icons.default;
  */
}

/* =========================
   EVENTY IKON
========================= */

/**
 * Dodaje obsługę kliknięć do ikony
 * @param {HTMLElement} iconElement - Element ikony
 * @param {Object} node - Węzeł z filesystemData
 * @param {Function} onSelect - Callback przy zaznaczeniu
 * @param {string} context - Kontekst ("desktop" lub "folder")
 */
function setupIconEvents(iconElement, node, onSelect, context) {
  if (!node) {
    console.error("setupIconEvents: node is undefined!", iconElement);
    return;
  }

  console.log("setupIconEvents dla:", node.name, "typ:", node.type);

  // Single click - zaznaczenie
  iconElement.addEventListener("click", (e) => {
    e.stopPropagation();

    if (onSelect) {
      onSelect(iconElement);
    } else {
      // Domyślna logika zaznaczania
      selectIcon(iconElement, context);
    }
  });

  // Double click - otwarcie
  iconElement.addEventListener("dblclick", (e) => {
    e.stopPropagation();

    // DODAJ SPRAWDZENIE TUTAJ TEŻ
    if (!node) {
      console.error("dblclick: node is undefined!");
      alert("Błąd: Nie można otworzyć pliku - brak danych");
      return;
    }

    console.log("Otwieranie przez dblclick:", node.name, node);
    openNode(node);
  });
}

/**
 * Zaznacza ikonę (domyślna implementacja)
 * @param {HTMLElement} iconElement - Element do zaznaczenia
 * @param {string} context - Kontekst zaznaczenia
 */
function selectIcon(iconElement, context) {
  const containerSelector = context === "folder"
    ? ".folder-content"
    : "#icons";

  const container = iconElement.closest(containerSelector);
  if (!container) return;

  // Odznacz wszystkie w tym kontenerze
  container.querySelectorAll(".icon, .folder-icon").forEach(icon => {
    icon.classList.remove("selected");
  });

  // Zaznacz klikniętą
  iconElement.classList.add("selected");
}

/* =========================
   HELPER: RENDEROWANIE LISTY IKON
========================= */

/**
 * Renderuje listę ikon do kontenera
 * @param {Array} nodes - Lista węzłów do wyrenderowania
 * @param {HTMLElement} container - Kontener na ikony
 * @param {Object} options - Opcje renderowania
 */
export function renderIconList(nodes, container, options = {}) {
  container.innerHTML = "";

  if (!nodes || nodes.length === 0) {
    if (options.emptyMessage) {
      container.innerHTML = `<p class="empty-message">${options.emptyMessage}</p>`;
    }
    return;
  }

  nodes.forEach((node, index) => {
    // DODAJ SPRAWDZENIE
    if (!node) {
      console.error(`renderIconList: node at index ${index} is undefined`);
      return;
    }

    if (!node.name) {
      console.error(`renderIconList: node at index ${index} has no name`, node);
      return;
    }

    const icon = createIconElement(node, options);
    container.appendChild(icon);
  });
}



/* =========================
   HELPER: ODZNACZANIE
========================= */

/**
 * Odznacza wszystkie ikony w kontenerze
 * @param {HTMLElement} container - Kontener z ikonami
 */
export function deselectAllIcons(container) {
  if (!container) return;

  container.querySelectorAll(".icon, .folder-icon").forEach(icon => {
    icon.classList.remove("selected");
  });
}