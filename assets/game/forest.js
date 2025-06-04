import { Character } from './Character.js';

class ForestGame {
    constructor() {
        this.canvas = document.getElementById('forestCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.mapImage = new Image();
        this.mapImage.src = "/assets/game/dna_forest.png";

        const playerWidth = 32;
        const playerHeight = 32;
        let initialPlayerX = 50; // Default spawn
        let initialPlayerY = 50; // Default spawn

        // Check URL parameters for spawn location
        const urlParams = new URLSearchParams(window.location.search);
        const fromPage = urlParams.get('from');

        if (fromPage === 'hub') {
            console.log("Spawning from Hub: Bottom-center of DNA Forest.");
            initialPlayerX = (this.canvas.width / 2) - (playerWidth / 2); // Center X
            initialPlayerY = this.canvas.height - playerHeight - 20; // Bottom Y, with 20px margin from bottom
        } else {
            console.log("Spawning at default position in DNA Forest (direct access or unknown origin).");
            // You can add other conditions here for different spawn points
        }

        this.player = new Character(
            "/assets/game/player.png",
            initialPlayerX, initialPlayerY, // Initial position X, Y (DYNAMICALLY SET)
            playerWidth, playerHeight
        );

        this.labCollisionArea = {
            x: 300, y: 400, width: 100, height: 100
        };

        this.backButton = document.getElementById('backToHubButton');
        if (this.backButton) {
            this.backButton.addEventListener('click', () => this.navigateToHub());
        }

        this.mapImage.onload = () => {
            this.draw();
        };
    }

    start() {
        console.log("Starting DNA Forest...");
        this.gameLoop();
    }

    gameLoop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }

    update() {
        this.player.update();

        if (this.player.collidesWith(this.labCollisionArea)) {
            console.log("Collision with DNA Lab area detected!");
            this.navigateToLab();
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        if (this.mapImage.complete) {
            this.ctx.drawImage(this.mapImage, 0, 0, this.canvas.width, this.canvas.height);
        }
        this.player.draw(this.ctx);
    }

    navigateToHub() {
        window.location.href = "/hub/";
    }

    navigateToLab() {
        window.location.href = "/dna_lab/";
    }
}

const forestGame = new ForestGame();
forestGame.start();