// assets/game/lab.js

class LabGame {
  constructor() {
      this.canvas = document.getElementById('labCanvas');
      this.ctx = this.canvas.getContext('2d');

      // Game Configuration
      this.canvas.width = 800; // Set canvas width explicitly
      this.canvas.height = 600; // Set canvas height explicitly
      this.baseWidth = 50;  // Width of each DNA base tile
      this.baseHeight = 50; // Height of each DNA base tile
      this.rowPadding = 150; // Padding from left/right edges for base rows, adjusted for image

      // Background Image Loading
      this.mapImage = new Image();
      this.mapImage.src = "/assets/game/dna_lab.png"; // Path to your DNA Lab map image

      // Add an event listener for when the map image loads
      this.mapImage.onload = () => {
          console.log("DNA Lab map image loaded successfully!");
          this.draw(); // Initial draw with background
          // The gameLoop and startTimer will be called from the start() method
      };

      // Add an error handler for the image
      this.mapImage.onerror = () => {
          console.error("Failed to load DNA Lab map image:", this.mapImage.src);
          this.ctx.fillStyle = 'red';
          this.ctx.font = '20px Arial';
          this.ctx.fillText("Error loading map image!", 10, 50);
      };


      // Level Data - Adjusted Y positions based on Python code and image
      this.levels = {
          1: { slots: 4, timeLimit: 90, topRowY: 200, bottomRowY: 300 },
          2: { slots: 7, timeLimit: 90, topRowY: 200, bottomRowY: 300 },
          3: { slots: 10, timeLimit: 90, topRowY: 200, bottomRowY: 300 }
      };
      this.selectableBasesStartY = 420; // Y position for the bottom row of selectable bases


      // Game State Variables
      this.currentLevel = 1;
      this.levelState = {}; // Will hold prefilledDna, playerDna, matchedStatus, etc.
      this.score = 0;
      this.timer = 0;
      this.timerInterval = null; // To store the setInterval ID

      // Game Screens
      this.isGameOver = false;
      this.isGameWin = false;

      // --- NEW DRAG-AND-DROP STATE VARIABLES ---
      this.isDragging = false;
      this.draggedBase = null; // Stores the type of base being dragged (e.g., 'A', 'T', 'G', 'C')
      this.dragOffset = { x: 0, y: 0 }; // Offset from mouse pointer to top-left of dragged base
      this.currentMousePos = { x: 0, y: 0 }; // Current mouse position
      this.baseStackPositions = {}; // Stores the bounding box for each base type's stack for click detection
      // --- END NEW DRAG-AND-DROP STATE VARIABLES ---


      // UI Elements (for navigation and game control)
      this.backButton = document.getElementById('backToHubButton');
      if (this.backButton) {
          this.backButton.addEventListener('click', () => this.navigateToHub());
      }

      this.submitButton = document.getElementById('submitButton');
      if (this.submitButton) {
          this.submitButton.addEventListener('click', () => this.onSubmit());
      }

      // --- NEW: Add event listeners for drag and drop ---
      this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
      this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
      this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
      // --- END NEW ---

      // Initialize the first level
      this.initLevel(this.currentLevel);
      console.log("LabGame constructor finished. Current Level:", this.currentLevel);
      console.log("Initial Level State:", this.levelState);
  }

  start() {
      console.log("Starting DNA Lab Mini-Game...");
      if (this.mapImage.complete) {
           this.gameLoop();
           this.startTimer();
      }
  }

  // --- Level Management ---
  initLevel(levelNum) {
      console.log(`Initializing Level ${levelNum}`);
      this.currentLevel = levelNum;
      const levelConfig = this.levels[levelNum];

      if (!levelConfig) {
          console.error(`Level ${levelNum} not found!`);
          this.gameWin();
          return;
      }

      const prefilledDnaSequence = this.generateRandomDnaSequence(levelConfig.slots);

      this.levelState = {
          prefilledDna: prefilledDnaSequence,
          playerDna: Array(levelConfig.slots).fill(null),
          matchedStatus: Array(levelConfig.slots).fill(false),
          // --- UPDATED: Generate stacks of 10 for each base type ---
          selectableBases: this.generateSelectableBases(10) // Start with 10 of each base
          // --- END UPDATED ---
      };

      this.timer = levelConfig.timeLimit;
      this.startTimer();
      console.log(`Level ${levelNum} initialized. Timer: ${this.timer}`);
  }

  generateRandomDnaSequence(numSlots) {
      const bases = ['A', 'T', 'G', 'C'];
      const sequence = [];
      for (let i = 0; i < numSlots; i++) {
          sequence.push(bases[Math.floor(Math.random() * bases.length)]);
      }
      return sequence;
  }

