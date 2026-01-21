// /data/filesystemData.js

export const FILESYSTEM = {
  type: "folder",
  name: "ROOT",
  children: [
    /* ===== DESKTOP ===== */
    {
      type: "desktop",
      name: "Pulpit",
      children: [
        {
          type: "app",
          app: "computer",
          name: "Mój Komputer",
          icon: "assets/icons/computer.png" // opcjonalna własna ikona
        },

        {
          type: "txt",
          name: "Akta_sprawy.txt",
          readOnly: true,
          src: "assets/texts/1.txt"
        },

        {
          type: "app",
          app: "mail",
          name: "Poczta",
          icon: "assets/icons/mail.png"
        },

        {
          type: "app",
          app: "browser",
          name: "Internet",
          icon: "assets/icons/browser.png"
        },

        {
          type: "app",
          app: "snake",
          name: "Snake.exe",
          icon: "assets/icons/application.png"
        },
/* nagrania audio */
        {
          type: "folder",
          name: "muzyka nowosci",
          children: [
            {
              type: "mp3",
              name: "muzyka1.mp3",
              youtube: "https://www.youtube.com/watch?v=_4_p3FM88jA",
              icon: "assets/icons/music.png"
            },
            {
              type: "mp3",
              name: "2.mp3",
              youtube: "https://www.youtube.com/watch?v=UAaW1BUSPP8",
              icon: "assets/icons/music.png"
            },
            {
              type: "mp3",
              name: "3.mp3",
              youtube: "https://www.youtube.com/watch?v=qyoFl1ux2z8",
              icon: "assets/icons/music.png"
            },
            {
              type: "mp3",
              name: "04.mp3",
              youtube: "https://www.youtube.com/watch?v=WQnAxOQxQIU",
              icon: "assets/icons/music.png"
            },
            {
              type: "mp3",
              name: "5.mp3",
              youtube: "https://www.youtube.com/watch?v=taOL5HJdx1A",
              icon: "assets/icons/music.png"
            },
            {
              type: "mp3",
              name: "nagranie_02.mp3",
              src: "assets/audio/acdc.mp3",
              icon: "assets/icons/music.png"
            }
          ]
        },
        {
          type: "folder",
          name: "porzadkowe",
          children:[
            {
              type: "txt",
              name: "Instrukcja BHP KWP.txt",
              readOnly: true,
              src: "assets/texts/instrukcja_bhp_kwp.txt"
            },
            {
              type: "txt",
              name: "Instrukcja obiegu dokumentów.txt",
              readOnly: true,
              src: "assets/texts/instrukcja_obiegu_dokumentow.txt"
            },
            {
              type: "txt",
              name: "procedura zabezpieczania dowodow.txt",
              readOnly: true,
              src: "assets/texts/Procedura_zabezpieczania_dowodow.txt"
            },
            {
              type: "txt",
              name: "archiwizacja.txt",
              readOnly: true,
              src: "assets/texts/zarzadzanie_archiwizacja.txt"
            },
            {
              type: "txt",
              name: "telefony.txt",
              readOnly: true,
              src: "assets/texts/wykaz_telefonow.txt"
            }
          ]
        },
        /* zdjecia*/
        {
          type: "folder",
          name: "Zdjęcia moje",
          children: [
            {
              type: "image",
              name: "1.jpg",
              src: "assets/images/1.png",
              icon: "assets/icons/image.png"
            },
            {
              type: "image",
              name: "2.jpg",
              src: "assets/images/2.png",
              icon: "assets/icons/image.png"
            },
            {
              type: "image",
              name: "3.jpg",
              src: "assets/images/3.png",
              icon: "assets/icons/image.png"
            },
            {
              type: "image",
              name: "4.jpg",
              src: "assets/images/4.png",
              icon: "assets/icons/image.png"
            },
            {
              type: "image",
              name: "5.jpg",
              src: "assets/images/6.jpg",
              icon: "assets/icons/image.png"
            },
            {
              type: "image",
              name: "6.jpg",
              src: "assets/images/6a.jpg",
              icon: "assets/icons/image.png"
            },
            {
              type: "image",
              name: "7",
              src: "assets/images/6b.jpg",
              icon: "assets/icons/image.png"
            }
          ]
        },
/* dokumenty txt */
        {
          type: "folder",
          name: "Dokumenty",
          children: [
            {
              type: "txt",
              name: "komunikat_.txt",
              readOnly: true,
              src: "assets/texts/komunikat_wew.txt"
            },
            {
              type: "txt",
              name: "kpk.txt",
              readOnly: true,
              src: "assets/texts/kpk.txt"
            }
          ]
        },

        {
          type: "folder",
          name: "Archiwum",
          children: [
            {
              type: "txt",
              name: "stare1.txt",
              readOnly: true,
              src: "assets/texts/stare.txt"
            },
            {
              type: "txt",
              name: "stare2.txt",
              readOnly: true,
              src: "assets/texts/stare2.txt"
            },
            {
              type: "txt",
              name: "notatkastare.txt",
              readOnly: true,
              src: "assets/texts/notatka_sluzbowa_przeglad_akt.txt"
            }

          ]
        },
/* dane csv */
        {
          type: "folder",
          name: "Bazy danych",
          children: [
            {
              type: "csv",
              name: "1.csv",
              src: "assets/data/1.csv",
              readOnly: true
            },
            {
              type: "csv",
              name: "zaginieni.csv",
              src: "assets/data/baza97.csv",
              readOnly: true
            }
          ]
        },
        {
          type: "folder",
          name: "wolskipiotrkow",
          children: [
            {
              type: "txt",
              name: "korespondencjaKPPpiotrkowKOpia.txt",
              src: "assets/texts/kpp_piotrkow_kopia.txt",
              readOnly: true
            },
            {
              type: "txt",
              name: "korespondencjaPROKPiotrkowKOPIA.txt",
              src: "assets/texts/korespondencja_z_prok_piotrkow_kopia.txt",
              readOnly: true
            },
            {
              type: "txt",
              name: "odpowiedzKPPpiotrkow.txt",
              src: "assets/texts/odpowiedz_piotrkow_policja.txt",
              readOnly: true
            },
            {
              type: "txt",
              name: "zgloszenieKOPIA.txt",
              src: "assets/texts/zgloszenie_zaginiecia_kopia.txt",
              readOnly: true
            },
            {
              type: "txt",
              name: "wykazszczegolowy.txt",
              src: "assets/texts/wykaz.html",
              readOnly: true,
              window: {
                fullscreen: true
              }
            },
            {
              type: "txt",
              name: "wykazbeneficjentow.txt",
              src: "assets/texts/rejestr_beneficjentow_piotrkowskie.html",
              readOnly: true,
              window: {
                fullscreen: true
              }
            }



          ]
        },


        {
          type: "link",
          name: "Tablica Śledztwa",
          //url: "https://bejubej.github.io/pulpit/detective_board_timer.html",  // ← TUTAJ WPISZ SWÓJ URL
          url: "detective_board_timer.html",
          icon: "assets/icons/link.png"   // opcjonalna ikona
        },

        {
          type: "app",
          app: "cipher",
          name: "Lamacz Szyfrow",
          icon: "assets/icons/cipher.png"
        },

        {
          type: "app",
          app: "sudoku",
          name: "Sudoku",
          icon: "assets/icons/sudoku.png"
        },

        /*{
          type: "app",
          app: "mastermind",
          name: "Mastermind",
          icon: "assets/icons/mastermind.png"
        },

        {
          type: "app",
          app: "stats",
          name: "Statystyki",
          icon: "assets/icons/stats.png"
        },
*/
        {
          type: "trash",
          name: "Kosz",
          items: []
        }
      ]
    }
  ]
};
