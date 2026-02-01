// /core/desktop.js
console.log("DESKTOP MODULE LOADED");

import { FILESYSTEM } from "../data/filesystemData.js";
import { getDesktopNode } from "./filesystem.js";
import { renderIconList, deselectAllIcons } from "./iconRenderer.js";
// zagadka 6

function checkPuzzle6Unlock() {
  const unlocked = localStorage.getItem("puzzle6Unlocked");
  if (!unlocked) return;

  const desktop = getDesktopNode();
  if (!desktop) return;

  const exists = desktop.children.some(
    n => n.name === "zacisze-pensjonariusze.txt"
  );
  if (exists) return;

  desktop.children.push({
    type: "txt",
    name: "zacisze-pensjonariusze.txt",
    readOnly: true,
    src: "assets/texts/pensjonariusze.html",
    window: {
      fullscreen: true
    }
  });

  refreshDesktop();
  console.log("📄 Plik odblokowany po zagadce #6");
}
//zagadka 7
function checkPuzzle7Unlock() {
  const unlocked = localStorage.getItem("puzzle7Unlocked");
  if (!unlocked) return;

  const desktop = getDesktopNode();
  if (!desktop) return;

  const filesToAdd = [
    {
      type: "txt",
      name: "umorzenie.txt",
      src: "assets/texts/umorzenie.txt",
      readOnly: true
    },
    {
      type: "txt",
      name: "ogledziny.txt",
      src: "assets/texts/ogledziny.txt",
      readOnly: true
    }
  ];

  filesToAdd.forEach(file => {
    if (!desktop.children.some(n => n.name === file.name)) {
      desktop.children.push(file);
    }
  });

  refreshDesktop();
  console.log("📄 Plik odblokowany po zagadce #7");
}
//zagadka 8
function checkPuzzle8Unlock() {
  const unlocked = localStorage.getItem("puzzle8Unlocked");
  if (!unlocked) return;

  const desktop = getDesktopNode();
  if (!desktop) return;

  const filesToAdd = [
    {
      type: "txt",
      name: "billingiTPSA.txt",
      src: "assets/texts/billingi.html",
      readOnly: true
    },
    {
      type: "image",
      name: "informator20:00.jpg",
      src: "assets/images/qr.jpg",
      readOnly: true
    }
  ];

  filesToAdd.forEach(file => {
    if (!desktop.children.some(n => n.name === file.name)) {
      desktop.children.push(file);
    }
  });

  refreshDesktop();
  console.log("📄 Plik odblokowany po zagadce #8");
}


/* =========================
   INIT
========================= */

export function initDesktop() {
  const desktopNode = findDesktopNode(FILESYSTEM);
  if (!desktopNode) {
    console.error("Brak pulpitu w filesystemData");
    return;
  }

  renderIcons(desktopNode.children);
  setupDesktopInteractions();

  //sprawdz zagadke 6
  checkPuzzle6Unlock();
  //sprawdz zagadke 7
  checkPuzzle7Unlock();
  //sprawdz zagadke 8
  checkPuzzle8Unlock();

}

/* =========================
   SNAKE UNLOCK EASTER EGG
========================= */

window.addEventListener("snake:unlock", e => {
  unlockSnakeFile(e.detail.score);
});

function unlockSnakeFile(score) {
  const desktop = getDesktopNode();

  const exists = desktop.children.some(
    n => n.name === "1.txt"
  );
  if (exists) return;

  desktop.children.push({
    type: "txt",
    name: "1.txt",
    readOnly: true,
    content: `WYNIK: ${score}

aieqyj uygink ieu ojg ieu iqnijy aecuzyvqycu in mezmctyxu aitucitivx jyx selyvj iavih mz ieu ivyeloq nmvit kmqynebmzminvx ygit sumnk aibmea iez inknuid ibm onusevmzyduzix e qycezqykmvx itueb ea bmnmcinvx scjyvu q mvytmavyhze ama iezmnmeqyx uiecmd tuid selyvj iavih e ekuyvmtu ayj zit kenjqmvxu mlinvt enjibu ieza uytc in ieu ea idmjoq ibm mdyzmvmx ieza iexmb inya ieza ycqekinvx mdmbmenj e ikiv mz ea mnvtmx okuonuq in iezinmvq ama kmhs igya sayc aieq iez ibm idkmzelayc it mn amnumvxinvx mlyjyxu ieu mvg in aibmenjieq ieqotcitij idkmbstmvg`
  });

  refreshDesktop();
  alert("Nowy plik został odblokowany na pulpicie.");
}



