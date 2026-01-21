// /apps/browser.js

import { fetchWeather } from "./weatherService.js";
import { createWindow } from "../core/windowManager.js";

const ARTICLES = [
  {
    id: "news15",
    title: "Śmiertelny wypadek na DK91",
    date: "1.10.1998, 12:15",
    lead: "Wypadek na drodze krajowej DK91",
    file: "assets/articles/news15.html"
  },
  {
    id: "news1",
    title: "Makabryczne odkrycie w Piotrkowie Trybunalskim",
    date: "20.09.1998, 18:54",
    lead: "Śmierć mieszkańca, prokuratura bada sprawę",
    file: "assets/articles/news1.html"
  },
  {
    id: "news9",
    title: "Festyn rodzinny - relacja",
    date: "12.03.1998, 09:15",
    lead: "Festyn rodzinny w Milejowie",
    file: "assets/articles/news9.html"
  },
  {
    id: "news6",
    title: "Zaginiony redaktor Tomasz Wolski",
    date: "11.09.1998, 8:15",
    lead: "Z przykrością informujemy o zaginięciu naszego redakcyjnego kolegi",
    file: "assets/articles/news6.html"
  },
  {
    id: "news16",
    title: "Wybory samorządowe 1998 - kandydaci",
    date: "10.09.1998, 11:24",
    lead: "Przedstawienie sylwetek kandydatów",
    file: "assets/articles/news16.html"
  },

  {
    id: "news8",
    title: "Nowy rok szkolny 1998/99",
    date: "01.09.1998, 10:30",
    lead: "Milejowskie dzieci wracają do szkół",
    file: "assets/articles/news8.html"
  },
  {
    id: "news10",
    title: "Wydarzenia w regionie",
    date: "25.08.1998, 19:20",
    lead: "Skrót informacji",
    file: "assets/articles/news10.html"
  },
  {
    id: "news17",
    title: "Kontrola fermy drobiu w Milejowie",
    date: "23.07.1998, 14:02",
    lead: "Rutynowa kontrola. Nie stwierdzono uchybień",
    file: "assets/articles/news17.html"
  },
  {
    id: "news14",
    title: "Wybory samorządowe 1998",
    date: "22.07.1998, 07:43",
    lead: "Mieszkańcy wybierają nowe władze",
    file: "assets/articles/news14.html"
  },

  {
    id: "news12",
    title: "Wydarzenia w regionie",
    date: "01.07.1998, 15:46",
    lead: "Skrót informacji z regionu",
    file: "assets/articles/news12.html"
  },

  {
    id: "news7",
    title: "Obcy w Milejowie?",
    date: "23.06.1998, 10:55",
    lead: "Mieszkańcy regionu obawiają się przybyszów",
    file: "assets/articles/news7.html"
  },

  {
    id: "news3",
    title: "Łódź. Nielegalnie zatrudnieni",
    date: "17.06.1998, 11:34",
    lead: "Nielegalnie zatrudnieni cudzoziemcy w firmie w Łodzi",
    file: "assets/articles/news3.html"
  },
  {
    id: "news2",
    title: "Rolnicy protestują przeciwko importowi zboża",
    date: "29.05.1998, 08:30",
    lead: "Protest w Muszynie",
    file: "assets/articles/news2.html"
  },

  {
    id: "news4",
    title: "Nowa ferma drobiu w Milejowie",
    date: "22.05.1998, 13:41",
    lead: "Lokalny biznesmen Janusz Skowroński rozbudowuje ferme drobiu",
    file: "assets/articles/news4.html"
  },

  {
    id: "news5",
    title: "REKLAMA. Dom Spokojnej Starości Zacisze",
    date: "01.05.1998, 14:15",
    lead: "Zapoznaj się z oferta domu Zacisze",
    file: "assets/articles/news5.html"
  },

  {
    id: "news13",
    title: "Ogłoszenia duszpasterkie",
    date: "20.04.1998, 12:00",
    lead: "Ogłoszenia duszpasterkie",
    file: "assets/articles/news13.html"
  },

  {
    id: "news11",
    title: "Zmiany w piotrkowskiej Prokuraturze",
    date: "02.04.1998, 15:12",
    lead: "Nowe zadania i zakres obowiązków prokuratorów",
    file: "assets/articles/news11.html"
  },

  {
    id: "news18",
    title: "Łódź: Grupa przestępcza rozbita",
    date: "12.03.1998, 11:41",
    lead: "Rozbito grupę przemytników tytoniu",
    file: "assets/articles/news18.html"
  },
  {
    id: "news20",
    title: "Podsumowanie programu rządowego",
    date: "10.01.1998, 10:34",
    lead: "Podsumowanie programu dopłat dla przedsiębiorców zatrudniających osoby 70+",
  },
  {
    id: "news19",
    title: "Nowy dziennikarz zasila szeregi redakcji",
    date: "02.01.1998, 11:41",
    lead: "Witamy redaktora Tomasza Wolskiego na pokładzie",
    file: "assets/articles/news19.html"
  }


];


