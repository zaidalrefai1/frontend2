class LabGame {
  constructor() {
      this.mapImage = new Image();
      this.playerImage = new Image();
      this.mapImage.src = "/frontend2/assets/dna_lab.png"; // Updated path
      this.playerImage.src = "/frontend2/assets/player.png"; // Updated path
  }

  start() {
      console.log("Starting DNA Lab...");
      // Game logic here
  }

  navigateToHub() {
      window.location.href = "/frontend2/hub/"; // Updated navigation
  }
}

const labGame = new LabGame();
labGame.start();