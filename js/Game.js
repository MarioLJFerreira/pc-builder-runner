import { Player } from "./Player.js";
export class Game {
  constructor() {
    this.gameContainer = document.querySelector(".game-container");
    this.startScreen = document.querySelector("#start-screen");
    this.gameScreen = document.querySelector("#game-screen");
    this.gameOverScreen = document.querySelector("#game-over-screen");
    this.winScreen = document.querySelector("#win-screen");
    this.gameArea = document.querySelector("#game-area");
    this.scoreDisplay = document.querySelector("#score");
    this.componentsCollectedDisplay = document.querySelector(
      "#components-collected"
    );
    this.collectedComponentsIcons = document.querySelector(
      "#collected-components-display"
    );
    this.player = null;
    this.obstacles = [];
    this.components = [];
    this.score = 0;
    this.gameSpeed = 5;
    this.isGameOver = false;
    this.isGameRunning = false;
    this.animationFrameId = null;
    this.requiredComponents = [
      "CPU",
      "GPU",
      "Motherboard",
      "RAM",
      "Storage",
      "Power Supply",
      "Case",
    ];
    this.collectedComponents = new Set();
    this.spawnedMilestoneComponents = new Set();

    // Bind event handlers
    document
      .querySelector("#start-button")
      .addEventListener("click", () => this.startGame());
    document
      .querySelector("#restart-button")
      .addEventListener("click", () => this.resetGame());
    document
      .querySelector("#win-restart-button")
      .addEventListener("click", () => this.resetGame());
    document.addEventListener("keydown", (event) => this.handleKeyDown(event));
  }

  init() {
    this.showScreen(this.startScreen);
    this.hideScreen(this.gameScreen);
    this.hideScreen(this.gameOverScreen);
    this.hideScreen(this.winScreen);
  }

  startGame() {
    this.resetGameState();
    this.showScreen(this.gameScreen);
    this.hideScreen(this.startScreen);
    this.hideScreen(this.gameOverScreen);
    this.hideScreen(this.winScreen);
    this.isGameRunning = true;
    this.isGameOver = false;
    this.player = new Player(this.gameArea);
    this.gameLoop();
  }

  gameLoop = (currentTime) => {
    if (!this.isGameRunning) {
      return;
    }
    this.player.update();
    this.animationFrameId = requestAnimationFrame(this.gameLoop);
  };

  handleKeyDown(event) {
    if (this.isGameRunning && event.code === "Space") {
      this.player.jump();
    }
  }
  spawnObstacle() {}
  spawnComponentsByScore() {}
  checkCollisions() {}
  isColliding(box1, box2) {
    return false;
  }
  collectComponent(component) {}
  updateCollectedComponentsDisplay() {}
  checkWinCondition() {}
  gameOver() {
    this.isGameRunning = false;
    this.isGameOver = true;
    cancelAnimationFrame(this.animationFrameId);
    this.showScreen(this.gameOverScreen);
    this.hideScreen(this.gameScreen);
    document.querySelector("#game-over-message").textContent =
      "You crashed your build!";
  }
  winGame() {
    this.isGameRunning = false;
    cancelAnimationFrame(this.animationFrameId);
    this.showScreen(this.winScreen);
    this.hideScreen(this.gameScreen);
  }
  resetGame() {
    this.obstacles.forEach((obstacle) => obstacle.remove());
    this.components.forEach((component) => component.remove());
    this.obstacles = [];
    this.components = [];
    if (this.player && this.player.playerElement) {
      this.player.playerElement.remove();
    }
    this.score = 0;
    this.collectedComponents.clear();
    this.spawnedMilestoneComponents.clear();
    this.isGameOver = false;
    this.isGameRunning = false;
    cancelAnimationFrame(this.animationFrameId);

    this.scoreDisplay.textContent = "0";
    this.componentsCollectedDisplay.textContent = "0/7";
    this.collectedComponentsIcons.innerHTML = "";
    this.startGame();
  }

  showScreen(screenElement) {
    screenElement.classList.add("active");
  }
  hideScreen(screenElement) {
    screenElement.classList.remove("active");
  }

  resetGameState() {
    this.obstacles.forEach((o) => o.remove());
    this.components.forEach((c) => c.remove());
    this.obstacles = [];
    this.components = [];

    if (this.player && this.player.playerElement) {
      this.player.playerElement.remove();
      this.player = null;
    }
    this.score = 0;
    this.collectedComponents.clear();
    this.spawnedMilestoneComponents.clear();
    this.lastObstacleSpawnTime = 0;
    this.lastComponentSpawnTime = 0;
    this.isGameOver = false;
    this.isGameRunning = false;
    this.scoreDisplay.textContent = "0";
    this.componentsCollectedDisplay.textContent = "0/7";
    this.collectedComponentsIcons.innerHTML = "";
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }
}
