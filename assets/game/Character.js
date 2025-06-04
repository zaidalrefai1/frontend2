// assets/game/Character.js

export class Character {
    constructor(imageSrc, x, y, width, height) {
        this.image = new Image();
        this.image.src = imageSrc;

        this.x = x;
        this.y = y;

        // INCREASE PLAYER SIZE HERE
        this.width = width;  // Original default: 32. You can try 48, 64, or whatever looks good
        this.height = height; // Original default: 32. Match width for square
        // Example: this.width = 48; this.height = 48;

        // INCREASE MOVE SPEED HERE
        this.moveSpeed = 5; // Original default was 3. Try 5 or 6 for faster movement

        this.keys = {};

        // Add event listeners for key presses
        window.addEventListener('keydown', (e) => this.keys[e.key] = true);
        window.addEventListener('keyup', (e) => this.keys[e.key] = false);
    }

    update() {
        // Handle movement based on pressed keys
        if (this.keys['ArrowUp'] || this.keys['w']) {
            this.y -= this.moveSpeed;
        }
        if (this.keys['ArrowDown'] || this.keys['s']) {
            this.y += this.moveSpeed;
        }
        if (this.keys['ArrowLeft'] || this.keys['a']) {
            this.x -= this.moveSpeed;
        }
        if (this.keys['ArrowRight'] || this.keys['d']) {
            this.x += this.moveSpeed;
        }

        // Basic bounds checking (optional, to keep player within canvas)
        // You'll want to pass canvas dimensions to the Character or manage in game class
        // For now, let's assume a 800x600 canvas if not passed
        // This keeps the player within the canvas bounds.
        const canvasWidth = 800; // Assuming default canvas width
        const canvasHeight = 600; // Assuming default canvas height
        this.x = Math.max(0, Math.min(this.x, canvasWidth - this.width));
        this.y = Math.max(0, Math.min(this.y, canvasHeight - this.height));
    }

    draw(ctx) {
        if (this.image.complete) {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
    }

    // AABB (Axis-Aligned Bounding Box) collision detection
    collidesWith(rect) {
        return this.x < rect.x + rect.width &&
               this.x + this.width > rect.x &&
               this.y < rect.y + rect.height &&
               this.y + this.height > rect.y;
    }
}