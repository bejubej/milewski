// /apps/imageViewer.js

import { createWindow } from "../core/windowManager.js";

/* =========================
   PUBLIC
========================= */

export function openImage(node) {
  const html = `
    <div class="image-viewer">
      <img src="${node.src}" alt="${node.name}">
    </div>
  `;

  createWindow(
    node.name,
    html,
    500,
    360
  );
}
