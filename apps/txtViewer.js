// /apps/txtViewer.js

import { createWindow } from "../core/windowManager.js";

/* =========================
   PUBLIC
========================= */

export function openTxtFile(node) {
  const html = `
    <pre class="txt-viewer">
${escapeHTML(node.content || "")}
    </pre>
  `;

  createWindow(
    node.name,
    html,
    420,
    320
  );
}

/* =========================
   UTILS
========================= */

function escapeHTML(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
