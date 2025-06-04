import { Character } from './Character.js';

class HubGame {
    constructor() {
        this.canvas = document.getElementById('hubCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.mapImage = new Image();
        this.mapImage.src = "/assets/game/hub_map.png";

        // Calculate center coordinates for player spawn
        const playerWidth = 32;
        const playerHeight = 32;
        const centerX = (this.canvas.width / 2) - (playerWidth / 2);
        const centerY = (this.canvas.height / 2) - (playerHeight / 2);

        // Spawn player at center of Hub
        this.player = new Character(
            "/assets/game/player.png",
            centerX, centerY, // Initial position X, Y (CENTERED)
            playerWidth, playerHeight
        );

        this.forestCollisionArea = {
            x: 100, y: 100, width: 150, height: 80
        };

        this.mapImage.onload = () => {
            this.draw();
        };
    }

    start() {
        console.log("Starting Hub...");
        this.gameLoop();
    }

    gameLoop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }

    update() {
        this.player.update();

        if (this.player.collidesWith(this.forestCollisionArea)) {
            console.log("Collision with DNA Forest area detected!");
            this.navigateToForest();
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        if (this.mapImage.complete) {
            this.ctx.drawImage(this.mapImage, 0, 0, this.canvas.width, this.canvas.height);
        }
        this.player.draw(this.ctx);
    }

    navigateToForest() {
        // Add a URL parameter to indicate where the player came from
        window.location.href = "/dna_forest/?from=hub";
    }
}

const hubGame = new HubGame();
hubGame.start();