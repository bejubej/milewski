// /core/startMenu.js


import { getDesktopApps, openNode } from "./filesystem.js";


const startBtn = document.getElementById("startBtn");
const menu = document.getElementById("startMenu");

/* =========================
   INIT
========================= */

renderMenu();

const runBtn = document.getElementById("start-run");

if (runBtn) {
  runBtn.onclick = (e) => {
    console.log("run click");
    e.stopPropagation(); // ← BARDZO WAŻNE
    openRunDialog();
    menu.hidden = true;
  };
}


/* =========================
   EVENTS
========================= */

startBtn.onclick = () => {
  menu.hidden = !menu.hidden;
};

document.addEventListener("click", e => {
  if (!menu.contains(e.target) && e.target !== startBtn) {
    menu.hidden = true;
  }
});

/* =========================
   RENDER
========================= */

function renderMenu() {
  const apps = getDesktopApps();

  menu.innerHTML = `
    <div class="start-menu-inner">
      
      <div class="start-sidebar">
        <span>Windows 98</span>
      </div>

      <div class="start-items">
        ${apps.map(app => `
          <div class="start-item" data-app="${app.app}">
            <img src="${app.icon || 'assets/icons/application.png'}">
            <span>${app.name}</span>
          </div>
        `).join("")}

        <hr>
        

<div class="start-item" id="start-run">
  <img src="assets/icons/application.png">
  <span>Uruchom...</span>
</div>


        <!--<div class="start-item" data-app="shutdown">
          <img src="assets/icons/shutdown.png">
          <span>Zamknij system</span>
        </div>-->
      </div>

    </div>
  `;

  menu.querySelectorAll(".start-item").forEach(item => {
    item.onclick = () => {
      const app = apps.find(a => a.app === item.dataset.app);
      if (app) openNode(app);
      menu.hidden = true;
    };


  });
}



