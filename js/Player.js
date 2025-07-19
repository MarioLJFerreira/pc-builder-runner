export class Player {
  constructor(gameAreaElement) {
    this.gameArea = gameAreaElement;
    this.playerElement = document.querySelector("#player");
    this.width = 40;
    this.height = 80;
    this.baseBottom = 20;
    this.x = 50;
    this.y = this.baseBottom;
    this.velocityY = 0;
    this.gravity = 0.8;
    this.jumpStrength = 15;
    this.playerElement.style.width = `${this.width}px`;
    this.playerElement.style.height = `${this.height}px`;
    this.playerElement.style.left = `${this.x}px`;
    this.playerElement.style.bottom = `${this.y}px`;
  }
  update() {
    this.y += this.velocityY;
    this.velocityY -= this.gravity;
    if (this.y < this.baseBottom) {
      this.y = this.baseBottom;
      this.velocityY = 0;
    }

    this.playerElement.style.bottom = `${this.y}px`;
  }

  jump() {
    if (this.y === this.baseBottom) {
      this.velocityY = this.jumpStrength;
      this.playerElement.style.backgroundColor = "#7986cb";
      setTimeout(() => {
        this.playerElement.style.backgroundColor = "#3f51b5";
      }, 200);
    }
  }

  getBoundingBox() {
    const gameAreaHeight = this.gameArea.clientHeight;
    const topY = gameAreaHeight - this.y - this.height;

    return {
      x: this.x,
      y: topY,
      width: this.width,
      height: this.height,
    };
  }
}