/* =========================
   RUN COMMANDS
========================= */

function handleRunCommand(cmd) {
  if (cmd === "bubunio") {
    unlockRunFile();
  } else if (cmd === "reset") {
    resetGame();
  } else {
    alert("Nie można odnaleźć pliku lub polecenia.");
  }
}

function unlockRunFile() {
  const desktop = getDesktopNode();

  const exists = desktop.children.some(
    n => n.name === "akturodzenia"
  );
  if (exists) return;

  desktop.children.push({
    type: "txt",
    name: "akturodzenia",
    readOnly: true,
    src: "assets/texts/akta_pochodzenia.html",
    window:{
      fullscreen: true
    }

  });

  refreshDesktop();
  alert("Na pulpicie pojawił się nowy plik.");
}

function resetGame() {
  const confirmation = confirm("Czy chcesz zresetować grę?");

  if (confirmation) {
    //wyczysc localstorage
    localStorage.clear();

    //przeladuj strone
    alert("Gra została zresetowana");
    window.location.reload();
  }
}

/* =========================
   FIND DESKTOP
========================= */

function findDesktopNode(root) {
  if (root.type === "desktop") return root;
  if (!root.children) return null;

  for (const child of root.children) {
    const found = findDesktopNode(child);
    if (found) return found;
  }
  return null;
}

/* =========================
   RENDER ICONS
========================= */

function renderIcons(nodes) {
  const container = document.getElementById("icons");

  // Używamy uniwersalnego rendera
  renderIconList(nodes, container, {
    className: "icon",
    imageClass: "icon-image",
    labelClass: "icon-label",
    context: "desktop",
    emptyMessage: "Pulpit jest pusty"
  });
}

/* =========================
   DESKTOP INTERACTIONS
========================= */

function setupDesktopInteractions() {
  const desktop = document.getElementById("desktop");

  // Kliknięcie w pusty obszar odznacza ikony
  desktop.addEventListener("click", (e) => {
    if (e.target === desktop || e.target.id === "icons") {
      const iconsContainer = document.getElementById("icons");
      deselectAllIcons(iconsContainer);
    }
  });
}

/* =========================
   RUN DIALOG
========================= */

window.openRunDialog = function () {
  const dialog = document.createElement("div");
  dialog.className = "run-dialog";

  dialog.innerHTML = `
    <div class="run-title">Uruchom</div>
    <input id="run-input" type="text" placeholder="Wpisz polecenie">
    <div class="run-actions">
      <button id="run-ok">OK</button>
      <button id="run-cancel">Anuluj</button>
    </div>
  `;

  document.body.appendChild(dialog);

  document.getElementById("run-ok").onclick = () => {
    const value = document.getElementById("run-input").value.trim();
    handleRunCommand(value);
    dialog.remove();
  };

  document.getElementById("run-cancel").onclick = () => {
    dialog.remove();
  };
};


/* =========================
   PUBLIC API
========================= */

export function refreshDesktop() {
  const desktopNode = findDesktopNode(FILESYSTEM);
  if (desktopNode) {
    renderIcons(desktopNode.children);
  }
}

window.addEventListener("storage", (e) => {
  if (e.key === "puzzle6Unlocked" && e.newValue === "true") {
    checkPuzzle6Unlock();
  }

  if (e.key === "puzzle7Unlocked" && e.newValue === "true") {
    checkPuzzle7Unlock();
  }

    if (e.key === "puzzle8Unlocked" && e.newValue === "true") {
    checkPuzzle8Unlock();
  }
});



