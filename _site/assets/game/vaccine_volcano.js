// assets/game/vaccine_volcano.js

class VaccineVolcanoGame {
    constructor() {
        this.canvas = document.getElementById('vaccineVolcanoCanvas');
        this.ctx = this.canvas.getContext('2d');

        this.canvas.width = 800;
        this.canvas.height = 600;

        // --- Game Configuration ---
        this.componentWidth = 80;  // Width of each pathogen/component tile
        this.componentHeight = 50; // Height of each pathogen/component tile
        this.rowPadding = 80;     // Padding from left/right edges for rows

        // --- Pathogen and Vaccine Component Definitions ---
        // Define pathogen types and their matching vaccine components, including colors
        this.PATHOGEN_DATA = {
            'Virus Alpha': { color: '#e74c3c', textColor: '#ffffff', match: 'Antigen Alpha' }, // Red
            'Bacteria Beta': { color: '#3498db', textColor: '#ffffff', match: 'Antibody Beta' }, // Blue
            'Toxin Gamma': { color: '#27ae60', textColor: '#ffffff', match: 'Antitoxin Gamma' }, // Green
            'Fungus Delta': { color: '#f1c40f', textColor: '#333333', match: 'Antifungal Delta' } // Yellow
        };
        // Define vaccine component types and their colors
        this.COMPONENT_DATA = {
            'Antigen Alpha': { color: '#e67e22', textColor: '#ffffff' }, // Darker Orange
            'Antibody Beta': { color: '#85c1e9', textColor: '#333333' }, // Lighter Blue
            'Antitoxin Gamma': { color: '#76d7c4', textColor: '#333333' }, // Lighter Green
            'Antifungal Delta': { color: '#f4d03f', textColor: '#333333' } // Darker Yellow
        };
        // Get an array of all pathogen names for random generation
        this.ALL_PATHOGENS = Object.keys(this.PATHOGEN_DATA);
        // Get an array of all vaccine component names for the palette
        this.ALL_COMPONENTS = Object.keys(this.COMPONENT_DATA);
        // --- END Pathogen and Vaccine Component Definitions ---


        // Background Image Loading
        this.mapImage = new Image();
        this.mapImage.src = "/assets/game/vaccine_volcano_bg.png"; // Your background image

        this.mapImage.onload = () => {
            console.log("Vaccine Volcano background image loaded successfully!");
            this.draw(); // Initial draw
            this.gameLoop(); // Start game loop once image is loaded
            this.startTimer(); // Start timer
        };

        this.mapImage.onerror = () => {
            console.error("Failed to load Vaccine Volcano background image:", this.mapImage.src);
            this.ctx.fillStyle = 'red';
            this.ctx.font = '20px Arial';
            this.ctx.fillText("Error loading background image!", 10, 50);
        };

        // Level Data - Adjusted Y positions for new game
        this.levels = {
            1: { slots: 4, timeLimit: 90, pathogenRowY: 150, vaccineSlotRowY: 250 },
            2: { slots: 6, timeLimit: 90, pathogenRowY: 150, vaccineSlotRowY: 250 },
            3: { slots: 8, timeLimit: 90, pathogenRowY: 150, vaccineSlotRowY: 250 }
        };
        this.componentPaletteStartY = 450; // Y position for the bottom row of selectable components

        // Game State Variables
        this.currentLevel = 1;
        this.score = 0;
        this.timer = 0;
        this.timerInterval = null;
        this.isGameOver = false;
        this.isGameWin = false;

        this.levelState = {}; // Will hold pathogens, vaccineSlots, matchedStatus, vaccineComponents (stacks)

        // Drag-and-Drop state
        this.isDragging = false;
        this.draggedComponent = null; // Stores the type of component being dragged (e.g., 'Antigen Alpha')
        this.dragOffset = { x: 0, y: 0 };
        this.currentMousePos = { x: 0, y: 0 };
        this.componentStackPositions = {}; // Stores the bounding box for each component type's stack for click detection


        // UI Buttons
        this.backButton = document.getElementById('backToHubButton');
        if (this.backButton) {
            this.backButton.addEventListener('click', () => this.navigateToHub());
        }

        this.submitButton = document.getElementById('submitButton');
        if (this.submitButton) {
            this.submitButton.addEventListener('click', () => this.onSubmit());
        }

        // Event Listeners for drag and drop
        this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));

        // Initialize the first level
        this.initLevel(this.currentLevel);
    }

    start() {
        console.log("Starting Vaccine Volcano Mini-Game...");
        // gameLoop and startTimer are called from mapImage.onload
    }

    // --- Level Management ---
    initLevel(levelNum) {
        console.log(`Initializing Level ${levelNum}`);
        this.currentLevel = levelNum;
        const levelConfig = this.levels[levelNum];

        if (!levelConfig) {
            console.error(`Level ${levelNum} not found!`);
            this.gameWin(); // If no more levels, game is won
            return;
        }

        const pathogenSequence = this.generateRandomPathogenSequence(levelConfig.slots);

        this.levelState = {
            pathogens: pathogenSequence,
            vaccineSlots: Array(levelConfig.slots).fill(null), // Player's slots
            matchedStatus: Array(levelConfig.slots).fill(false),
            // Start with a stack of 10 for each component type
            vaccineComponents: this.generateVaccineComponentStacks(10)
        };

        this.timer = levelConfig.timeLimit;
        this.startTimer();
        console.log(`Level ${levelNum} initialized. Timer: ${this.timer}`);
    }

    generateRandomPathogenSequence(numSlots) {
        const sequence = [];
        for (let i = 0; i < numSlots; i++) {
            // Randomly select from predefined pathogen types
            sequence.push(this.ALL_PATHOGENS[Math.floor(Math.random() * this.ALL_PATHOGENS.length)]);
        }
        return sequence;
    }

    generateVaccineComponentStacks(stackSize) {
        const stacks = {};
        this.ALL_COMPONENTS.forEach(componentType => {
            stacks[componentType] = stackSize;
        });
        return stacks;
    }

    // --- New Matching Logic ---
    getNeutralizingComponent(pathogenType) {
        const pathogenData = this.PATHOGEN_DATA[pathogenType];
        return pathogenData ? pathogenData.match : null;
    }

    // --- Game Loop ---
    gameLoop() {
        if (this.isGameOver || this.isGameWin) {
            this.draw();
            return;
        }
        this.update();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }

    update() {
        // Game logic updates will go here
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw background
        if (this.mapImage.complete) {
            this.ctx.drawImage(this.mapImage, 0, 0, this.canvas.width, this.canvas.height);
        } else {
            this.ctx.fillStyle = 'black';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }

        if (!this.isGameOver && !this.isGameWin) {
            // Draw score and timer
            this.ctx.fillStyle = 'white';
            this.ctx.font = '24px Arial';
            this.ctx.textAlign = 'left';
            this.ctx.fillText(`Score: ${this.score}`, 50, 50);
            this.ctx.fillText(`Time: ${this.timer}`, 500, 50);
            this.ctx.fillText(`Level: ${this.currentLevel}`, 650, 50);

            // Draw game elements
            this.drawPathogenRow(this.levelState.pathogens, this.levels[this.currentLevel].pathogenRowY);
            this.drawVaccineSlotRow(this.levelState.vaccineSlots, this.levels[this.currentLevel].vaccineSlotRowY);
            this.drawVaccineComponentPalette(this.levelState.vaccineComponents);

            // Draw the dragged component on top of everything
            if (this.isDragging && this.draggedComponent) {
                const componentInfo = this.COMPONENT_DATA[this.draggedComponent];
                this.ctx.fillStyle = componentInfo.color;
                const drawX = this.currentMousePos.x - this.dragOffset.x;
                const drawY = this.currentMousePos.y - this.dragOffset.y;
                this.ctx.fillRect(drawX, drawY, this.componentWidth, this.componentHeight);
                this.ctx.strokeStyle = '#333333';
                this.ctx.lineWidth = 2;
                this.ctx.strokeRect(drawX, drawY, this.componentWidth, this.componentHeight);
                this.ctx.fillStyle = componentInfo.textColor;
                this.ctx.font = '20px Arial'; // Smaller font for longer names
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                this.ctx.fillText(this.draggedComponent, drawX + this.componentWidth / 2, drawY + this.componentHeight / 2);
            }
        }
        // Draw Game Over/Win screen
        if (this.isGameOver) {
            this.drawGameOverScreen();
        } else if (this.isGameWin) {
            this.drawWinScreen();
        }
    }

    // --- Drawing Helper Functions ---
    drawPathogenRow(pathogenArray, yPos) {
        const numSlots = pathogenArray.length;
        const contentWidth = this.canvas.width - (2 * this.rowPadding);
        const calculatedSpacing = (contentWidth - (numSlots * this.componentWidth)) / (numSlots > 1 ? (numSlots - 1) : 1);
        const spacing = Math.min(80, calculatedSpacing);
        let currentX = this.rowPadding;

        this.ctx.font = '20px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';

        pathogenArray.forEach(pathogenType => {
            const pathogenInfo = this.PATHOGEN_DATA[pathogenType];
            this.ctx.fillStyle = pathogenInfo.color;
            this.ctx.fillRect(currentX, yPos, this.componentWidth, this.componentHeight);
            this.ctx.strokeStyle = '#333333';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(currentX, yPos, this.componentWidth, this.componentHeight);
            this.ctx.fillStyle = pathogenInfo.textColor;
            this.ctx.fillText(pathogenType, currentX + this.componentWidth / 2, yPos + this.componentHeight / 2);
            currentX += this.componentWidth + spacing;
        });
    }

    drawVaccineSlotRow(vaccineSlotArray, yPos) {
        const numSlots = vaccineSlotArray.length;
        const contentWidth = this.canvas.width - (2 * this.rowPadding);
        const calculatedSpacing = (contentWidth - (numSlots * this.componentWidth)) / (numSlots > 1 ? (numSlots - 1) : 1);
        const spacing = Math.min(80, calculatedSpacing);
        let currentX = this.rowPadding;

        this.ctx.font = '20px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';

        vaccineSlotArray.forEach((componentType, i) => {
            const isMatched = this.levelState.matchedStatus[i];

            // Draw empty slot background
            this.ctx.fillStyle = '#ffffff'; // White for empty slots
            this.ctx.fillRect(currentX, yPos, this.componentWidth, this.componentHeight);
            this.ctx.strokeStyle = '#95a5a6'; // Gray border
            this.ctx.lineWidth = 1;
            this.ctx.strokeRect(currentX, yPos, this.componentWidth, this.componentHeight);

            // Draw placed component if exists
            if (componentType) {
                const componentInfo = this.COMPONENT_DATA[componentType];
                let fillColor = componentInfo.color;
                let textColor = componentInfo.textColor;

                if (isMatched) {
                    fillColor = '#28a745'; // Green for correct match
                } else {
                    fillColor = '#dc3545'; // Red for incorrect match
                }

                this.ctx.fillStyle = fillColor;
                this.ctx.fillRect(currentX, yPos, this.componentWidth, this.componentHeight);
                this.ctx.strokeStyle = '#333333';
                this.ctx.lineWidth = 2;
                this.ctx.strokeRect(currentX, yPos, this.componentWidth, this.componentHeight);
                this.ctx.fillStyle = textColor;
                this.ctx.fillText(componentType, currentX + this.componentWidth / 2, yPos + this.componentHeight / 2);
            }
            currentX += this.componentWidth + spacing;
        });
    }

    drawVaccineComponentPalette(componentStacks) {
        const startY = this.componentPaletteStartY;
        const componentSpacing = 100; // Space between component stacks
        const componentsOrder = this.ALL_COMPONENTS; // Consistent order

        const numStacks = componentsOrder.length;
        const totalComponentWidth = numStacks * this.componentWidth;
        const totalSpacingWidth = (numStacks - 1) * componentSpacing;
        const totalContentWidth = totalComponentWidth + totalSpacingWidth;
        const startX = (this.canvas.width - totalContentWidth) / 2; // Center the palette

        let currentX = startX;
        this.componentStackPositions = {}; // Reset for click detection

        this.ctx.font = '20px Arial'; // Font for component names
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';

        componentsOrder.forEach(componentType => {
            const count = componentStacks[componentType];
            const componentInfo = this.COMPONENT_DATA[componentType];

            // Store position for click detection
            this.componentStackPositions[componentType] = {
                x: currentX,
                y: startY,
                width: this.componentWidth,
                height: this.componentHeight
            };

            // Only draw the stack if count > 0 OR if this component is currently being dragged
            if (count > 0 || (this.isDragging && this.draggedComponent === componentType)) {
                this.ctx.fillStyle = componentInfo.color;
                this.ctx.fillRect(currentX, startY, this.componentWidth, this.componentHeight);
                this.ctx.strokeStyle = '#333333';
                this.ctx.lineWidth = 2;
                this.ctx.strokeRect(currentX, startY, this.componentWidth, this.componentHeight);
                this.ctx.fillStyle = componentInfo.textColor;
                this.ctx.fillText(componentType, currentX + this.componentWidth / 2, startY + this.componentHeight / 2);

                // Draw the count
                this.ctx.fillStyle = 'white';
                this.ctx.font = '18px Arial';
                this.ctx.fillText(`x${count}`, currentX + this.componentWidth / 2, startY + this.componentHeight + 20);
            }
            currentX += this.componentWidth + componentSpacing;
        });
    }

    // --- Drag-and-Drop Handlers ---
    handleMouseDown(event) {
        const mouseX = event.offsetX;
        const mouseY = event.offsetY;

        for (const componentType in this.componentStackPositions) {
            const pos = this.componentStackPositions[componentType];
            if (this.levelState.vaccineComponents[componentType] > 0 &&
                mouseX >= pos.x && mouseX <= pos.x + pos.width &&
                mouseY >= pos.y && mouseY <= pos.y + pos.height) {

                this.isDragging = true;
                this.draggedComponent = componentType;
                this.dragOffset = { x: mouseX - pos.x, y: mouseY - pos.y };
                this.currentMousePos = { x: mouseX, y: mouseY };

                this.levelState.vaccineComponents[componentType]--; // Decrement count on pickup
                this.draw(); // Redraw to show immediate change
                return;
            }
        }
    }

    handleMouseMove(event) {
        if (this.isDragging) {
            this.currentMousePos = { x: event.offsetX, y: event.offsetY };
            this.draw();
        }
    }

    handleMouseUp(event) {
        if (!this.isDragging) return;

        this.isDragging = false;
        const dropX = this.currentMousePos.x - this.dragOffset.x;
        const dropY = this.currentMousePos.y - this.dragOffset.y;

        const levelConfig = this.levels[this.currentLevel];
        const numSlots = levelConfig.slots;
        const contentWidth = this.canvas.width - (2 * this.rowPadding);
        const calculatedSpacing = (contentWidth - (numSlots * this.componentWidth)) / (numSlots > 1 ? (numSlots - 1) : 1);
        const spacing = Math.min(80, calculatedSpacing); // Use calculated spacing
        let currentX = this.rowPadding;
        const targetY = levelConfig.vaccineSlotRowY;

        let droppedIntoSlot = false;
        for (let i = 0; i < numSlots; i++) {
            const slotX = currentX;
            const slotY = targetY;

            // Check if dropped component overlaps with this slot
            if (dropX < slotX + this.componentWidth &&
                dropX + this.componentWidth > slotX &&
                dropY < slotY + this.componentHeight &&
                dropY + this.componentHeight > slotY) {

                // If the slot is empty, place the component
                if (this.levelState.vaccineSlots[i] === null) {
                    this.levelState.vaccineSlots[i] = this.draggedComponent;
                    droppedIntoSlot = true;

                    // Check for match
                    if (this.getNeutralizingComponent(this.levelState.pathogens[i]) === this.levelState.vaccineSlots[i]) {
                        this.levelState.matchedStatus[i] = true;
                        this.score += 10; // Award points for correct match
                    } else {
                        this.levelState.matchedStatus[i] = false;
                        // No score penalty for incorrect match, but won't pass level
                    }
                    break;
                } else {
                    // If slot is not empty, return component to stack
                    this.levelState.vaccineComponents[this.draggedComponent]++;
                    droppedIntoSlot = true; // Still "handled" the drop
                    break;
                }
            }
            currentX += this.componentWidth + spacing;
        }

        if (!droppedIntoSlot) {
            // If not dropped into any slot, return component to stack
            this.levelState.vaccineComponents[this.draggedComponent]++;
        }

        this.draggedComponent = null; // Clear dragged component
        this.draw(); // Redraw to finalize
    }

    // --- Timer Functions ---
    startTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        this.timerInterval = setInterval(() => {
            this.timer--;
            this.draw();
            if (this.timer <= 0) {
                clearInterval(this.timerInterval);
                this.handleTimeout();
            }
        }, 1000);
    }

    handleTimeout() {
        console.log("Time's up!");
        if (this.currentLevel === 1) { // Assuming Level 1 is the fail condition for total game over
            this.gameOver();
        } else {
            this.currentLevel--; // Go down a level if time runs out on higher levels
            alert(`Time's up! Dropping to Level ${this.currentLevel}`);
            this.initLevel(this.currentLevel);
        }
    }

    // --- Game End Screens ---
    gameOver() {
        this.isGameOver = true;
        clearInterval(this.timerInterval);
        this.drawGameOverScreen();
    }

    gameWin() {
        this.isGameWin = true;
        clearInterval(this.timerInterval);
        this.drawWinScreen();
    }

    drawGameOverScreen() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = 'red';
        this.ctx.font = '48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText("GAME OVER", this.canvas.width / 2, this.canvas.height / 2 - 50);
        this.ctx.fillStyle = 'white';
        this.ctx.font = '24px Arial';
        this.ctx.fillText("You failed to create the vaccines in time!", this.canvas.width / 2, this.canvas.height / 2 + 10);
    }

    drawWinScreen() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = 'gold';
        this.ctx.font = '48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText("YOU WIN!", this.canvas.width / 2, this.canvas.height / 2 - 50);
        this.ctx.fillStyle = 'white';
        this.ctx.font = '24px Arial';
        this.ctx.fillText("Congratulations! You've conquered the Volcano and saved the world!", this.canvas.width / 2, this.canvas.height / 2 + 10);
        this.ctx.fillText(`Final Score: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2 + 50);
    }

    // --- Game Logic ---
    onSubmit() {
        console.log("Submit button clicked in Vaccine Volcano!");
        const allSlotsFilled = this.levelState.vaccineSlots.every(slot => slot !== null);
        const allMatched = this.levelState.matchedStatus.every(status => status === true);

        if (!allSlotsFilled) {
             alert("Please fill all vaccine slots before submitting!");
             return;
        }

        if (allMatched) {
            console.log("All vaccines matched! Advancing level.");
            this.currentLevel++;
            if (this.levels[this.currentLevel]) {
                this.initLevel(this.currentLevel); // Go to next level
            } else {
                this.gameWin(); // All levels completed
            }
        } else {
            console.log("Not all vaccines matched. Try again.");
            alert("Some vaccines are incorrect! Review your combinations.");
        }
    }

    // --- Navigation ---
    navigateToHub() {
        clearInterval(this.timerInterval);
        window.location.href = "/hub/";
    }
}

document.addEventListener('DOMContentLoaded', (event) => {
    console.log("DOMContentLoaded event fired. Initializing VaccineVolcanoGame.");
    const vaccineVolcanoGame = new VaccineVolcanoGame();
    vaccineVolcanoGame.start();
});