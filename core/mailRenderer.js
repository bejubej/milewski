// /core/mailRenderer.js

import { MAILS } from "../data/mailData.js";

export function renderMailLayout() {
  return `
    <div class="mail-container">
      <div class="mail-list">
        ${renderMailList()}
      </div>
      <div class="mail-view">
        <i>Wybierz wiadomość</i>
      </div>
    </div>
  `;
}

function renderMailList() {
  return MAILS.map(mail => `
    <div class="mail-item ${mail.unread ? "unread" : ""}"
         data-id="${mail.id}">
      <b>${mail.from}</b><br>
      <small>${mail.subject}</small>
    </div>
  `).join("");
}

// /core/mailRenderer.js

function formatMailBody(body) {
  if (!body) return "";

  const lines = body.split('\n');
  return lines.map(line => {
    // Sprawdzamy czy linia jest cytatem
    if (line.trim().startsWith('>')) {
      const quotedText = line.replace(/^>\s?/, '');
      // Zwracamy span z klasą, ale pilnujemy, by był blokowy w CSS
      return `<div class="mail-quote">${quotedText}</div>`;
    }
    // Zwykła linia tekstu (jeśli pusta, dajemy odstęp)
    return line.trim() === "" ? "<br>" : `<div>${line}</div>`;
  }).join("");
}

export function bindMailEvents(win) {
  const view = win.querySelector(".mail-view");

  win.querySelectorAll(".mail-item").forEach(item => {
    item.onclick = () => {
      const id = Number(item.dataset.id);
      const mail = MAILS.find(m => m.id === id);
      if (!mail) return;

      mail.unread = false;
      item.classList.remove("unread");

      // KLUCZOWA ZMIANA: Usunięto <pre>, dodano klasę mail-body-content
      view.innerHTML = `
        <b>Od:</b> ${mail.from} &lt;${mail.fromEmail}&gt;<br>
        <b>Do:</b> ${mail.to} &lt;${mail.toEmail}&gt;<br>
        <b>Temat:</b> ${mail.subject}
        <hr>
        <div class="mail-body-content">
          ${formatMailBody(mail.body)}
        </div>
        ${mail.image ? `<div class="mail-image"><img src="${mail.image}"></div>` : ""}
      `;
    };
  });
}