  // --- UPDATED: Generate bases as a count object for stacks ---
  generateSelectableBases(stackSize) {
      return {
          'A': stackSize,
          'T': stackSize,
          'G': stackSize,
          'C': stackSize
      };
  }
  // --- END UPDATED ---

  getComplement(base) {
      switch (base) {
          case 'A': return 'T';
          case 'T': return 'A';
          case 'G': return 'C';
          case 'C': return 'G';
          default: return '';
      }
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
      // Game logic updates will go here (e.g., checking for drag/drop, collisions)
  }

  draw() {
      console.log("Drawing canvas...");
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      if (this.mapImage.complete) {
          this.ctx.drawImage(this.mapImage, 0, 0, this.canvas.width, this.canvas.height);
      } else {
          this.ctx.fillStyle = 'black';
          this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      }

      if (!this.isGameOver && !this.isGameWin) {
          this.drawDnaRow(this.levelState.prefilledDna, this.levels[this.currentLevel].topRowY, 'top');
          this.drawDnaRow(this.levelState.playerDna, this.levels[this.currentLevel].bottomRowY, 'bottom');
          // --- UPDATED: Pass the selectableBases object (counts) ---
          this.drawSelectableBases(this.levelState.selectableBases);
          // --- END UPDATED ---

          this.ctx.fillStyle = 'white';
          this.ctx.font = '24px Arial';
          this.ctx.textAlign = 'left';
          this.ctx.fillText(`Time: ${this.timer}`, 500, 140);

          this.ctx.textAlign = 'left';
          this.ctx.fillText(`Level: ${this.currentLevel}`, 600, 140);
      }
      if (this.isGameOver) {
          this.drawGameOverScreen();
      } else if (this.isGameWin) {
          this.drawWinScreen();
      }
  }

  // --- Drawing Helper Functions ---
  drawDnaRow(dnaArray, yPos, rowType) {
      const numSlots = dnaArray.length;
      const contentWidth = this.canvas.width - (2 * this.rowPadding);
      const calculatedSpacing = (contentWidth - (numSlots * this.baseWidth)) / (numSlots > 1 ? (numSlots - 1) : 1);
      const spacing = Math.min(80, calculatedSpacing);
      let currentX = this.rowPadding;

      // Store slot positions for drop detection (if needed more broadly)
      // this.playerSlotPositions = []; // Could store this array in the class for easy access

      for (let i = 0; i < numSlots; i++) {
          const base = dnaArray[i];
          const isMatched = this.levelState.matchedStatus[i];

          if (rowType === 'bottom') {
              this.ctx.fillStyle = '#ffffff';
              this.ctx.fillRect(currentX, yPos, this.baseWidth, this.baseHeight);
              this.ctx.strokeStyle = '#95a5a6';
              this.ctx.lineWidth = 1;
              this.ctx.strokeRect(currentX, yPos, this.baseWidth, this.baseHeight);

              // Store player slot positions for drop detection
              // if (this.playerSlotPositions.length < numSlots) { // Initialize once
              //     this.playerSlotPositions.push({ x: currentX, y: yPos, width: this.baseWidth, height: this.baseHeight, index: i });
              // }
          }

          if (base) {
              let baseColor;
              let textColor;

              switch (base) {
                  case 'A': baseColor = '#e74c3c'; textColor = '#ffffff'; break;
                  case 'T': baseColor = '#3498db'; textColor = '#ffffff'; break;
                  case 'G': baseColor = '#27ae60'; textColor = '#ffffff'; break;
                  case 'C': baseColor = '#f1c40f'; textColor = '#333333'; break;
                  default: baseColor = '#95a5a6'; textColor = '#ffffff';
              }

              // If it's a player's base and it's matched, draw it green
              if (rowType === 'bottom' && isMatched) {
                  baseColor = '#008000'; // Darker green for matched
                  textColor = '#ffffff';
              } else if (rowType === 'bottom' && base && !isMatched) {
                  // If it's a player's base and NOT matched, draw it red
                  baseColor = '#9E2B2B'; // A shade of red
                  textColor = '#ffffff';
              }


              this.ctx.fillStyle = baseColor;
              this.ctx.fillRect(currentX, yPos, this.baseWidth, this.baseHeight);
              this.ctx.fillStyle = textColor;
              this.ctx.font = '36px Arial';
              this.ctx.textAlign = 'center';
              this.ctx.textBaseline = 'middle';
              this.ctx.fillText(base, currentX + this.baseWidth / 2, yPos + this.baseHeight / 2);
          }
          currentX += this.baseWidth + spacing;
      }
  }

