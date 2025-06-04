class HubGame {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext("2d");

    this.mapImage = new Image();
    this.mapImage.src = "/assets/hub.png";

    this.playerImage = new Image();
    this.playerImage.src = "/assets/player.png";

    this.player = { x: 100, y: 100, speed: 4 };

    this.keys = {};
    window.addEventListener("keydown", (e) => this.keys[e.key] = true);
    window.addEventListener("keyup", (e) => this.keys[e.key] = false);

    this.mapImage.onload = () => {
      this.loop();
    };
  }

  update() {
    if (this.keys["ArrowUp"]) this.player.y -= this.player.speed;
    if (this.keys["ArrowDown"]) this.player.y += this.player.speed;
    if (this.keys["ArrowLeft"]) this.player.x -= this.player.speed;
    if (this.keys["ArrowRight"]) this.player.x += this.player.speed;

    // Scene switch (example)
    if (this.player.x > 750 && this.player.y < 100) {
      window.location.href = "/dna_forest/";
    } else if (this.player.x < 50 && this.player.y > 500) {
      window.location.href = "/dna_lab/";
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(this.mapImage, 0, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(this.playerImage, this.player.x, this.player.y, 50, 50);
  }

  loop() {
    this.update();
    this.draw();
    requestAnimationFrame(() => this.loop());
  }
}

window.onload = () => {
  new HubGame("hubCanvas");
};
