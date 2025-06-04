class LabScene {
    constructor() {
      this.canvas = document.getElementById('labCanvas');
      this.ctx = this.canvas.getContext('2d');
  
      this.mapImage = new Image();
      this.mapImage.src = '/frontend2/assets/dna_lab.png';
  
      this.init();
    }
  
    init() {
      this.mapImage.onload = () => {
        this.ctx.drawImage(this.mapImage, 0, 0, this.canvas.width, this.canvas.height);
      };
  
      this.canvas.addEventListener('click', () => {
        window.location.href = '/frontend2/hub/';
      });
    }
  }
  
  window.onload = () => new LabScene();
  