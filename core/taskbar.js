// /core/taskbar.js

const taskbar = document.getElementById("taskbar");
const buttons = new Map();

/* =========================
   EVENTS FROM WINDOW MANAGER
========================= */

document.addEventListener("window:open", e => {
  const { id, title } = e.detail;

  const btn = document.createElement("button");
  btn.textContent = title;
  btn.dataset.windowId = id;

  btn.onclick = () => {
    const win = document.querySelector(
      `.window[data-window-id="${id}"]`
    );
    if (win) {
      win.dispatchEvent(new MouseEvent("mousedown"));
    }
  };

  taskbar.appendChild(btn);
  buttons.set(id, btn);
});

document.addEventListener("window:close", e => {
  const { id } = e.detail;
  const btn = buttons.get(id);
  if (btn) btn.remove();
  buttons.delete(id);
});

document.addEventListener("window:focus", e => {
  buttons.forEach(b => b.classList.remove("active"));
  const btn = buttons.get(e.detail.id);
  if (btn) btn.classList.add("active");
});
