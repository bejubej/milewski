// /apps/mail.js

import { createWindow } from "../core/windowManager.js";
import { renderMailLayout, bindMailEvents } from "../core/mailRenderer.js";

export function openMail() {
  const win = createWindow(
    "Poczta",
    renderMailLayout(),
    520,
    320
  );

  bindMailEvents(win);
}
