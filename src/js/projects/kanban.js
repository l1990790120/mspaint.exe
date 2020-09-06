const p5 = require("p5");
const data = require("./kanban-boxes");

const c = (p) => {
  let boxes = [];

  p.preload = () => {
    // const bg = p.loadImage('assets/textures/texture.jpg');
  };

  p.setup = () => {
    p.frameRate(5);

    const xx = Math.floor(p.windowWidth / 20);
    const margin = Math.floor(xx / 8);

    const fonts = {
      "Shrikhand-Regular": p.loadFont("assets/fonts/Shrikhand-Regular.ttf"),
      "ZCOOLQingKeHuangYou-Regular": p.loadFont(
        "assets/fonts/ZCOOLQingKeHuangYou-Regular.ttf"
      ),
      "Eczar-ExtraBold": p.loadFont("assets/fonts/Eczar-ExtraBold.ttf"),
      lu: p.loadFont("assets/fonts/lu.ttf"),
      "jf-openhuninn": p.loadFont("assets/fonts/jf-openhuninn-1.1.ttf"),
    };

    for (const ix in data) {
      const el = data[ix];
      boxes.push(
        new LightBox(
          p,
          el.w,
          el.h,
          el.flash_rate,
          el.text_color,
          el.background_color,
          el.direction,
          el.text,
          fonts[el.font],
          el.size * xx,
          el.url,
          xx
        )
      );
    }

    const layout = new LayoutAlgorithm(boxes, p.windowWidth, margin, xx);
    layout.arrangeCoords();

    let height = 0;
    let width = 0;
    boxes.forEach((box, i) => {
      const [boxX, boxY] = layout.coords[i];
      box.setXY(boxX, boxY);

      if (boxY + box.h > height) {
        height = boxY + box.h;
      }
      if (boxX + box.w > width) {
        width = boxX + box.w;
      }
    });

    p.createCanvas(width + margin, height + margin);
  };

  p.draw = () => {
    const frameCount = p.frameCount;
    p.background(0);
    boxes.forEach((x) => {
      x.show(frameCount);
    });
    boxes.forEach((x) => {
      x.hover();
    });

    // if (frameCount == 1) {
    //   window.canvasRecorder.start();
    // }

    // if (window.canvasRecorder) {
    //   window.canvasRecorder.capture(document.getElementById("defaultCanvas0"));
    // }
  };

  p.mousePressed = () => {
    boxes.forEach((x) => {
      x.clicked();
    });
  };
};

class LayoutAlgorithm {
  constructor(boxes, vw, margin, xx) {
    this.boxes = boxes;
    this.vw = vw;
    this.margin = margin;
    this.xx = xx;
    this.coords = [];
  }

  nextStep(x, y, from) {
    var nx, ny;
    let dir = 1;

    if (x <= from + this.margin || x <= from) {
      dir = -1;
    } else {
      dir = 1;
    }
    nx = x + dir * (this.xx + this.margin);

    if (nx < 0 || nx > this.vw) {
      nx = from + this.margin;
      ny = y + (this.xx + this.margin);
    } else {
      ny = y;
    }

    return [Math.floor(nx), Math.floor(ny)];
  }

