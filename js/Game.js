import { Player } from './Player.js';
import { Obstacle } from './Obstacle.js';
import { Component } from './Component.js';

export class Game {
    constructor() {
        this.gameContainer = document.querySelector('.game-container');
        this.startScreen = document.querySelector('#start-screen');
        this.gameScreen = document.querySelector('#game-screen');
        this.gameOverScreen = document.querySelector('#game-over-screen');
        this.winScreen = document.querySelector('#win-screen');
        this.gameArea = document.querySelector('#game-area');
        this.scoreDisplay = document.querySelector('#score');
        this.componentsCollectedDisplay = document.querySelector('#components-collected');
        this.collectedComponentsIcons = document.querySelector('#collected-components-display');

        this.player = null;
        this.obstacles = [];
        this.components = [];
        this.score = 0;
        this.gameSpeed = 5;
        this.isGameOver = false;
        this.isGameRunning = false;
        this.animationFrameId = null;

        this.requiredComponents = ['CPU', 'GPU', 'Motherboard', 'RAM', 'Storage', 'Power Supply', 'Case'];
        this.collectedComponents = new Set();
        
        this.obstacleSpawnInterval = 1500;
        this.componentSpawnInterval = 5000;
        this.lastObstacleSpawnTime = 0;
        this.lastComponentSpawnTime = 0;
        this.minDistanceBetweenObstacles = 300;
        this.minDistanceBetweenComponents = 400;

        this.componentMilestones = {
            'CPU': 500,
            'GPU': 1500,
            'Motherboard': 2500,
            'RAM': 3500,
            'Storage': 4500,
            'Power Supply': 5500,
            'Case': 6500
        };
        this.spawnedMilestoneComponents = new Set();

        document.querySelector('#start-button').addEventListener('click', () => this.startGame());
        document.querySelector('#restart-button').addEventListener('click', () => this.resetGame());
        document.querySelector('#win-restart-button').addEventListener('click', () => this.resetGame());
        document.addEventListener('keydown', (event) => this.handleKeyDown(event));
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
        
        this.obstacles.forEach(obstacle => obstacle.update());
        this.obstacles = this.obstacles.filter(obstacle => {
            if (obstacle.isOffScreen()) {
                obstacle.remove();
                return false;
            }
            return true;
        });
        
        this.components.forEach(component => component.update());
        this.components = this.components.filter(component => {
            if (component.isOffScreen()) {
                component.remove();
                return false;
            }
            return true;
        });

        if (currentTime - this.lastObstacleSpawnTime > this.obstacleSpawnInterval) {
            this.spawnObstacle();
            this.lastObstacleSpawnTime = currentTime;
        }
        
        this.spawnComponentsByScore();
        this.checkCollisions();
        this.score += 1;
        this.scoreDisplay.textContent = Math.floor(this.score);
        this.checkWinCondition();
        this.animationFrameId = requestAnimationFrame(this.gameLoop);
    }

    handleKeyDown(event) {
        if (this.isGameRunning && event.code === 'Space') {
            this.player.jump();
        }
    }
    
    spawnObstacle() {
        const lastObstacleX = this.obstacles.length > 0 ? this.obstacles[this.obstacles.length - 1].x : 0;
        const gameAreaWidth = this.gameArea.clientWidth;

        if (gameAreaWidth - lastObstacleX > this.minDistanceBetweenObstacles || this.obstacles.length === 0) {
            const newObstacle = new Obstacle(this.gameArea, gameAreaWidth);
            newObstacle.speed = this.gameSpeed;
            this.obstacles.push(newObstacle);
        }
    }

