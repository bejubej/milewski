// /core/windowManager.js

/* =========================
   STATE
========================= */
let windowIdCounter = 1;
let zIndexCounter = 100;
let dragTarget = null;
let dragOffsetX = 0;
let dragOffsetY = 0;
let resizeTarget = null;
let resizeStartX = 0;
let resizeStartY = 0;
let startWidth = 0;
let startHeight = 0;


// Losowe pozycjonowanie okien
let lastWindowX = 100;
let lastWindowY = 60;

/* =========================
   PUBLIC API
========================= */

export function createWindow(title, contentHTML, options = {}) {
  const {
    width = 600,
    height = 450,
    fullscreen = false,
    resizable=true
  } = options;

  const windowId = windowIdCounter++;

  const win = document.createElement("div");
  win.className = "window";
  win.dataset.windowId = windowId;
  win.style.position = "absolute";

  if (fullscreen) {
    win.style.left = "0px";
    win.style.top = "0px";
    win.style.width = "100vw";
    win.style.height = "calc(100vh - 28px)";
  } else {
    win.style.width = width + "px";
    win.style.height = height + "px";
    win.style.left = lastWindowX + "px";
    win.style.top = lastWindowY + "px";
  }


  // Losowe pozycjonowanie (z kaskadą)
  if (!fullscreen) {
    win.style.left = lastWindowX + "px";
    win.style.top = lastWindowY + "px";
  }

  win.style.zIndex = ++zIndexCounter;

  // Aktualizuj pozycję dla następnego okna
  lastWindowX += 30;
  lastWindowY += 30;

  // Reset jeśli za daleko od ekranu
  if (lastWindowX > window.innerWidth - 250) {
    lastWindowX = 100;
  }
  if (lastWindowY > window.innerHeight - 250) {
    lastWindowY = 60;
  }

  win.innerHTML = `
    <div class="titlebar">
      <span class="title">${title}</span>
      <button class="close">✕</button>
    </div>
    <div class="content">
      ${contentHTML}
    </div>
    ${resizable ? '<div class="resize-handle"></div>' : ''}
  `;

  document.getElementById("desktop").appendChild(win);

  // Emit window:open event dla taskbar
  document.dispatchEvent(new CustomEvent("window:open", {
    detail: { id: windowId, title }
  }));

  // Focus przy kliknięciu
  win.addEventListener("mousedown", () => {
    bringToFront(win);

    // Emit window:focus event
    document.dispatchEvent(new CustomEvent("window:focus", {
      detail: { id: windowId }
    }));
  });

  // Close button
  const closeBtn = win.querySelector(".close");
  closeBtn.onclick = (e) => {
    e.stopPropagation(); // Nie triggeruj focus

    // Emit window:close event
    document.dispatchEvent(new CustomEvent("window:close", {
      detail: { id: windowId }
    }));

    win.remove();
  };

  // Drag functionality
  const titlebar = win.querySelector(".titlebar");
  titlebar.addEventListener("mousedown", e => {
    // Nie drag jeśli kliknięto close button
    if (e.target.classList.contains("close")) return;
    startDrag(e, win);
  });

  const resizeHandle = win.querySelector(".resize-handle");
  if (resizeHandle) {
    resizeHandle.addEventListener("mousedown", e => {
      e.stopPropagation();
      startResize(e, win);
    });
  }


  // Auto-focus nowego okna
  bringToFront(win);
  document.dispatchEvent(new CustomEvent("window:focus", {
    detail: { id: windowId }
  }));

  return win;
}

/* =========================
   INTERNALS
========================= */
function startResize(e, win) {
  resizeTarget = win;
  resizeStartX = e.clientX;
  resizeStartY = e.clientY;
  startWidth = win.offsetWidth;
  startHeight = win.offsetHeight;

  bringToFront(win);
  win.classList.add("resizing");
}



function bringToFront(win) {
  win.style.zIndex = ++zIndexCounter;
}

function startDrag(e, win) {
  dragTarget = win;
  dragOffsetX = e.clientX - win.offsetLeft;
  dragOffsetY = e.clientY - win.offsetTop;

  bringToFront(win);

  // Dodaj klasę podczas przeciągania (opcjonalnie)
  win.classList.add("dragging");
}

/* =========================
   GLOBAL DRAG HANDLERS
========================= */

document.addEventListener("mousemove", e => {

  // DRAG
  if (dragTarget) {
    let newX = e.clientX - dragOffsetX;
    let newY = e.clientY - dragOffsetY;

    const maxX = window.innerWidth - dragTarget.offsetWidth;
    const maxY = window.innerHeight - dragTarget.offsetHeight - 28;

    newX = Math.max(0, Math.min(newX, maxX));
    newY = Math.max(0, Math.min(newY, maxY));

    dragTarget.style.left = newX + "px";
    dragTarget.style.top = newY + "px";
  }

  // RESIZE
  if (resizeTarget) {
    const dx = e.clientX - resizeStartX;
    const dy = e.clientY - resizeStartY;

    const minWidth = 300;
    const minHeight = 200;

    resizeTarget.style.width =
      Math.max(minWidth, startWidth + dx) + "px";
    resizeTarget.style.height =
      Math.max(minHeight, startHeight + dy) + "px";
  }
});


document.addEventListener("mouseup", () => {
  if (dragTarget) {
    dragTarget.classList.remove("dragging");
    dragTarget = null;
  }

  if (resizeTarget) {
    resizeTarget.classList.remove("resizing");
    resizeTarget = null;
  }
});


/* =========================
   UTILITIES (opcjonalne)
========================= */

// Minimalizuj okno (dla przyszłych rozszerzeń)
export function minimizeWindow(windowId) {
  const win = document.querySelector(`.window[data-window-id="${windowId}"]`);
  if (win) {
    win.style.display = "none";
    document.dispatchEvent(new CustomEvent("window:minimize", {
      detail: { id: windowId }
    }));
  }
}

// Przywróć okno (dla przyszłych rozszerzeń)
export function restoreWindow(windowId) {
  const win = document.querySelector(`.window[data-window-id="${windowId}"]`);
  if (win) {
    win.style.display = "block";
    bringToFront(win);
    document.dispatchEvent(new CustomEvent("window:focus", {
      detail: { id: windowId }
    }));
  }
}

// Zamknij wszystkie okna (np. przy wylogowaniu)
export function closeAllWindows() {
  document.querySelectorAll(".window").forEach(win => {
    const id = win.dataset.windowId;
    document.dispatchEvent(new CustomEvent("window:close", {
      detail: { id: parseInt(id) }
    }));
    win.remove();
  });
}

