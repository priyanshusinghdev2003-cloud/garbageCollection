let isDragging = false;
let offsetX, offsetY, currentImg;
let score = 0;
let fallen = 0;
const maxFall = 35;
const maxScore = 20;
let container = document.querySelector(".container");
let dustbinImage = document.createElement("img");
let scoreBoard;
let resultCard;

function StartGame() {
  const mainDiv = document.querySelector(".main");
  mainDiv.classList.add("hidden");
  const gameDiv = document.querySelector(".game-display");
  gameDiv.classList.remove("hidden");
  dustbinImage.src = "images/dustbinOpen.png";
  dustbinImage.draggable = false;
  dustbinImage.classList.add("dustbin-image");
  gameDiv.appendChild(dustbinImage);
  scoreBoard = document.createElement("div");
  scoreBoard.classList.add("score-board");
  updateScore();
  gameDiv.appendChild(scoreBoard);
  resultCard = document.createElement("div");
  resultCard.classList.add("result-card");
  container.appendChild(resultCard);

  playGame();
}

function updateScore() {
  if (scoreBoard) scoreBoard.innerText = `Score: ${score} | Fallen: ${fallen}`;
}

function playGame() {
  const gameDiv = document.querySelector(".game-display");

  function spawnGarbage() {
    if (fallen >= maxFall || score >= maxScore) {
      endGame();
      return;
    }

    const img = document.createElement("img");
    img.src = `images/garbage${Math.floor(Math.random() * 4 + 1)}.png`;
    img.classList.add("garbage-image");
    img.style.top = "-100px";
    img.draggable = false;
    img.style.left = Math.random() * (window.innerWidth - 100) + "px";
    img.style.transition = "top 0.05s linear, left 0.05s linear";

    // 🖱️ Mouse drag start
    img.addEventListener("mousedown", function (e) {
      isDragging = true;
      currentImg = img;
      offsetX = e.clientX - img.offsetLeft;
      offsetY = e.clientY - img.offsetTop;
    });

    // 📱 Touch drag start
    img.addEventListener("touchstart", function (e) {
      isDragging = true;
      currentImg = img;
      let touch = e.touches[0];
      offsetX = touch.clientX - img.offsetLeft;
      offsetY = touch.clientY - img.offsetTop;
    });

    gameDiv.appendChild(img);

    let randomDelay = Math.floor(Math.random() * 40 + 25);
    let fallInterval = setInterval(() => {
      if (!isDragging || currentImg !== img) {
        let currentTop = parseFloat(img.style.top);
        currentTop += 5;
        img.style.top = currentTop + "px";

        if (currentTop > window.innerHeight) {
          clearInterval(fallInterval);
          img.remove();
          fallen++;
          updateScore();
          spawnGarbage();
        }
      }
    }, randomDelay);
  }

  for (let i = 0; i < 5; i++) spawnGarbage();
}

// 🖱️ Mouse move
document.addEventListener("mousemove", function (e) {
  if (!isDragging || !currentImg) return;
  dragImage(e.clientX, e.clientY);
});

// 📱 Touch move
document.addEventListener("touchmove", function (e) {
  if (!isDragging || !currentImg) return;
  let touch = e.touches[0];
  dragImage(touch.clientX, touch.clientY);
}, { passive: false });

// Common drag logic
function dragImage(clientX, clientY) {
  currentImg.style.left = clientX - offsetX + "px";
  currentImg.style.top = clientY - offsetY + "px";
  let dustbinRect = dustbinImage.getBoundingClientRect();
  let imgRect = currentImg.getBoundingClientRect();

  if (
    imgRect.right > dustbinRect.left &&
    imgRect.left < dustbinRect.right &&
    imgRect.bottom > dustbinRect.top &&
    imgRect.top < dustbinRect.bottom
  ) {
    dustbinImage.src = "images/dustbinClose.png";
    dustbinImage.style.transform = "translateX(-50%) scale(1.1)";

    if (!currentImg.caught) {
      currentImg.caught = true;
      score++;
      updateScore();
      const dustX =
        dustbinRect.left + dustbinRect.width / 2 - imgRect.width / 2;
      const dustY =
        dustbinRect.top + dustbinRect.height / 2 - imgRect.height / 2;

      currentImg.style.transition = "all 1s ease-in";
      currentImg.style.left = dustX + "px";
      currentImg.style.top = dustY + "px";
      currentImg.style.transform = "scale(0.2)";
      currentImg.style.opacity = "0";

      setTimeout(() => {
        currentImg.remove();
        playGame();
      }, 500);
    }
  } else {
    dustbinImage.src = "images/dustbinOpen.png";
    dustbinImage.style.transform = "translateX(-50%) scale(1)";
  }
}

// 🖱️ Mouse up
document.addEventListener("mouseup", function () {
  isDragging = false;
  currentImg = null;
});

// 📱 Touch end
document.addEventListener("touchend", function () {
  isDragging = false;
  currentImg = null;
});

function endGame() {
  let gameDiv = document.querySelector(".game-display");
  gameDiv.classList.add("hidden");
  let text =
    score >= maxScore
      ? `You Won! Score: ${score}`
      : `You Lost! Fallen garbage: ${fallen}`;
  let restartButton = document.createElement("button");
  restartButton.innerText = "Restart Game";
  restartButton.onclick = function () {
    window.location.reload();
  };
  restartButton.style.marginTop = "20px";
  restartButton.style.padding = "10px 20px";
  restartButton.style.fontSize = "16px";
  restartButton.style.cursor = "pointer";
  restartButton.style.backgroundColor = "#4CAF50";
  restartButton.style.color = "white";
  restartButton.style.border = "none";
  restartButton.style.borderRadius = "5px";
  restartButton.style.transition = "background-color 0.3s";
  let h1 = document.createElement("h1");
  h1.innerText = text;
  resultCard.appendChild(h1);
  resultCard.appendChild(restartButton);
  resultCard.style.display = "block";
  console.log(resultCard);
  document.querySelectorAll(".garbage-image").forEach((img) => img.remove());
  score = 0;
  fallen = 0;
  updateScore();
}
