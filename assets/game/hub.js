// assets/game/hub.js
import { Character } from './Character.js';

class HubGame {
    constructor() {
        this.canvas = document.getElementById('hubCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.mapImage = new Image();
        this.mapImage.src = "/assets/game/hub_map.png"; // Make sure you have this image

        const playerWidth = 48; // Increased player size
        const playerHeight = 48;
        const centerX = (this.canvas.width / 2) - (playerWidth / 2);
        const centerY = (this.canvas.height / 2) - (playerHeight / 2);

        // Spawn player at center of Hub
        this.player = new Character(
            "/assets/game/player.png", // Make sure you have this image
            centerX, centerY, // Initial position X, Y (CENTERED)
            playerWidth, playerHeight
        );

        // DNA Forest Collision Area (top-left, as defined before)
        this.forestCollisionArea = {
            x: 130, y: 100, width: 90, height: 100
        };

        // --- UPDATED: Vaccine Volcano Collision Area (top-right of canvas) ---
        this.vaccineVolcanoCollisionArea = {
            x: this.canvas.width - 110, // 800 - 100 (width) - 10 (padding from right)
            y: 10,                      // 10px padding from top
            width: 100,
            height: 100
        };
        // --- END UPDATED ---

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

        // Check collision with DNA Forest area
        if (this.player.collidesWith(this.forestCollisionArea)) {
            console.log("Collision with DNA Forest area detected!");
            this.navigateToForest();
        }

        // --- UPDATED: Check collision with Vaccine Volcano area ---
        if (this.player.collidesWith(this.vaccineVolcanoCollisionArea)) {
            console.log("Collision with Vaccine Volcano area detected!");
            this.navigateToVaccineVolcano();
        }
        // --- END UPDATED ---
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        if (this.mapImage.complete) {
            this.ctx.drawImage(this.mapImage, 0, 0, this.canvas.width, this.canvas.height);
        }
        this.player.draw(this.ctx);

        // --- Optional: Draw collision areas for debugging (helpful for testing placement) ---
        //this.ctx.strokeStyle = 'red';
        //this.ctx.lineWidth = 2;
        //this.ctx.strokeRect(this.forestCollisionArea.x, this.forestCollisionArea.y, this.forestCollisionArea.width, this.forestCollisionArea.height);
        //this.ctx.strokeRect(this.vaccineVolcanoCollisionArea.x, this.vaccineVolcanoCollisionArea.y, this.vaccineVolcanoCollisionArea.width, this.vaccineVolcanoCollisionArea.height);
        // --- End optional ---
    }

    navigateToForest() {
        window.location.href = "/dna_forest/?from=hub";
    }

    navigateToVaccineVolcano() {
        window.location.href = "/vaccine_volcano/?from=hub";
    }
}

// Ensure the HubGame is instantiated and started when the DOM is ready
document.addEventListener('DOMContentLoaded', (event) => {
    const hubGame = new HubGame();
    hubGame.start();
});