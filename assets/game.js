class Game {
  constructor(canvasId) {
      this.canvas = document.getElementById(canvasId);
      this.context = this.canvas.getContext('2d');
      this.mapImage = new Image();
      this.playerImage = new Image();
      this.labImage = new Image();
      this.forestImage = new Image();
      this.playerX = 100;
      this.playerY = 100;
      this.speed = 5;
      this.keys = {};

      this.loadAssets();
      this.setupListeners();
  }

  loadAssets() {
      this.mapImage.src = '/assets/hub.png';
      this.playerImage.src = '/assets/player.png';
      this.labImage.src = '/assets/dna_lab.png';
      this.forestImage.src = '/assets/dna_forest.png';

      this.mapImage.onload = () => this.gameLoop();
  }

  setupListeners() {
      window.addEventListener('keydown', (e) => {
          this.keys[e.key] = true;
      });
      window.addEventListener('keyup', (e) => {
          this.keys[e.key] = false;
      });
  }

  update() {
      if (this.keys['ArrowUp']) this.playerY -= this.speed;
      if (this.keys['ArrowDown']) this.playerY += this.speed;
      if (this.keys['ArrowLeft']) this.playerX -= this.speed;
      if (this.keys['ArrowRight']) this.playerX += this.speed;
  }

  draw() {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.context.drawImage(this.mapImage, 0, 0, this.canvas.width, this.canvas.height);
      this.context.drawImage(this.playerImage, this.playerX, this.playerY, 50, 50);
  }

  gameLoop() {
      this.update();
      this.draw();
      requestAnimationFrame(() => this.gameLoop());
  }
}

window.onload = () => {
  const game = new Game('gameCanvas');
};