  // NOTE: BFS implementation
  // NOTE: can be more efficient if caching searched path
  arrangeCoords(start = "mid") {
    var x, y;
    y = this.margin;
    if (start === "mid") {
      x = Math.floor(this.vw / 2);
    }
    if (start === "end") {
      x = this.vw;
    }

    const from = x;

    // NOTE: for debug, avoid inf loop
    // for (let i = 0; i <= 20; i++) {
    // let i = 0;

    let finished = false;
    while (!finished) {
      [x, y] = this.nextStep(x, y, from);
      if (this.coords.length === this.boxes.length) {
        finished = true;
        continue;
      }

      const box = this.boxes[this.coords.length];
      if (this.checkAvailabe(x, y, box, this.coords)) {
        this.coords.push([x, y]);
      }

      // NOTE: for debug, check step coordinates
      // i++;
      // console.log(i, "step", x, y);
      // console.log(i, "coords", this.coords);
    }
  }
  checkAvailabe(x, y, box, coords) {
    if (coords.length === 0) {
      return true;
    }

    const fromX = x;
    const toX = x + box.w + this.margin;
    const fromY = y;
    const toY = y + box.h + this.xx + this.margin;

    for (const ix in coords) {
      const ib = this.boxes[ix];
      const [cX, cY] = coords[ix];
      const fromBoxX = cX;
      const toBoxX = cX + ib.w;
      const fromBoxY = cY;
      const toBoxY = cY + ib.h;

      const fromBoxXYOverlapped =
        toX >= fromBoxX &&
        fromBoxX >= fromX &&
        toY >= fromBoxY &&
        fromBoxY >= fromY;
      const toBoxXYOverlapped =
        toX >= toBoxX && toBoxX >= fromX && toY >= toBoxY && toBoxY >= fromY;
      const fromBoxXToBoxYOverlapped =
        toX >= fromBoxX &&
        fromBoxX >= fromX &&
        toY >= toBoxY &&
        toBoxY >= fromY;
      const toBoxXFromBoxYOverlapped =
        toX >= toBoxX &&
        toBoxX >= fromX &&
        toY >= fromBoxY &&
        fromBoxY >= fromY;

      // NOTE: for debug, check overlap
      // console.log(box.text);
      // console.log(ib.text);
      // console.log(fromX, toX, fromBoxX);
      // console.log(fromY, toY, fromBoxY);
      // console.log(fromX, toX, toBoxX);
      // console.log(fromY, toY, toBoxY);
      // console.log(fromBoxXYOverlapped, toBoxXYOverlapped);
      // console.log(fromBoxXToBoxYOverlapped, toBoxXFromBoxYOverlapped);

      if (
        fromBoxXYOverlapped ||
        toBoxXYOverlapped ||
        fromBoxXToBoxYOverlapped ||
        toBoxXFromBoxYOverlapped
      ) {
        return false;
      }
    }
    return true;
  }
}

class LightBox {
  constructor(
    p,
    w,
    h,
    rate,
    textColor,
    bgColor,
    dir,
    text,
    font,
    size,
    url = "#",
    xx = 100
  ) {
    this.p = p;
    this.xx = Math.floor(xx);

    //this.x = x * this.xx;
    //this.y = y * this.xx;
    this.w = w * this.xx;
    this.h = h * this.xx;

    this.rate = rate;
    this.textColor = textColor;
    this.bgColor = bgColor;
    this.dir = dir;
    this.text = text.split("");

    this.font = font;
    this.url = url;
    if (!size) {
      this.size = this.xx;
    } else {
      this.size = Math.floor(size);
    }
  }

  setXY(x, y) {
    this.x = x;
    this.y = y;
  }

  hexAlpha(hex, alpha) {
    const c = this.p.color(hex);
    c.setAlpha(alpha);
    return c;
  }

  clicked() {
    const mX = this.p.mouseX;
    const mY = this.p.mouseY;
    if (
      (mX >= this.x) &
      (mX <= this.x + this.w) &
      (mY >= this.y) &
      (mY <= this.y + this.h)
    ) {
      window.open(this.url, "_blank");
    }
  }

  hover() {
    const mX = this.p.mouseX;
    const mY = this.p.mouseY;
    if (
      (mX >= this.x) &
      (mX <= this.x + this.w) &
      (mY >= this.y) &
      (mY <= this.y + this.h)
    ) {
      this.lightOn();
      this.textOn();
    }
  }

  lightOff() {
    this.p.noStroke();
    this.p.fill(this.hexAlpha(this.bgColor, 0));
    this.p.rect(this.x, this.y, this.w, this.h);
  }
  lightOn() {
    this.p.fill(this.hexAlpha(this.bgColor, 200));
    this.p.rect(this.x, this.y, this.w, this.h);
  }

  textOn() {
    this.text.forEach((char, ix) => {
      this.p.noStroke();
      this.p.fill(this.textColor);
      this.p.textSize(this.size);
      // this.p.filter(this.p.BLUR, 10);
      var x, y;
      if (this.dir === "y") {
        x = this.x + Math.floor((ix * this.size) / this.h) * this.size;
        y = this.y + ((ix * this.size) % this.h) + this.size * 0.9;
      }

      if (this.dir === "x") {
        x = this.x + ((ix * this.size) % this.w);
        y =
          this.y +
          Math.floor((ix * this.size) / this.w) * this.size +
          this.size * 0.9;
      }
      this.p.textFont(this.font);
      this.p.text(char, x, y);
    });
  }

  show(i, debug = false) {
    const dur = Math.floor(Math.random() * this.rate);

    if (debug) {
      this.p.stroke(255);
      this.p.fill(this.hexAlpha(this.bgColor, 0));
      this.p.rect(this.x, this.y, this.w, this.h);
    } else {
      this.lightOff();
    }

    if (i % 100 <= dur) {
      this.lightOn();
    }
    this.textOn();
  }
}

new p5(c);
