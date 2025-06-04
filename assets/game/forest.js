class ForestGame {
  constructor() {
      this.mapImage = new Image();
      this.playerImage = new Image();
      this.mapImage.src = "/frontend2/assets/forest_map.png"; // Updated path
      this.playerImage.src = "/frontend2/assets/player.png"; // Updated path
  }

  start() {
      console.log("Starting DNA Forest...");
      // Game logic here
  }

  navigateToHub() {
      window.location.href = "/frontend2/hub/"; // Updated navigation
  }
}

const forestGame = new ForestGame();
forestGame.start();