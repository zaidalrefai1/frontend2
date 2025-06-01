class Player {
    constructor(x, y, image) {
      this.x = x;
      this.y = y;
      this.width = 40;
      this.height = 40;
      this.speed = 3;
      this.image = image;
    }
  
    move(keys) {
      if (keys['ArrowUp']) this.y -= this.speed;
      if (keys['ArrowDown']) this.y += this.speed;
      if (keys['ArrowLeft']) this.x -= this.speed;
      if (keys['ArrowRight']) this.x += this.speed;
    }
  
    draw(ctx) {
      ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
  
    getRect() {
      return { x: this.x, y: this.y, width: this.width, height: this.height };
    }
  }
  
  class Zone {
    constructor(x, y, width, height, targetScene) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.targetScene = targetScene;
    }
  
    draw(ctx, color) {
      ctx.fillStyle = color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  
    collidesWith(rect) {
      return rect.x < this.x + this.width &&
             rect.x + rect.width > this.x &&
             rect.y < this.y + this.height &&
             rect.y + rect.height > this.y;
    }
  }
  
  class Scene {
    constructor(name, bgImage) {
      this.name = name;
      this.bgImage = bgImage;
      this.zones = [];
    }
  
    addZone(zone) {
      this.zones.push(zone);
    }
  
    draw(ctx) {
      ctx.drawImage(this.bgImage, 0, 0, 800, 600);
      for (const zone of this.zones) {
        zone.draw(ctx, 'rgba(255,255,255,0.3)');
      }
    }
  
    checkTransitions(playerRect) {
      for (const zone of this.zones) {
        if (zone.collidesWith(playerRect)) {
          return zone.targetScene;
        }
      }
      return null;
    }
  }
  
  class Game {
    constructor(canvasId) {
      this.canvas = document.getElementById(canvasId);
      this.ctx = this.canvas.getContext('2d');
      this.keys = {};
      this.images = {};
      this.currentScene = null;
      this.player = null;
      this.scenes = {};
  
      window.addEventListener('keydown', (e) => this.keys[e.key] = true);
      window.addEventListener('keyup', (e) => this.keys[e.key] = false);
    }
  
    async loadImages(imageMap) {
      const promises = Object.entries(imageMap).map(([name, src]) => {
        return new Promise(resolve => {
          const img = new Image();
          img.src = src;
          img.onload = () => {
            this.images[name] = img;
            resolve();
          };
        });
      });
      await Promise.all(promises);
    }
  
    setupScenes() {
      const hub = new Scene('hub', this.images['hub']);
      hub.addZone(new Zone(700, 250, 80, 100, 'forest'));
      hub.addZone(new Zone(50, 500, 80, 100, 'lab'));
  
      const forest = new Scene('forest', this.images['forest']);
      forest.addZone(new Zone(700, 500, 80, 80, 'lab'));
  
      const lab = new Scene('lab', this.images['lab']);
      lab.addZone(new Zone(30, 30, 80, 80, 'hub'));
  
      this.scenes['hub'] = hub;
      this.scenes['forest'] = forest;
      this.scenes['lab'] = lab;
  
      this.currentScene = hub;
      this.player = new Player(100, 100, this.images['player']);
    }
  
    start() {
      const loop = () => {
        this.update();
        this.draw();
        requestAnimationFrame(loop);
      };
      loop();
    }
  
    update() {
      this.player.move(this.keys);
      const nextSceneName = this.currentScene.checkTransitions(this.player.getRect());
      if (nextSceneName && this.scenes[nextSceneName]) {
        this.currentScene = this.scenes[nextSceneName];
        this.player.x = 100;
        this.player.y = 100;
      }
    }
  
    draw() {
      this.currentScene.draw(this.ctx);
      this.player.draw(this.ctx);
    }
  
    async init() {
      await this.loadImages({
        hub: 'assets/hub.png',
        forest: 'assets/dna_forest.png',
        lab: 'assets/dna_lab.png',
        player: 'assets/player.png'
      });
      this.setupScenes();
      this.start();
    }
  }
  
  // Bootstrap the game
  const game = new Game('gameCanvas');
  game.init();
  