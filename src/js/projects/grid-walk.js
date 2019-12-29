FRAMERATE = 24;
let walkers = [];

function setup() {
  createCanvas(400, 400);
  background(1);

  frameRate(FRAMERATE);
}

function draw() {
  fill(0, 25);
  noStroke();
  rect(0, 0, height, width);

  translate(height / 2, width / 2);
  rotate((-5 * PI) / 4);

  for (let i = walkers.length - 1; i >= 0; i--) {
    step = walkers[i];

    let luckyDraw = random(0, 1);

    if (luckyDraw < 0.4) {
      step.goUp();
    } else if (luckyDraw < 0.5) {
      step.goDown();
    } else if (luckyDraw < 0.75) {
      step.goLeft();
    } else if (random(0, 1) <= 1) {
      step.goRight();
    }
    if ((step.w <= random(1, 3)) | (this.walkers >= random(15, 30))) {
      walkers.splice(i, 1);
    }

    if (canvasRecorder) {
      canvasRecorder.capture(document.getElementById("defaultCanvas0"));
    }
  }

  let colors = ["lightblue", "yellow", "orange", "pink", "white"];
  for (let i = 0; i <= 10; i += 5) {
    let s = new Step(
      random(-5, 5) * 20,
      random(-5, 5) * 20,
      random([20, 25, 30]),
      random(5, 10),
      random(colors)
    );
    walkers.push(s);
  }
}

class Step {
  constructor(x, y, s, w, color) {
    this.x = x;
    this.y = y;
    this.s = s;
    this.w = w;
    this.color = color;
    this.walkers = 0;

    this.dot = () => {
      fill(this.color);
      ellipse(this.x, this.y, this.w, this.w);
      this.walkers++;
    };
    this.setStroke = () => {
      stroke(this.color);
      strokeWeight(this.w);
      this.w -= 1;
    };
  }

  goRight() {
    let fromX = this.x;
    let fromY = this.y;
    this.x = this.x + this.s;
    this.setStroke();

    line(fromX, fromY, this.x, this.y);
    this.dot();
  }
  goDown() {
    let fromX = this.x;
    let fromY = this.y;
    this.y = this.y - this.s;
    this.setStroke();

    line(fromX, fromY, this.x, this.y);
    this.dot();
  }
  goUp() {
    let fromX = this.x;
    let fromY = this.y;
    this.y = this.y + this.s;
    stroke(this.color);
    strokeWeight(random(1, 4));

    line(fromX, fromY, this.x, this.y);
    this.dot();
  }
  goLeft() {
    let fromX = this.x;
    let fromY = this.y;
    this.x = this.x - this.s;
    this.setStroke();

    line(fromX, fromY, this.x, this.y);
    this.dot();
  }
}
