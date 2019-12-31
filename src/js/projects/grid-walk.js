let p5 = require("p5");

const c = function(p) {
  let canvasRecorder;
  let FRAMERATE = 24;
  let height;
  let width;
  let PI = p.PI;
  let walkers = [];

  p.setup = function() {
    p.createCanvas(400, 400);
    height = p.height;
    width = p.width;

    p.background(1);
    p.frameRate(FRAMERATE);
  };

  p.draw = function() {
    p.fill(0, 25);
    p.noStroke();
    p.rect(0, 0, height, width);

    p.translate(height / 2, width / 2);
    p.rotate((-5 * PI) / 4);

    for (let i = walkers.length - 1; i >= 0; i--) {
      step = walkers[i];

      let luckyDraw = p.random(0, 1);

      if (luckyDraw < 0.4) {
        step.goUp();
      } else if (luckyDraw < 0.5) {
        step.goDown();
      } else if (luckyDraw < 0.75) {
        step.goLeft();
      } else if (p.random(0, 1) <= 1) {
        step.goRight();
      }
      if ((step.w <= p.random(1, 3)) | (walkers >= p.random(15, 30))) {
        walkers.splice(i, 1);
      }

      if (canvasRecorder) {
        canvasRecorder.capture(document.getElementById("defaultCanvas0"));
      }
    }

    let colors = ["lightblue", "yellow", "orange", "pink", "white"];
    for (let i = 0; i <= 10; i += 5) {
      let s = new Step(
        p,
        p.random(-5, 5) * 20,
        p.random(-5, 5) * 20,
        p.random([20, 25, 30]),
        p.random(5, 10),
        p.random(colors)
      );
      walkers.push(s);
    }
  };
};

class Step {
  constructor(p, x, y, s, w, color) {
    this.p = p;
    this.x = x;
    this.y = y;
    this.s = s;
    this.w = w;
    this.color = color;
    this.walkers = 0;

    this.dot = () => {
      this.p.fill(this.color);
      this.p.ellipse(this.x, this.y, this.w, this.w);
      this.walkers++;
    };
    this.setStroke = () => {
      this.p.stroke(this.color);
      this.p.strokeWeight(this.w);
      this.w -= 1;
    };
  }

  goRight() {
    let fromX = this.x;
    let fromY = this.y;
    this.x = this.x + this.s;
    this.setStroke();

    this.p.line(fromX, fromY, this.x, this.y);
    this.dot();
  }
  goDown() {
    let fromX = this.x;
    let fromY = this.y;
    this.y = this.y - this.s;
    this.setStroke();

    this.p.line(fromX, fromY, this.x, this.y);
    this.dot();
  }
  goUp() {
    let fromX = this.x;
    let fromY = this.y;
    this.y = this.y + this.s;
    this.p.stroke(this.color);
    this.p.strokeWeight(this.p.random(1, 4));

    this.p.line(fromX, fromY, this.x, this.y);
    this.dot();
  }
  goLeft() {
    let fromX = this.x;
    let fromY = this.y;
    this.x = this.x - this.s;
    this.setStroke();

    this.p.line(fromX, fromY, this.x, this.y);
    this.dot();
  }
}

new p5(c);
