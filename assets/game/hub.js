class HubScene {
    constructor() {
      this.canvas = document.getElementById('hubCanvas');
      this.ctx = this.canvas.getContext('2d');
  
      this.mapImage = new Image();
      this.mapImage.src = '/frontend2/assets/hub.png';
  
      this.playerImage = new Image();
      this.playerImage.src = '/frontend2/assets/player.png';
  
      this.player = { x: 100, y: 100, width: 50, height: 50, speed: 5 };
  
      this.keys = {};
  
      this.initControls();
      this.gameLoop();
    }
  
    initControls() {
      document.addEventListener('keydown', e => this.keys[e.key] = true);
      document.addEventListener('keyup', e => this.keys[e.key] = false);
    }
  
    update() {
      if (this.keys['ArrowUp']) this.player.y -= this.player.speed;
      if (this.keys['ArrowDown']) this.player.y += this.player.speed;
      if (this.keys['ArrowLeft']) this.player.x -= this.player.speed;
      if (this.keys['ArrowRight']) this.player.x += this.player.speed;
  
      // Collision Zones
      if (this.player.x > 700 && this.player.y < 100) {
        window.location.href = '/frontend2/forest/';
      }
      if (this.player.x < 100 && this.player.y > 400) {
        window.location.href = '/frontend2/lab/';
      }
    }
  
    draw() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.drawImage(this.mapImage, 0, 0, this.canvas.width, this.canvas.height);
      this.ctx.drawImage(this.playerImage, this.player.x, this.player.y, this.player.width, this.player.height);
    }
  
    gameLoop() {
      this.update();
      this.draw();
      requestAnimationFrame(() => this.gameLoop());
    }
  }
  
  window.onload = () => new HubScene();
  