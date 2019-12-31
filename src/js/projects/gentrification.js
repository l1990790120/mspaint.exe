let p5 = require("p5");

const c = function(p) {
  let canvasRecorder;
  let moveBuildings = 0;
  let buildings = [];
  let height;
  let width;
  let FRAMERATE = 30;

  p.setup = function() {
    height = p.height;
    width = p.width;
    p.createCanvas(400, 400);
    p.background(1);
    p.frameRate(FRAMERATE);
    let colors = [
      [0, 200, 80],
      [255, 200, 120],
      [200, 150, 200],
      [100, 180, 200],
      [255, 150, 160]
    ];
    let startX = [40, 100, 200, 240, 300];
    for (let i = 0; i < 5; i++) {
      building = new Building(
        p,
        startX[i % startX.length],
        p.random(280, 300),
        colors[i % colors.length]
      );
      buildings.push(building);
    }
  };

  p.draw = function() {
    frameCount = p.frameCount;

    if (frameCount % 10 == 0) {
      p.noStroke();
      p.fill(0, 10);
      p.rect(0, 0, height, width);
    }

    if (frameCount % 10 == 0) {
      buildings[moveBuildings % buildings.length].move(p.random(15, 25));
      moveBuildings++;
    }

    if (canvasRecorder) {
      canvasRecorder.capture(document.getElementById("defaultCanvas0"));
    }
  };
};

class Building {
  constructor(p, x, y, color) {
    this.p = p;
    this.x = x;
    this.y = y;
    this.color = color;
  }
  move(speed = 10) {
    let frameCount = this.p.frameCount;
    let width = this.p.width;
    let height = this.p.height;
    let fromX = this.x;
    let fromY = this.y;
    let size = (frameCount % speed) + speed;

    this.x =
      this.x +
      this.p.randomGaussian(frameCount % speed, frameCount % speed) *
        this.p.random([1, -1]);
    if (this.x < 10) {
      this.x = 10;
    }
    if (this.x > width) {
      this.x = width;
    }
    this.y =
      this.y +
      this.p.randomGaussian(frameCount % speed, frameCount % speed) *
        this.p.random([2, -1]);
    if (this.y < 50) {
      this.y = 50;
    }
    if (this.y > height) {
      this.y = height;
    }

    for (let i = 0.1; i <= 1; i += 0.05) {
      let lerpX = this.p.lerp(fromX, this.x, this.p.exp(i) / this.p.exp(1));
      let lerpY = this.p.lerp(fromY, this.y, this.p.exp(i) / this.p.exp(1));
      let x = lerpX % width;
      let y = lerpY % height;
      if (x < 10) {
        x = 10;
      }
      if (x > width - 10) {
        x = width - 10;
      }

      if (y < 50) {
        y = 50;
      }
      if (y > width) {
        y = height;
      }
      let color = this.color.slice(0, this.color.length);
      color[2] += 20 - i * 20;

      if (this.p.random(0, 1) > 0.9) {
        this.p.stroke(255, 255, 255);
        this.p.strokeWeight(2);
      } else {
        this.p.noStroke();
      }

      this.p.fill(...color);
      this.p.rect(x, y, size * (1 + i), height - y);

      if (i >= 0.9) {
        for (let j = 10; j < size * (1 + i) - 10; j += 10) {
          for (let k = 10; k < 400 - y - 30; k += 10) {
            this.p.noStroke();
            this.p.fill(0, 0, 0);
            if (this.p.random(0, 1) > 0.8) {
              this.p.fill("yellow");
            }
            this.p.rect(x + j, y + k, 5, 5);
          }
        }
      }
    }
  }
}

new p5(c);
