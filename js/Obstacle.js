export class Obstacle {
    constructor(gameAreaElement, x, type = 'box') {
        this.gameArea = gameAreaElement;
        this.obstacleElement = document.createElement('div');
        this.obstacleElement.classList.add('obstacle');
        this.gameArea.appendChild(this.obstacleElement);
        this.x = x;
        this.y = 20; 
        this.width = 30;
        this.height = Math.random() * 40 + 40;
        this.speed = 5;
        this.obstacleElement.style.width = `${this.width}px`;
        this.obstacleElement.style.height = `${this.height}px`;
        this.obstacleElement.style.left = `${this.x}px`;
        this.obstacleElement.style.bottom = `${this.y}px`;
    }
    update() {
        this.x -= this.speed;
        this.obstacleElement.style.left = `${this.x}px`;
    }

    isOffScreen() {
        return this.x + this.width < 0;
    }

    remove() {
        this.obstacleElement.remove();
    }

    getBoundingBox() {
        const gameAreaHeight = this.gameArea.clientHeight;
        const topY = gameAreaHeight - this.y - this.height;

        return {
            x: this.x,
            y: topY,
            width: this.width,
            height: this.height
        };
    }
}