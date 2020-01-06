let p5 = require("p5");

const c = function(p) {
  let height;
  let width;

  p.preload = function() {
    font = p.loadFont("assets/fonts/FredokaOne-Regular.ttf");
  };
  p.setup = function() {
    p.createCanvas(800, 800);
    height = p.height;
    width = p.width;

    p.frameRate(30);
    p.background(1);
    p.noStroke();

    pg1 = p.createGraphics(width, height, p.WEBGL);
    pg1.strokeWeight(1);
    pg1.ambientLight(30, 144, 255);
    pg1.pointLight(150, 150, 150, width / 2, height / 2, 100);

    pg2 = p.createGraphics(width, height);
    pg2.noStroke();
    pg2.textFont(font);
    pg2.textSize(180);
    pg2.fill(255);
  };
  p.draw = function() {
    frameCount = p.frameCount;

    pg1.background(0);

    let squareSize = 30;
    let squareSpacing = 40;
    for (let x = -width; x < width; x += squareSpacing) {
      for (let y = -height; y < height; y += squareSpacing) {
        pg1.push();
        pg1.translate(x, y, 0);
        pg1.rotateX(frameCount * 0.05);
        pg1.rotateY(frameCount * 0.05);
        pg1.box(squareSize);
        pg1.pop();
      }
    }

    pg2.push();
    pg2.background(0);
    dx = p.sin((frameCount * 5 * p.PI) / 180);
    dy = p.sin((frameCount * 10 * p.PI) / 180);
    pg2.translate(
      200 + ((frameCount * 5) % (p.width - 400)),
      (1.5 * p.height) / 2 + (dy * p.height) / 10
    );
    pg2.scale(1, 3);

    pg2.textAlign(p.CENTER);
    pg2.fill(255, 255, 255);
    pg2.text("cool", 0, 0);
    pg2.pop();

    (pg3 = pg2.get()).blend(
      pg1.get(),
      0,
      0,
      width,
      height,
      0,
      0,
      width,
      height,
      p.DARKEST
    );
    p.image(pg3, 0, 0, width, height);

    if (window.canvasRecorder) {
      window.canvasRecorder.capture(document.getElementById("defaultCanvas0"));
    }
  };
};
new p5(c);
