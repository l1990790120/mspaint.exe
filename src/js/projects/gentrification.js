let moveBuildings = 0;
let buildings = [];
FRAMERATE = 30;

function setup() {
  createCanvas(400, 400);
  background(1);
  frameRate(FRAMERATE);
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
      startX[i % startX.length],
      random(0, height),
      colors[i % colors.length]
    );
    buildings.push(building);
  }
}

function draw() {
  if (frameCount % 10 == 0) {
    noStroke();
    fill(0, 10);
    rect(0, 0, height, width);
  }

  if (frameCount % 10 == 0) {
    buildings[moveBuildings % buildings.length].move(random(15, 25));
    moveBuildings++;
  }

  if (canvasRecorder) {
    canvasRecorder.capture(document.getElementById("defaultCanvas0"));
  }
}

class Building {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
  }
  move(speed = 10) {
    let fromX = this.x;
    let fromY = this.y;
    let size = (frameCount % speed) + speed;

    this.x =
      this.x +
      randomGaussian(frameCount % speed, frameCount % speed) * random([1, -1]);
    if (this.x < 10) {
      this.x = 10;
    }
    if (this.x > width) {
      this.x = width;
    }
    this.y =
      this.y +
      randomGaussian(frameCount % speed, frameCount % speed) * random([2, -1]);
    if (this.y < 50) {
      this.y = 50;
    }
    if (this.y > height) {
      this.y = height;
    }

    for (let i = 0.1; i <= 1; i += 0.05) {
      let lerpX = lerp(fromX, this.x, exp(i) / exp(1));
      let lerpY = lerp(fromY, this.y, exp(i) / exp(1));
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

      if (random(0, 1) > 0.9) {
        stroke(255, 255, 255);
        strokeWeight(2);
      } else {
        noStroke();
      }

      fill(...color);
      rect(x, y, size * (1 + i), height - y);

      if (i >= 0.9) {
        for (let j = 10; j < size * (1 + i) - 10; j += 10) {
          for (let k = 10; k < 400 - y - 30; k += 10) {
            noStroke();
            fill(0, 0, 0);
            if (random(0, 1) > 0.8) {
              fill("yellow");
            }
            rect(x + j, y + k, 5, 5);
          }
        }
      }
    }
  }
}
