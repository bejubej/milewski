import { createWindow } from "../core/windowManager.js";

/* =========================
   STATE
========================= */

let board = [];
let solution = [];
let initialBoard = [];
let selectedCell = null;
let mistakes = 0;
let startTime = null;
let timerInterval = null;

/* =========================
   PUBLIC API
========================= */

export function openSudoku() {
  startNewGame("easy");
}

function startNewGame(difficulty = "easy") {
  solution = generateSudoku();
  board = JSON.parse(JSON.stringify(solution));

  const cellsToRemove = { easy: 35, medium: 45, hard: 55 }[difficulty];
  removeNumbers(board, cellsToRemove);
  initialBoard = JSON.parse(JSON.stringify(board));

  selectedCell = null;
  mistakes = 0;
  startTime = Date.now();

  const html = renderGame();

  const win = createWindow("Sudoku", html, 520, 580);
  win.dataset.difficulty = difficulty;

  bindEvents(win);
  startTimer(win);
}

/* =========================
   GENERATOR SUDOKU
========================= */

function generateSudoku() {
  const grid = Array(9).fill(0).map(() => Array(9).fill(0));
  fillGrid(grid);
  return grid;
}

function fillGrid(grid) {
  const numbers = [1,2,3,4,5,6,7,8,9];
  for (let row=0; row<9; row++) {
    for (let col=0; col<9; col++) {
      if (grid[row][col]===0) {
        shuffle(numbers);
        for (const num of numbers) {
          if (isValid(grid,row,col,num)) {
            grid[row][col]=num;
            if (fillGrid(grid)) return true;
            grid[row][col]=0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

function isValid(grid,row,col,num) {
  for(let x=0;x<9;x++)
    if(grid[row][x]===num || grid[x][col]===num) return false;

  const startRow=Math.floor(row/3)*3;
  const startCol=Math.floor(col/3)*3;
  for(let i=0;i<3;i++)
    for(let j=0;j<3;j++)
      if(grid[startRow+i][startCol+j]===num) return false;

  return true;
}

function removeNumbers(grid,count) {
  let removed=0;
  while(removed<count) {
    const row=Math.floor(Math.random()*9);
    const col=Math.floor(Math.random()*9);
    if(grid[row][col]!==0) {
      grid[row][col]=0;
      removed++;
    }
  }
}

function shuffle(array) {
  for(let i=array.length-1;i>0;i--) {
    const j=Math.floor(Math.random()*(i+1));
    [array[i],array[j]]=[array[j],array[i]];
  }
}

/* =========================
   RENDER
========================= */

function renderGame() {
  return `
    <div class="sudoku-game" style="padding:12px;background:#c0c0c0;font-family:Arial;">
      
      <div style="background:#000080;color:#fff;padding:8px;text-align:center;font-weight:bold;margin-bottom:12px;">
        🔢 SUDOKU
      </div>
      
      <div style="display:flex;gap:8px;margin-bottom:12px;">
        <div style="flex:1;background:#fff;border:2px inset;padding:6px;font-size:11px;">
          <b>Czas:</b> <span id="timer">00:00</span>
        </div>
        <div style="flex:1;background:#fff;border:2px inset;padding:6px;font-size:11px;">
          <b>Błędy:</b> <span id="mistakes">0</span>/3
        </div>
      </div>

      <div id="sudokuBoard" style="display:inline-block;background:#000;border:3px solid #000;">
        ${renderBoard()}
      </div>
      
      <div style="display:flex;gap:8px;margin-top:12px;">
        <button id="clearBtn" style="flex:1;padding:8px;background:#ff6666;color:#fff;font-weight:bold;border:2px outset;cursor:pointer;">
          ✕ WYCZYŚĆ
        </button>
        <button id="checkBtn" style="flex:1;padding:8px;background:#66ff66;color:#000;font-weight:bold;border:2px outset;cursor:pointer;">
          ✓ SPRAWDŹ
        </button>
      </div>

      <div style="margin-top:12px;text-align:center;">
        <span style="font-size:11px;margin-right:8px;">Nowa gra:</span>
        <button class="diff-btn" data-diff="easy" style="padding:4px 12px;background:#90ee90;border:2px outset;cursor:pointer;font-size:11px;">Łatwa</button>
        <button class="diff-btn" data-diff="medium" style="padding:4px 12px;background:#ffd700;border:2px outset;cursor:pointer;font-size:11px;">Średnia</button>
        <button class="diff-btn" data-diff="hard" style="padding:4px 12px;background:#ff6666;border:2px outset;cursor:pointer;font-size:11px;">Trudna</button>
      </div>

      <div id="statusBox" style="background:#ffffcc;border:2px solid #808080;padding:8px;margin-top:12px;font-size:11px;text-align:center;">
        Wybierz pole i wpisz liczbę 1-9
      </div>

    </div>
  `;
}

function renderBoard() {
  let html='';
  for(let row=0;row<9;row++) {
    for(let col=0;col<9;col++) {
      const value=board[row][col];
      const isInitial=initialBoard[row][col]!==0;
      const isWrong=value!==0 && value!==solution[row][col];

      const borderRight=(col+1)%3===0 && col!==8?'3px solid #000':'1px solid #808080';
      const borderBottom=(row+1)%3===0 && row!==8?'3px solid #000':'1px solid #808080';

      html+=`
        <div class="sudoku-cell ${isInitial?'initial':''}" 
             data-row="${row}" data-col="${col}"
             style="
               display:inline-block;
               width:35px;
               height:35px;
               line-height:35px;
               font-size:16px;
               font-weight:${isInitial?'bold':'normal'};
               background:${isInitial?'#e0e0e0':'#fff'};
               color:${isWrong?'#ff0000':(isInitial?'#000':'#0000ff')};
               text-align:center;
               border-right:${borderRight};
               border-bottom:${borderBottom};
               cursor:${isInitial?'not-allowed':'pointer'};
               vertical-align:top;
             ">
          ${value||''}
        </div>
      `;
      if((col+1)%9===0) html+='<br>';
    }
  }
  return html;
}

/* =========================
   EVENTS
========================= */

function bindEvents(win) {
  const boardDiv=win.querySelector("#sudokuBoard");
  const clearBtn=win.querySelector("#clearBtn");
  const checkBtn=win.querySelector("#checkBtn");
  const diffBtns=win.querySelectorAll(".diff-btn");
  const statusBox=win.querySelector("#statusBox");
  const mistakesSpan=win.querySelector("#mistakes");

  boardDiv.addEventListener("click",(e)=>{
    const cell=e.target.closest(".sudoku-cell");
    if(!cell||cell.classList.contains("initial")) return;

    win.querySelectorAll(".sudoku-cell").forEach(c=>{
      c.style.background=c.classList.contains("initial")?"#e0e0e0":"#fff";
    });

    cell.style.background="#ffff99";
    selectedCell={row:parseInt(cell.dataset.row),col:parseInt(cell.dataset.col)};
    statusBox.textContent=`Wybrano pole [${selectedCell.row+1}, ${selectedCell.col+1}]`;
  });

  document.addEventListener("keydown",(e)=>{
    if(!selectedCell || !win.parentElement) return;

    if(e.key>="1" && e.key<="9") {
      const num=parseInt(e.key);
      board[selectedCell.row][selectedCell.col]=num;

      // Sprawdzenie błędu
      if(solution[selectedCell.row][selectedCell.col]!==num) {
        mistakes++;
        mistakesSpan.textContent=mistakes;
        if(mistakes>=3) {
          gameOver(win,false);
          return;
        }
      }

      updateBoard(win);

      if(isComplete()) gameOver(win,true);
    }
  });

  clearBtn.addEventListener("click",()=>{
    if(!selectedCell) return;
    board[selectedCell.row][selectedCell.col]=0;
    updateBoard(win);
  });

  checkBtn.addEventListener("click",()=>{
    if(isComplete()) gameOver(win,true);
    else statusBox.textContent="Niektóre pola są puste lub błędne!";
  });

  diffBtns.forEach(btn=>{
    btn.addEventListener("click",()=>{
      if(timerInterval) clearInterval(timerInterval);
      win.remove();
      startNewGame(btn.dataset.diff);
    });
  });
}

/* =========================
   HELPERS
========================= */

function updateBoard(win) {
  const boardDiv=win.querySelector("#sudokuBoard");
  boardDiv.innerHTML=renderBoard();
}

function isComplete() {
  for(let row=0;row<9;row++)
    for(let col=0;col<9;col++)
      if(board[row][col]!==solution[row][col]) return false;
  return true;
}

function startTimer(win) {
  const timerSpan=win.querySelector("#timer");
  timerInterval=setInterval(()=>{
    if(!win.parentElement){ clearInterval(timerInterval); return; }
    const elapsed=Math.floor((Date.now()-startTime)/1000);
    const minutes=Math.floor(elapsed/60);
    const seconds=elapsed%60;
    timerSpan.textContent=`${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}`;
  },1000);
}

function gameOver(win,won) {
  if(timerInterval) clearInterval(timerInterval);
  const statusBox=win.querySelector("#statusBox");
  const elapsed=Math.floor((Date.now()-startTime)/1000);
  const minutes=Math.floor(elapsed/60);
  const seconds=elapsed%60;

  if(won) {
    statusBox.innerHTML=`
      <div style="color:#00aa00;font-weight:bold;font-size:14px;">
       GRATULACJE! Sudoku rozwiązane!
      </div>
      <div style="margin-top:4px;">
        Czas: ${minutes}:${String(seconds).padStart(2,'0')}
      </div>
    `;
//WIADOMOSC
    if(elapsed<=300) {
      statusBox.innerHTML+=`
        <div style="margin-top:4px;color:#0000cc;font-weight:bold;">
          Sekretna wiadomość: szyfrowanie: cezar9 -> atbash -> odwrocony
        </div>
      `;
    }

  } else {
    statusBox.innerHTML=`
      <div style="color:#cc0000;font-weight:bold;font-size:14px;">
        Koniec gry! Za dużo błędów (3/3)
      </div>
      <div style="margin-top:4px;">
        Spróbuj ponownie - wybierz trudność poniżej
      </div>
    `;
  }
}