  // --- UPDATED: drawSelectableBases to show stacks and handle dragged base ---
  drawSelectableBases(basesObject) { // basesObject is like { A: 10, T: 10, G: 10, C: 10 }
      const startY = this.selectableBasesStartY;
      const baseSpacing = 70; // Horizontal space between the start of one base and the next
      const basesOrder = ['A', 'T', 'G', 'C']; // Maintain a consistent drawing order for the stacks
      const numStacks = basesOrder.length; // 4 stacks

      // Calculate initial X to center the 4 stacks
      const totalBaseWidth = numStacks * this.baseWidth;
      const totalSpacingWidth = (numStacks - 1) * baseSpacing;
      const totalContentWidth = totalBaseWidth + totalSpacingWidth;
      const startX = (this.canvas.width - totalContentWidth) / 2;

      let currentX = startX;
      this.baseStackPositions = {}; // Clear and rebuild stack positions for click detection

      this.ctx.font = '36px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';

      basesOrder.forEach(baseType => {
          const count = basesObject[baseType];

          // Store the position of this stack for mouse event detection
          this.baseStackPositions[baseType] = {
              x: currentX,
              y: startY,
              width: this.baseWidth,
              height: this.baseHeight
          };

          // Only draw the stack if the count > 0 OR if we are currently dragging this type of base
          // (we don't want the stack to disappear completely if we've just picked up the last one)
          if (count > 0 || (this.isDragging && this.draggedBase === baseType)) {
              let baseColor;
              let textColor;
              switch (baseType) {
                  case 'A': baseColor = '#e74c3c'; textColor = '#ffffff'; break; // Red
                  case 'T': baseColor = '#3498db'; textColor = '#ffffff'; break; // Blue
                  case 'G': baseColor = '#27ae60'; textColor = '#ffffff'; break; // Green
                  case 'C': baseColor = '#f1c40f'; textColor = '#333333'; break; // Yellow/Orange
                  default: baseColor = '#95a5a6'; textColor = '#ffffff';
              }

              this.ctx.fillStyle = baseColor;
              this.ctx.fillRect(currentX, startY, this.baseWidth, this.baseHeight);

              this.ctx.strokeStyle = '#333333';
              this.ctx.lineWidth = 2;
              this.ctx.strokeRect(currentX, startY, this.baseWidth, this.baseHeight);

              this.ctx.fillStyle = textColor;
              this.ctx.font = '36px Arial';
              this.ctx.fillText(baseType, currentX + this.baseWidth / 2, startY + this.baseHeight / 2);

              // Draw the count below the base
              this.ctx.fillStyle = 'white'; // Color for count text
              this.ctx.font = '18px Arial'; // Smaller font for count
              this.ctx.fillText(`x${count}`, currentX + this.baseWidth / 2, startY + this.baseHeight + 20);
          }

          currentX += this.baseWidth + baseSpacing;
      });

      // --- NEW: Draw the dragged base on top of everything else ---
      if (this.isDragging && this.draggedBase) {
          let baseColor;
          let textColor;
          switch (this.draggedBase) {
              case 'A': baseColor = '#e74c3c'; textColor = '#ffffff'; break;
              case 'T': baseColor = '#3498db'; textColor = '#ffffff'; break;
              case 'G': baseColor = '#27ae60'; textColor = '#ffffff'; break;
              case 'C': baseColor = '#f1c40f'; textColor = '#333333'; break;
          }

          // Calculate actual draw position considering the mouse offset
          const drawX = this.currentMousePos.x - this.dragOffset.x;
          const drawY = this.currentMousePos.y - this.dragOffset.y;

          this.ctx.fillStyle = baseColor;
          this.ctx.fillRect(drawX, drawY, this.baseWidth, this.baseHeight);
          this.ctx.strokeStyle = '#333333';
          this.ctx.lineWidth = 2;
          this.ctx.strokeRect(drawX, drawY, this.baseWidth, this.baseHeight);
          this.ctx.fillStyle = textColor;
          this.ctx.font = '36px Arial';
          this.ctx.textAlign = 'center';
          this.ctx.textBaseline = 'middle';
          this.ctx.fillText(this.draggedBase, drawX + this.baseWidth / 2, drawY + this.baseHeight / 2);
      }
      // --- END NEW ---
  }

  // --- NEW DRAG-AND-DROP HANDLERS ---
  handleMouseDown(event) {
      // Get mouse coordinates relative to the canvas
      const mouseX = event.offsetX;
      const mouseY = event.offsetY;

      // Iterate through each selectable base stack to see if it was clicked
      for (const baseType in this.baseStackPositions) {
          const pos = this.baseStackPositions[baseType];
          // Check if mouse is within the bounds of the base tile and if there are bases available
          if (this.levelState.selectableBases[baseType] > 0 &&
              mouseX >= pos.x && mouseX <= pos.x + pos.width &&
              mouseY >= pos.y && mouseY <= pos.y + pos.height) {

              this.isDragging = true;
              this.draggedBase = baseType;
              // Calculate the offset from the mouse click point to the top-left of the base
              this.dragOffset = { x: mouseX - pos.x, y: mouseY - pos.y };
              this.currentMousePos = { x: mouseX, y: mouseY }; // Set initial drag position

              // Decrement the count of the base type from the stack
              this.levelState.selectableBases[baseType]--;
              this.draw(); // Redraw immediately to show the stack count change and the base being lifted
              return; // Stop after finding the clicked base
          }
      }
  }

