class HubGame {
  constructor() {
      this.mapImage = new Image();
      this.playerImage = new Image();
      this.mapImage.src = "/frontend2/assets/hub_map.png"; // Updated path
      this.playerImage.src = "/frontend2/assets/player.png"; // Updated path
  }

  start() {
      console.log("Starting Hub...");
      // Game logic here
  }

  navigateToLab() {
      window.location.href = "/frontend2/dna_lab/"; // Updated navigation
  }

  navigateToForest() {
      window.location.href = "/frontend2/dna_forest/"; // Updated navigation
  }
}

const hubGame = new HubGame();
hubGame.start();