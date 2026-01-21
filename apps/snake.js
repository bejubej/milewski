// /apps/snake.js

import { createWindow } from "../core/windowManager.js";

/* =========================
   PUBLIC
========================= */

export function openSnake() {
  const win = createWindow(
    "Snake",
    `<div class="snake-ui">
    <div class="snake-score">
      Score: <span id="snakeScore">0</span>
    </div>
    <canvas id="snakeCanvas" width="300" height="300"></canvas>
  </div>

     <div style="font-size:11px;margin-top:4px;">
       Sterowanie: strzałki
     </div>`,
    340,
    410
  );

  const canvas = win.querySelector("#snakeCanvas");
  const ctx = canvas.getContext("2d");

  startGame(ctx, canvas, win);
}

/* =========================
   GAME LOGIC
========================= */

function startGame(ctx, canvas, win) {
  const grid = 15;
  const size = canvas.width / grid;

  let snake = [{ x: 7, y: 7 }];
  let dir = { x: 1, y: 0 };
  let food = randomFood();
  let alive = true;
  let score=0;

  function randomFood() {
    return {
      x: Math.floor(Math.random() * grid),
      y: Math.floor(Math.random() * grid)
    };
  }

  function draw() {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "lime";
    snake.forEach(s =>
      ctx.fillRect(s.x * size, s.y * size, size - 1, size - 1)
    );

    ctx.fillStyle = "red";
    ctx.fillRect(food.x * size, food.y * size, size - 1, size - 1);
  }

  function update() {
    if (!alive) return;

    const head = {
      x: snake[0].x + dir.x,
      y: snake[0].y + dir.y
    };

    if (
      head.x < 0 || head.y < 0 ||
      head.x >= grid || head.y >= grid ||
      snake.some(s => s.x === head.x && s.y === head.y)
    ) {
      alive = false;
      gameOver();
      return;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
      score++;
      updateScore();
      food = randomFood();

      if (score === 30) {
        //stary system dla kompatybilnosci
        window.dispatchEvent(
          new CustomEvent("snake:unlock", {
            detail: { score }
          })
        );
      }
      // nowy system osiagniec
      import("../core/achievements.js").then(ach => {
        ach.recordScore("snake", score);
      });


    } else {
      snake.pop();
    }

    draw();
  }
    function updateScore() {
      const el = document.getElementById("snakeScore");
      if (el) el.textContent = score;
    }


  function gameOver() {
    ctx.fillStyle = "white";
    ctx.font = "14px Tahoma";
    ctx.fillText("Koniec gry", 95, 140);
    ctx.fillText("Naciśnij R", 90, 160);
  }

  function restart() {
    snake = [{ x: 7, y: 7 }];
    dir = { x: 1, y: 0 };
    food = randomFood();
    alive = true;
    score=0;
    updateScore();
  }

  /* =========================
     CONTROLS
  ========================= */

  function onKey(e) {
    if (!alive && e.key.toLowerCase() === "r") {
      restart();
      return;
    }

    switch (e.key) {
      case "ArrowUp":    if (dir.y === 0) dir = { x: 0, y: -1 }; break;
      case "ArrowDown":  if (dir.y === 0) dir = { x: 0, y: 1 }; break;
      case "ArrowLeft":  if (dir.x === 0) dir = { x: -1, y: 0 }; break;
      case "ArrowRight": if (dir.x === 0) dir = { x: 1, y: 0 }; break;
    }
  }

  document.addEventListener("keydown", onKey);

  const loop = setInterval(update, 120);

  /* =========================
     CLEANUP
  ========================= */

  const closeBtn = win.querySelector(".close");
  closeBtn.addEventListener("click", () => {
    clearInterval(loop);
    document.removeEventListener("keydown", onKey);
  });

  draw();
}

