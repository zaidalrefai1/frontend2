class StartGame {
    constructor() {
        this.startButton = document.getElementById('startGameButton');

        if (this.startButton) {
            this.startButton.addEventListener('click', () => this.startGame());
        } else {
            console.error("Start Game button not found!");
        }
    }

    startGame() {
        console.log("Starting game...");
        window.location.href = "/hub/"; // Navigate to the Hub page
    }
}

// Initialize the start game logic
const startGame = new StartGame();