  handleMouseMove(event) {
      if (this.isDragging) {
          // Update the current mouse position
          this.currentMousePos = { x: event.offsetX, y: event.offsetY };
          this.draw(); // Redraw the canvas to update the dragged base's position
      }
  }

  handleMouseUp(event) {
      if (!this.isDragging) return; // Only process if a drag was in progress

      this.isDragging = false; // End dragging
      // Calculate the actual top-left corner of the dropped base
      const dropX = this.currentMousePos.x - this.dragOffset.x;
      const dropY = this.currentMousePos.y - this.dragOffset.y;

      // Check if the base was dropped into a valid empty player slot
      const levelConfig = this.levels[this.currentLevel];
      const numSlots = levelConfig.slots;
      const contentWidth = this.canvas.width - (2 * this.rowPadding);
      const calculatedSpacing = (contentWidth - (numSlots * this.baseWidth)) / (numSlots > 1 ? (numSlots - 1) : 1);
      const spacing = Math.min(80, calculatedSpacing);
      let currentX = this.rowPadding; // Starting X for the first player slot
      const targetY = levelConfig.bottomRowY; // Y position of player slots

      let droppedIntoSlot = false;
      for (let i = 0; i < numSlots; i++) {
          // Check if the current slot is empty AND if the dropped base overlaps with this slot
          if (this.levelState.playerDna[i] === null) {
              const slotX = currentX;
              const slotY = targetY;

              // Simple AABB collision detection
              if (dropX < slotX + this.baseWidth && // left edge of dragged < right edge of slot
                  dropX + this.baseWidth > slotX && // right edge of dragged > left edge of slot
                  dropY < slotY + this.baseHeight && // top edge of dragged < bottom edge of slot
                  dropY + this.baseHeight > slotY) { // bottom edge of dragged > top edge of slot

                  // Base dropped into an empty slot!
                  this.levelState.playerDna[i] = this.draggedBase;
                  droppedIntoSlot = true;

                  // Check if the placed base is the correct complement
                  if (this.getComplement(this.levelState.playerDna[i]) === this.levelState.prefilledDna[i]) {
                      this.levelState.matchedStatus[i] = true; // Mark as correctly matched
                  } else {
                      this.levelState.matchedStatus[i] = false; // Mark as incorrectly matched
                  }
                  break; // Exit loop after placing the base
              }
          }
          currentX += this.baseWidth + spacing; // Move to the next slot's X position
      }

      if (!droppedIntoSlot) {
          // If the base was not dropped into a valid empty slot, return it to its stack
          this.levelState.selectableBases[this.draggedBase]++;
      }

      this.draggedBase = null; // Clear the dragged base reference
      this.draw(); // Redraw the canvas to show the final state (placed base or returned to stack)
  }
  // --- END NEW DRAG-AND-DROP HANDLERS ---


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
      if (this.currentLevel === 1) {
          this.gameOver();
      } else {
          this.currentLevel--;
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
      this.ctx.fillText("You failed Level 1. Try again!", this.canvas.width / 2, this.canvas.height / 2 + 10);
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
      this.ctx.fillText("Congratulations! You matched all the DNA!", this.canvas.width / 2, this.canvas.height / 2 + 10);
  }

  // --- Game Logic ---
  onSubmit() {
      console.log("Submit button clicked!");
      // The previous logic checked `matchedStatus.every(status => status === true)`.
      // This is still correct for checking if all placed bases are correctly matched.
      const allMatched = this.levelState.matchedStatus.every(status => status === true);
      const allSlotsFilled = this.levelState.playerDna.every(base => base !== null);

      if (allSlotsFilled && allMatched) {
          console.log("All bases matched! Advancing level.");
          this.currentLevel++;
          if (this.levels[this.currentLevel]) {
              this.initLevel(this.currentLevel);
          } else {
              this.gameWin(); // All levels completed
          }
      } else if (!allSlotsFilled) {
           alert("Please fill all slots before submitting!");
      }
      else {
          console.log("Not all bases matched. Try again.");
          alert("Some bases are incorrect! Review your sequence.");
      }
  }

  // --- Navigation ---
  navigateToHub() {
      clearInterval(this.timerInterval);
      window.location.href = "/hub/";
  }
}

document.addEventListener('DOMContentLoaded', (event) => {
  console.log("DOMContentLoaded event fired. Initializing LabGame.");
  const labGame = new LabGame();
  labGame.start();
});