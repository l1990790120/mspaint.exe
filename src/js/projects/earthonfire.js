let p5 = require("p5");

const c = function(p) {
  let height;
  let width;

  p.preload = function() {
    font = p.loadFont("assets/fonts/FredokaOne-Regular.ttf");
  };

  p.setup = function() {
    p.createCanvas(400, 400);
    height = p.height;
    width = p.width;

    points = font.textToPoints("earth!", 0, 0, 130, {
      sampleFactor: 0.2,
      simplifyThreshold: 0
    });
    bounds = font.textBounds(" p5 ", 0, 0, 10);

    p.frameRate(30);
    p.background(1);
    p.noFill();
    p.noStroke();
  };

  p.draw = function() {
    frameCount = p.frameCount;

    p.noStroke();
    p.fill(0, 30);
    p.rect(0, 0, width, height);
    p.translate((0.05 * width) / 2, (1.7 * height) / 2);

    let wave = p.constrain(p.sin((frameCount * 3 * p.PI) / 180), 0.1, 1);

    let repeated = 3;
    let squareSize = 3;

    for (let i = 1; i < repeated; i += 0.5) {
      points.forEach(el => {
        let x = el.x;
        let y = el.y;
        p.fill(255, 80 - y, -y);
        p.rect(
          x + p.randomGaussian(y * 0.01, y * 0.01),
          y - p.randomGaussian(0, y * wave * 0.002) * 100,
          squareSize,
          wave * y
        );
      });
    }

    if (frameCount == 1) {
      window.canvasRecorder.start();
    }

    if (window.canvasRecorder) {
      window.canvasRecorder.capture(document.getElementById("defaultCanvas0"));
    }
  };
};

new p5(c);
