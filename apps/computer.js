// /apps/computer.js

import { createWindow } from "../core/windowManager.js";

/* =========================
   PUBLIC API
========================= */

export function openComputer() {
  const info = getSystemInfo();

  const html = `
    <div class="computer-properties">
      
      <!-- Header z ikoną i systemem -->
      <div class="computer-header">
        <div class="computer-icon">💻</div>
        <div class="computer-info">
          <div class="computer-title">Microsoft Windows 98</div>
          <div class="computer-subtitle">Wersja 4.10.2222 A</div>
        </div>
      </div>
      
      <!-- Separator -->
      <div class="win98-separator"></div>
      
      <!-- Sekcja: Zarejestrowany na -->
      <div class="computer-section">
        <div class="section-label">Zarejestrowany na:</div>
        <div class="section-value-group">
          <div class="value-row">Detektyw Jan Kowalski</div>
          <div class="value-row">Komisariat Policji Warszawa</div>
        </div>
      </div>
      
      <div class="win98-separator"></div>
      
      <!-- Sekcja: Numer seryjny -->
      <div class="computer-section">
        <div class="section-label">Numer seryjny:</div>
        <div class="section-value">55274-OEM-0011903-00102</div>
      </div>
      
      <div class="win98-separator"></div>
      
      <!-- Sekcja: Komputer -->
      <div class="computer-section">
        <div class="section-row">
          <div class="section-icon">🖥️</div>
          <div class="section-details">
            <div class="detail-line"><b>Procesor:</b> Intel Pentium II 400 MHz</div>
            <div class="detail-line"><b>Pamięć RAM:</b> ${info.ram}</div>
            <div class="detail-line"><b>Pamięć dostępna:</b> ${info.availableRam}</div>
          </div>
        </div>
      </div>
      
      <div class="win98-separator"></div>
      
      <!-- Sekcja: Dysk twardy -->
      <div class="computer-section">
        <div class="section-row">
          <div class="section-icon">💾</div>
          <div class="section-details">
            <div class="detail-line"><b>Dysk (C:):</b> 4.3 GB (FAT32)</div>
            <div class="detail-line"><b>Wolne miejsce:</b> 1.8 GB</div>
            <div class="detail-line"><b>Używane:</b> 2.5 GB</div>
          </div>
        </div>
      </div>
      
      <div class="win98-separator"></div>
      
      <!-- Sekcja: Urządzenia -->
      <div class="computer-section">
        <div class="section-label">Zainstalowane urządzenia:</div>
        <div class="section-value-group">
          <div class="value-row">• Karta graficzna: Matrox Millennium G200 (8 MB)</div>
          <div class="value-row">• Karta dźwiękowa: Sound Blaster 16</div>
          <div class="value-row">• Modem: US Robotics 56K V.90</div>
          <div class="value-row">• Napęd CD-ROM: 24x</div>
        </div>
      </div>
      
      <div class="win98-separator"></div>
      
      <!-- Footer -->
      <div class="computer-footer">
        © Microsoft Corporation 1981-1998
      </div>
      
    </div>
  `;

  const win = createWindow(
    "Właściwości: Mój komputer",
    html,
    400,
    500
  );
}

/* =========================
   SYSTEM INFO
========================= */

function getSystemInfo() {
  // Prawdziwa pamięć z przeglądarki (dla immersji)
  const totalRamGB = navigator.deviceMemory || 0.064; // domyślnie 64 MB
  const totalRamMB = totalRamGB >= 1
    ? Math.floor(totalRamGB * 1024)
    : Math.floor(totalRamGB * 1000);

  const availableRamMB = Math.floor(totalRamMB * 0.75); // 75% dostępne

  return {
    ram: `${totalRamMB} MB`,
    availableRam: `${availableRamMB} MB`,
  };
}