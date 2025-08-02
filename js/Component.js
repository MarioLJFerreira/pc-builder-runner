export class Component {
    constructor(gameAreaElement, x, type) {
        this.gameArea = gameAreaElement;
        this.componentElement = document.createElement('div');
        this.componentElement.classList.add('component');
        this.gameArea.appendChild(this.componentElement);

        this.x = x;
        this.y = 20;
        this.width = 50;
        this.height = 50;
        this.speed = 5;
        this.type = type;

        this.componentElement.style.width = `${this.width}px`;
        this.componentElement.style.height = `${this.height}px`;
        this.componentElement.style.left = `${this.x}px`;
        this.componentElement.style.bottom = `${this.y}px`;
        
        const img = document.createElement('img');
        img.src = `images/${type}.png`;
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'contain';
        this.componentElement.appendChild(img);

        this.isCollected = false;
    }

    update() {
        this.x -= this.speed;
        this.componentElement.style.left = `${this.x}px`;
    }

    isOffScreen() {
        return this.x + this.width < 0;
    }

    remove() {
        this.componentElement.remove();
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