    spawnComponentsByScore() {
        const gameAreaWidth = this.gameArea.clientWidth;
        
        for (const type of this.requiredComponents) {
            const milestone = this.componentMilestones[type];
            if (milestone && this.score >= milestone && !this.spawnedMilestoneComponents.has(type)) {
                const lastComponentX = this.components.length > 0 ? this.components[this.components.length - 1].x : 0;
                if (gameAreaWidth - lastComponentX > this.minDistanceBetweenComponents || this.components.length === 0) {
                    if (!this.collectedComponents.has(type)) {
                        const newComponent = new Component(this.gameArea, gameAreaWidth, type);
                        newComponent.speed = this.gameSpeed;
                        this.components.push(newComponent);
                        this.spawnedMilestoneComponents.add(type);
                        break;
                    }
                }
            }
        }
    }

    checkCollisions() {
        const playerBox = this.player.getBoundingBox();

        for (let i = this.obstacles.length - 1; i >= 0; i--) {
            const obstacle = this.obstacles[i];
            const obstacleBox = obstacle.getBoundingBox();
            if (this.isColliding(playerBox, obstacleBox)) {
                this.gameOver();
                return;
            }
        }

        for (let i = this.components.length - 1; i >= 0; i--) {
            const component = this.components[i];
            const componentBox = component.getBoundingBox();
            if (this.isColliding(playerBox, componentBox) && !component.isCollected) {
                this.collectComponent(component);
            }
        }
    }

    isColliding(box1, box2) {
        return box1.x < box2.x + box2.width &&
               box1.x + box1.width > box2.x &&
               box1.y < box2.y + box2.height &&
               box1.y + box1.height > box2.y;
    }

    collectComponent(component) {
        if (component.isCollected) return;

        this.collectedComponents.add(component.type);
        component.isCollected = true;
        component.remove();
        this.components = this.components.filter(c => c !== component);

        this.updateCollectedComponentsDisplay();
        this.componentsCollectedDisplay.textContent = `${this.collectedComponents.size}/7`;
    }
    
    updateCollectedComponentsDisplay() {
        this.collectedComponentsIcons.innerHTML = '';
        this.collectedComponents.forEach(type => {
            const iconDiv = document.createElement('div');
            iconDiv.classList.add('collected-component-icon');
            iconDiv.textContent = type; 
            this.collectedComponentsIcons.appendChild(iconDiv);
        });
    }
    
    checkWinCondition() {
        if (this.collectedComponents.size === this.requiredComponents.length) {
            this.winGame();
        }
    }
    
    gameOver() {
        this.isGameRunning = false;
        this.isGameOver = true;
        cancelAnimationFrame(this.animationFrameId);
        this.showScreen(this.gameOverScreen);
        this.hideScreen(this.gameScreen);
        document.querySelector('#game-over-message').textContent = "You crashed your build!";
    }

    winGame() {
        this.isGameRunning = false;
        this.isGameOver = false;
        cancelAnimationFrame(this.animationFrameId);
        this.showScreen(this.winScreen);
        this.hideScreen(this.gameScreen);
    }

    resetGame() {
        this.obstacles.forEach(obstacle => obstacle.remove());
        this.components.forEach(component => component.remove());
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

        this.scoreDisplay.textContent = '0';
        this.componentsCollectedDisplay.textContent = '0/7';
        this.collectedComponentsIcons.innerHTML = '';

        this.recreatePlayerElement();
        this.startGame();
    }
    
    showScreen(screenElement) {
        screenElement.classList.add('active');
    }

    hideScreen(screenElement) {
        screenElement.classList.remove('active');
    }

    recreatePlayerElement() {
        const gameArea = document.querySelector('#game-area');
        const existingPlayer = document.querySelector('#player');
        if (existingPlayer) {
            existingPlayer.remove();
        }
        const playerElement = document.createElement('div');
        playerElement.id = 'player';
        gameArea.appendChild(playerElement);
    }

    resetGameState() {
        this.obstacles.forEach(o => o.remove());
        this.components.forEach(c => c.remove());
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

        this.scoreDisplay.textContent = '0';
        this.componentsCollectedDisplay.textContent = '0/7';
        this.collectedComponentsIcons.innerHTML = '';

        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }
}