function renderNewsList() {
  return ARTICLES.map(a => `
    <table width="100%" cellpadding="6">
      <tr>
        <td width="80" valign="top">
          <img src="assets/images/news.jpg" width="70" border="1">
        </td>
        <td>
          <font size="3">
            <b><a href="#" data-article="${a.id}">${a.title}</a></b>
          </font><br>
          <font size="2" color="#666666">${a.date}</font><br>
          <font size="2">${a.lead}</font><br>
          <a href="#" data-article="${a.id}">Czytaj dalej »</a>
        </td>
      </tr>
    </table>
    <hr>
  `).join("");
}



/* =========================
   PAGES (Portal lokalny 2000)
========================= */
const PAGES = {
  home: {
    title: "Piotrków Trybunalski - Portal Regionalny",
    html: `
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td bgcolor="#CC0000" height="70" align="center">
            <font color="#FFFF00" size="6" face="Arial, Verdana"><b>PIOTRKOW.PL</b></font><br>
            <font color="#FFFFFF" size="2" face="Arial">Twój lokalny portal informacyjny</font>
          </td>
        </tr>
        <tr>
          <td bgcolor="#990000" height="25">
            <font color="#FFFFFF" size="2" face="Arial">
              &nbsp;&nbsp;<a href="#" data-page="home" style="color:#FFFF00;">Start</a> | 
              <!--<a href="#" data-page="news" style="color:#FFFFFF;">Wiadomości</a> |--> 
              <a href="#" data-page="weather" style="color:#FFFFFF;">Pogoda</a> | 
              <a href="#" data-page="ads" style="color:#FFFFFF;">Ogłoszenia</a> | 
              <a href="#" data-page="events" style="color:#FFFFFF;">Wydarzenia</a> | 
              <a href="#" data-page="contact" style="color:#FFFFFF;">Kontakt</a>
            </font>
          </td>
        </tr>
      </table>
      
      <table width="100%" cellpadding="8" cellspacing="0" border="0">
        <tr>
          <!-- LEWA KOLUMNA -->
          <td width="160" valign="top" bgcolor="#EEEEEE">
            <table width="100%" bgcolor="#003366" cellpadding="4">
              <tr><td><font color="#FFFFFF" size="2"><b>⚡ SZYBKIE LINKI</b></font></td></tr>
            </table>
            <p><font size="2">
              <!--🏛️ <a href="#" data-page="news">Aktualności</a><br>-->
              ☁️ <a href="#" data-page="weather">Pogoda</a><br>
              📰 <a href="#" data-page="ads">Ogłoszenia</a><br>
              🎭 <a href="#" data-page="events">Co się dzieje?</a><br>
              📞 <a href="#" data-page="contact">Kontakt</a>
            </font></p>
            
            <table width="100%" bgcolor="#FFCC00" cellpadding="4">
              <tr>
                <td><font size="2"><b>☀️ POGODA</b></font></td>
               </tr>
            </table>

            <p>
              <font size="2">
                 <b>PIOTRKOW TRYB.</b><br>
                  Temp: <b id="sidebar-temp">--°C</b><br>
                  <span id="sidebar-desc">Ładowanie...</span><br>
                  <a href="#" data-page="weather">Zobacz więcej »</a>
              </font>
            </p>

            
            <table width="100%" bgcolor="#003366" cellpadding="4">
              <tr><td><font color="#FFFFFF" size="2"><b>📊 SONDA</b></font></td></tr>
            </table>
            <p><font size="2">
              <b>Jak oceniasz komunikację miejską?</b><br>
              <input type="radio" name="poll"> Bardzo dobrze<br>
              <input type="radio" name="poll"> Dobrze<br>
              <input type="radio" name="poll"> Źle<br>
              <input type="button" value="Głosuj" style="margin-top:4px;">
            </font></p>
            
            <hr>
            
            <center>
              <font size="1" color="#808080">
                <b>REKLAMA</b><br>
                <table border="1" cellpadding="8" bgcolor="#FFFFCC">
                  <tr><td align="center">
                    <b>PIZZA</b><br>
                    Zamów teraz!<br>
                    Tel: (44) 648 08 33
                  </td></tr>
                </table>
              </font>
            </center>
          </td>
          
          <!-- GŁÓWNA TREŚĆ -->
          <td valign="top" bgcolor="#FFFFFF">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td>
                  <font size="2" color="#999999">
                    <b id="current-date">Ładowanie daty...</b>
                  </font>
                </td>
              </tr>
            </table>
            
            <h2>🔥 Najnowsze wiadomości</h2>
            ${renderNewsList()}

            <h3>📌 Ważne ogłoszenia</h3>
            <ul>
              <li><font size="2">Wybory samorządowe! Polaku spełnij obywatelski obowiązek i zagłosuj w przyszłych wyborach </font></li>
              <li><font size="2">Awaria prądu w Milejowie - trwają prace naprawcze</font></li>
              <li><font size="2">Wymiana dowodów osobistych - nowy termin: do 30.10.1998</font></li>
            </ul>
            
            <br>
            
            <table width="100%" bgcolor="#FFFFEE" border="1" cellpadding="8">
              <tr>
                <td>
                  <font size="2">
                    <b>🎭 WYDARZENIE TYGODNIA</b><br>
                    <b>Koncert Reni Jusis w Miejskim Ośrodku Kultury w Piotrkowie </b><br>
                    Sobota, 05.12.1998, godz. 19:00<br>
                    Bilety: 15-25 zł<br>
                    <a href="#" data-page="events">Więcej informacji »</a>
                  </font>
                </td>
              </tr>
            </table>
            
            <br><br>
            
            <hr>
            <center>
              <font size="1" color="#999999">
                © 1998 Piotrkow.pl | Wszelkie prawa zastrzeżone<br>
                Webmaster: admin@piotrkow.pl | <a href="#" data-page="contact">Kontakt</a><br>
                <img src="data:image/svg+xml,%3Csvg width='80' height='15' xmlns='http://www.w3.org/2000/svg'%3E%3Crect fill='%23666' width='80' height='15'/%3E%3Ctext x='40' y='11' text-anchor='middle' font-size='8' fill='white'%3ECOUNTER: 12847%3C/text%3E%3C/svg%3E">
              </font>
            </center>
          </td>
        </tr>
      </table>
    `
  },

  news: {
    title: "Wiadomości",
    html: `
      <table width="100%" bgcolor="#CC0000" cellpadding="6">
        <tr><td><font color="#FFFFFF" size="4"><b>📰 Wiadomości lokalne</b></font></td></tr>
      </table>
      
      <p><a href="#" data-page="home">« Powrót do strony głównej</a></p>
      
      <h3>Najnowsze wiadomości z Piotrkowa i regionu</h3>
      
      <!--<table width="100%" border="1" cellpadding="6" cellspacing="0">
        <tr bgcolor="#EEEEEE">
          <td><b>Data</b></td>
          <td><b>Tytuł</b></td>
          <td><b>Kategoria</b></td>
        </tr>
        <tr>
          <td>13.03.98</td>
          <td><a href="#" data-article="news1">Remont Mostu Poniatowskiego</a></td>
          <td><font color="#FF0000">Komunikacja</font></td>
        </tr>
        <tr bgcolor="#F5F5F5">
          <td>12.03.98</td>
          <td><a href="#" data-article="news2">Nowa linia autobusowa 187</a></td>
          <td><font color="#0000FF">Transport</font></td>
        </tr>
        <tr>
          <td>11.03.98</td>
          <td>Otwarcie nowego parku na Ursynowie</td>
          <td><font color="#00AA00">Miejsce</font></td>
        </tr>
        <tr bgcolor="#F5F5F5">
          <td>10.03.98</td>
          <td>Festiwal filmowy w Cinema City</td>
          <td><font color="#AA00AA">Kultura</font></td>
        </tr>
        <tr>
          <td>09.03.98</td>
          <td>Wyniki referendum lokalnego</td>
          <td><font color="#FF6600">Polityka</font></td>
        </tr>-->
      </table>
    `
  },

  weather: {
    title: "Pogoda",
    html: `
      <table width="100%" bgcolor="#0066CC" cellpadding="6">
        <tr><td><font color="#FFFFFF" size="4"><b>☁️ Prognoza pogody</b></font></td></tr>
      </table>
      
      <p><a href="#" data-page="home">« Powrót do strony głównej</a></p>
      
      <h2>Pogoda dla Piotrkowa</h2>
      <p><font size="2">Aktualizacja: 13.03.1998, godz. 15:00</font></p>
      
      <table width="100%" border="1" cellpadding="8" cellspacing="0">
        <tr bgcolor="#CCDDFF">
          <td align="center"><b>Dzień</b></td>
          <td align="center"><b>Temperatura</b></td>
          <td align="center"><b>Warunki</b></td>
          <td align="center"><b>Opady</b></td>
        </tr>
        <tr>
          <td><b>Piątek 13.03</b></td>
          <td align="center">12°C / 5°C</td>
          <td align="center">☀️ Słonecznie</td>
          <td align="center">0%</td>
        </tr>
        <tr bgcolor="#F0F0F0">
          <td><b>Sobota 14.03</b></td>
          <td align="center">14°C / 7°C</td>
          <td align="center">⛅ Częściowe zachmurzenie</td>
          <td align="center">10%</td>
        </tr>
        <tr>
          <td><b>Niedziela 15.03</b></td>
          <td align="center">11°C / 6°C</td>
          <td align="center">🌧️ Deszcz</td>
          <td align="center">70%</td>
        </tr>
        <tr bgcolor="#F0F0F0">
          <td><b>Poniedziałek 16.03</b></td>
          <td align="center">9°C / 3°C</td>
          <td align="center">☁️ Pochmurno</td>
          <td align="center">20%</td>
        </tr>
      </table>
      
      <br>
      
      <table width="100%" bgcolor="#FFFFCC" border="1" cellpadding="8">
        <tr>
          <td>
            <b>ℹ️ Informacje dodatkowe:</b><br>
            Ciśnienie: 1013 hPa<br>
            Wiatr: 15 km/h, kierunek zachodni<br>
            Wilgotność: 65%<br>
            Wschód słońca: 6:12<br>
            Zachód słońca: 17:48
          </td>
        </tr>
      </table>
    `
  },

  ads: {
    title: "Ogłoszenia",
    html: `
      <table width="100%" bgcolor="#009900" cellpadding="6">
        <tr><td><font color="#FFFFFF" size="4"><b>📰 Ogłoszenia drobne</b></font></td></tr>
      </table>
      
      <p><a href="#" data-page="home">« Powrót do strony głównej</a></p>
      
      <h3>🏠 Nieruchomości</h3>
      <ul>
        <li><font size="2"><b>Kupię mieszkanie</b> ewentualnie zamiana z dopłatą. Minimum 60m2, centrum Piotrkowa. Jerzy Kaczmarczyk 44-643-2215 </font></li>
        <li><font size="2"><b>Wynajmę kawalerkę</b> Centrum, 30m², 300 zł/mies. + opłaty licznikowe, Agata Kupisz Tel: 44-649-7162</font></li>
      </ul>
      
      <h3>🚗 Motoryzacja</h3>
      <ul>
        <li><font size="2"><b>Sprzedam Fiat 126p</b> - 1995r., przebieg 80tys km, 4500 zł, Marian Kwolek Tel: 601-234-567</font></li>
        <li><font size="2"><b>Kupię Poloneza</b> - dowolny stan E.Mroziak Tel: 602-345-678</font></li>
      </ul>
      
      <h3>💼 Praca</h3>
      <ul>
        <li><font size="2"><b>Zatrudnię</b> Pracowników fizycznych do prac sezonowych, Tel: 44-567-8901</font></li>
        <li><font size="2"><b>Szukam pracy</b> - kierowca kat. C+E, doświadczenie 15 lat, Wacław Zgłobicki Tel: 44-456-7890</font></li>
        <li><font size="2"><b>Zatrudnię</b> Praca od ręki bez pośredników, Tel: 44-567-8901</font></li>
      </ul>
      
      <h3>🛋️ Różne</h3>
      <ul>
        <li><font size="2"><b>Zagubiono</b> dokumenty na nazwisko Masłyk, tel. 44-588-1221</font></li>
        <li><font size="2"><b>Oddam</b> ubrania dziecięce 3-6lat, Tel: 44-544-9876</font></li>
      </ul>
      
      <hr>
      
      <center>
        <font size="2">
          <b>Chcesz dodać ogłoszenie?</b><br>
          Wyślij tekst na adres: ogloszenia@piotrkow.pl<br>
          Koszt: 5 zł / tydzień
        </font>
      </center>
    `
  },

  events: {
    title: "Wydarzenia",
    html: `
      <table width="100%" bgcolor="#AA00AA" cellpadding="6">
        <tr><td><font color="#FFFFFF" size="4"><b>🎭 Co się dzieje w mieście?</b></font></td></tr>
      </table>
      
      <p><a href="#" data-page="home">« Powrót do strony głównej</a></p>
      
      <h3>📅 Wydarzenia tego tygodnia</h3>
      
      <table width="100%" border="1" cellpadding="6" cellspacing="0">
        <tr bgcolor="#EEEEFF">
          <td width="100"><b>Data</b></td>
          <td><b>Wydarzenie</b></td>
          <td width="100"><b>Miejsce</b></td>
        </tr>
        <tr>
          <td>07.11 (Sob)<br>19:00</td>
          <td><b>Koncert rockowy</b><br>Zespół "WalimyPoGarach"<br>Bilety: 5 zł</td>
          <td>Pub Rock</td>
        </tr>
        <tr bgcolor="#F5F5F5">
          <td>08.11 (Ndz)<br>15:00</td>
          <td><b>Mecz piłki nożnej</b><br>M KS Piotrków - KKS Sulejów </td>
          <td>Stadion Miejski</td>
        </tr>
        <tr>
          <td>14.11 (Sob)<br>18:00</td>
          <td><b>Projekcja filmu</b><br> Ogniem i Mieczem</td>
          <td>MDK wstęp wolny</td>
        </tr>
        <tr bgcolor="#F5F5F5">
          <td>15.11 (Ndz)<br>14:00</td>
          <td><b>Festiwal Piosenki</b><br> Występy zespołów regionalnych</td>
          <td>MDK wstęp wolny</td>
        </tr>
      </table>
      
      <br>
      
      <h3>🎨 Aktualny repertuar Kino MDK</h3>
      <p><font size="2">
        • <b>U Pana Boga za Piecem</b> Młoda Rosjanka zostaje okradziona po przekroczeniu polskiej granicy. By dochodzić swoich praw, zostaje w Królowym Moście - miejscowości, gdzie najwyższy autorytet stanowi ksiądz proboszcz.<br>
        • <b>Demony wojny wg Goi</b> Odział żołnierzy sił pokojowych, mimo zakazu dowództwa, rusza na pomoc załodze zestrzelonego w górach śmigłowca.<br>
        • <b>Złoto dezerterów</b> Kasiarze otrzymują zadanie zdobycia złota z nazistowskiego banku.<br>
      </font></p>
    `
  },

  contact: {
    title: "Kontakt",
    html: `
      <table width="100%" bgcolor="#FF6600" cellpadding="6">
        <tr><td><font color="#FFFFFF" size="4"><b>📞 Kontakt</b></font></td></tr>
      </table>
      
      <p><a href="#" data-page="home">« Powrót do strony głównej</a></p>
      
      <h3>Skontaktuj się z nami</h3>
      
      <table border="0" cellpadding="4">
        <tr>
          <td><b>Email:</b></td>
          <td>redakcja@piotrkow.pl</td>
        </tr>
        <tr>
          <td><b>Telefon:</b></td>
          <td>22-123-4567</td>
        </tr>
        <tr>
          <td><b>Adres:</b></td>
          <td>ul. Szewska 3<br>97-300 Piotrkow Trybunalski</td>
        </tr>
      </table>
      
      <br>
      
      <h3>Formularz kontaktowy</h3>
      <form>
        <table border="0" cellpadding="4">
          <tr>
            <td>Imię i nazwisko:</td>
            <td><input type="text" size="30"></td>
          </tr>
          <tr>
            <td>Email:</td>
            <td><input type="text" size="30"></td>
          </tr>
          <tr>
            <td valign="top">Wiadomość:</td>
            <td><textarea rows="6" cols="30"></textarea></td>
          </tr>
          <tr>
            <td></td>
            <!--<td><input type="submit" value="Wyślij wiadomość"></td>-->
          </tr>
        </table>
      </form>
      
      <br>
      
      <table width="100%" bgcolor="#FFFFCC" border="1" cellpadding="8">
        <tr>
          <td>
            <b>⏰ Godziny pracy redakcji:</b><br>
            Poniedziałek - Piątek: 9:00 - 17:00<br>
            Sobota: 10:00 - 14:00<br>
            Niedziela: nieczynne
          </td>
        </tr>
      </table>
    `
  }
};

