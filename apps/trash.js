// /apps/trash.js

import { createWindow } from "../core/windowManager.js";
//import { renderDesktop } from "../core/desktop.js";

export function openTrash(trashNode) {
  const html = renderTrash(trashNode);

  const win = createWindow(
    "Kosz",
    html,
    320,
    260
  );

  bindTrashEvents(win, trashNode);
}

function renderTrash(trashNode) {
  if (trashNode.items.length === 0) {
    return `<p>Kosz jest pusty.</p>`;
  }

  return `
    <ul class="trash-list">
      ${trashNode.items.map((n, i) => `
        <li data-index="${i}">
          ${n.name}
        </li>
      `).join("")}
    </ul>
    <button id="emptyTrash">Opróżnij kosz</button>
  `;
}

function bindTrashEvents(win, trashNode) {
  const list = win.querySelector(".trash-list");

  if (list) {
    list.onclick = e => {
      const li = e.target.closest("li");
      if (!li) return;

      const index = Number(li.dataset.index);
      const node = trashNode.items[index];

      // otwieramy jak normalny node
      import("../core/filesystem.js").then(fs => {
        fs.openNode(node);
      });
    };
  }

  const btn = win.querySelector("#emptyTrash");
  if (btn) {
    btn.onclick = () => {
      trashNode.items.length = 0;
      win.remove();
      renderDesktop();
    };
  }
}
