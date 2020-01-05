let p5 = require("p5");

const c = function(p) {
  let height;
  let width;

  p.setup = function() {
    p.createCanvas(400, 400);
    p.frameRate(30);
    height = p.height;
    width = p.width;
    p.background(1);
    p.noFill();
    p.noStroke();
  };

  p.draw = function() {
    frameCount = p.frameCount;

    p.noStroke();
    p.fill(0);
    p.rect(0, 0, width, height);
    p.fill(255);
    p.textSize(100);

    p.textAlign(p.CENTER, p.CENTER);
    p.text("hello", p.width / 2, (0.5 * p.height) / 2);

    let stripsY = 16;
    let stripsX = 1;
    let areas = [];

    for (let sx = 0; sx < stripsX; sx++) {
      for (let sy = 0; sy < stripsY; sy++) {
        let x = sx * (p.width / stripsX);
        let y = sy * (p.height / stripsY);
        let xMovement = frameCount + sy;
        let deg = p.PI / 180;
        let dx = (p.cos(xMovement * deg * 3) * p.width) / 4;
        let dy = y;
        let area = p.get(x, y, p.width / stripsX, p.height / stripsY);
        areas.push([area, dx, dy]);
      }
    }

    p.fill(1);
    p.rect(0, 0, p.width, p.height);
    for (let i = 0; i < areas.length; i++) {
      let area = areas[i];
      p.fill(0);
      p.image(...area);
    }

    if (window.canvasRecorder) {
      window.canvasRecorder.capture(document.getElementById("defaultCanvas0"));
    }
  };
};

new p5(c);