/* =========================
   PUBLIC API
========================= */

export function openBrowser() {
  const win = createWindow(
    "Internet Explorer - Piotrkow.pl",
    renderPage("home"),
    700,
    520,

);

  bindLinks(win);
  const dateEl = win.querySelector("#current-date");
  if (dateEl) {
    dateEl.textContent = getPolishDateTime();
  }
  updateSidebarWeather(win);

}

/* =========================
   RENDER
========================= */

function renderPage(pageKey) {
  const page = PAGES[pageKey];

  if (!page) {
    return `
      <table width="100%" height="300" bgcolor="#FFFFFF">
        <tr>
          <td align="center" valign="middle">
            <h1><font color="#CC0000">404</font></h1>
            <p>Nie znaleziono strony</p>
            <p><a href="#" data-page="home">Powrót do strony głównej</a></p>
          </td>
        </tr>
      </table>
    `;
  }

  return `<div class="browser-page">${page.html}</div>`;
}






function getPolishDateTime() {
  const now = new Date();

  const days = [
    "Niedziela", "Poniedziałek", "Wtorek",
    "Środa", "Czwartek", "Piątek", "Sobota"
  ];

  const months = [
    "stycznia", "lutego", "marca", "kwietnia",
    "maja", "czerwca", "lipca", "sierpnia",
    "września", "października", "listopada", "grudnia"
  ];

  const dayName = days[now.getDay()];
  const day = now.getDate();
  const month = months[now.getMonth()];
  const year = now.getFullYear();

  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");

  return `${dayName}, ${day} ${month} ${year} | Godzina: ${hours}:${minutes}`;
}

/* =========================
   EVENTS
========================= */

function bindLinks(win) {
  win.addEventListener("click", e => {

    const articleLink = e.target.closest("a[data-article]");
    if (articleLink) {
      e.preventDefault();
      loadArticle(articleLink.dataset.article, win);
      return;
    }

    const pageLink = e.target.closest("a[data-page]");
    if (pageLink) {
      e.preventDefault();
      const key = pageLink.dataset.page;
      const content = win.querySelector(".content");

      if (key === "weather") {
        renderLiveWeather(content);
      } else {
        content.innerHTML = renderPage(key);
      }
    }

  });
}

async function renderLiveWeather(container) {
  container.innerHTML = `
    <p><font size="2">Pobieranie danych meteorologicznych...</font></p>
  `;

  try {
    const w = await fetchWeather();

    container.innerHTML = `
      <h2>Pogoda dla Piotrkowa</h2>
      <p><font size="2">Dane aktualne</font></p>

      <table width="100%" border="1" cellpadding="8">
        <tr bgcolor="#CCDDFF">
          <td><b>Temperatura</b></td>
          <td>${w.temp}°C</td>
        </tr>
        <tr>
          <td><b>Wiatr</b></td>
          <td>${w.wind} km/h</td>
        </tr>
        <tr bgcolor="#F0F0F0">
          <td><b>Pomiar</b></td>
          <td>${w.time}</td>
        </tr>
      </table>

      <p><font size="1" color="#777777">
        Źródło: serwis meteorologiczny (dane automatyczne)
      </font></p>
    `;
  } catch {
    container.innerHTML = `
      <p><font color="#CC0000">Błąd pobierania danych pogodowych.</font></p>
    `;
  }
}
async function loadArticle(articleId, win) {
  const article = ARTICLES.find(a => a.id === articleId);
  const content = win.querySelector(".content");

  if (!article) {
    content.innerHTML = "<p>Nie znaleziono artykułu.</p>";
    return;
  }

  content.innerHTML = "<p>Ładowanie artykułu...</p>";

  try {
    const res = await fetch(article.file);
    const html = await res.text();
    content.innerHTML = html;
  } catch {
    content.innerHTML = "<p>Błąd ładowania artykułu.</p>";
  }
}
function describeWeather(code) {
  if (code === 0) return "☀️ Słonecznie";
  if (code <= 3) return "⛅ Częściowe zachmurzenie";
  if (code <= 48) return "☁️ Pochmurno";
  if (code <= 67) return "🌧️ Deszcz";
  if (code <= 77) return "🌨️ Śnieg";
  if (code <= 99) return "⛈️ Burza";
  return "🌫️ Mgła";
}

async function updateSidebarWeather(win) {
  const tempEl = win.querySelector("#sidebar-temp");
  const descEl = win.querySelector("#sidebar-desc");

  if (!tempEl || !descEl) return;

  try {
    const w = await fetchWeather();

    tempEl.textContent = `${w.temp}°C`;
    descEl.textContent = describeWeather(w.code);

  } catch {
    descEl.textContent = "Brak danych";
  }
}


