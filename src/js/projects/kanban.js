const p5 = require("p5");
const data = require("./kanban-boxes");

const mobile = 980;

const c = (p) => {
  let boxes = [];
  let xx = 100;
  let margin = xx / 8;
  let fonts = {};

  p.preload = () => {
    // const bg = p.loadImage('assets/textures/texture.jpg');
  };

  p.setup = () => {
    p.frameRate(10);

    xx = Math.floor(p.displayWidth / 25);
    margin = Math.floor(xx / 8);
    if (p.displayWidth <= mobile) {
      xx = Math.floor(p.displayWidth / 5);
      margin = Math.floor(xx / 8);
    }

    fonts = {
      "Shrikhand-Regular": p.loadFont("assets/fonts/Shrikhand-Regular.ttf"),
      "ZCOOLQingKeHuangYou-Regular": p.loadFont(
        "assets/fonts/ZCOOLQingKeHuangYou-Regular.ttf"
      ),
      "Eczar-ExtraBold": p.loadFont("assets/fonts/Eczar-ExtraBold.ttf"),
      lu: p.loadFont("assets/fonts/lu.ttf"),
      "jf-openhuninn": p.loadFont("assets/fonts/jf-openhuninn-1.1.ttf"),
      twicon: p.loadFont("assets/fonts/twicon.otf"),
      "Cinzel-VariableFont_wght": p.loadFont(
        "assets/fonts/Cinzel-VariableFont_wght.ttf"
      ),
      "EmblemaOne-Regular": p.loadFont("assets/fonts/EmblemaOne-Regular.ttf"),
      "Syncopate-Bold": p.loadFont("assets/fonts/Syncopate-Bold.ttf"),
      "Limelight-Regular": p.loadFont("assets/fonts/Limelight-Regular.ttf"),
    };

    for (const ix in data) {
      const el = data[ix];
      var box;
      if (el.type === "lightbox") {
        box = new LightBox(
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
        );
      }

      if (el.type === "neon") {
        box = new NeonBox(
          p,
          el.w,
          el.h,
          el.text_color,
          el.direction,
          el.text,
          fonts[el.font],
          el.size * xx,
          el.rect === undefined ? true : el.rect,
          el.thickness || 40,
          el.alpha || 40,
          "/",
          xx
        );
      }
      boxes.push(box);
    }

    const layout = new LayoutAlgorithm(boxes, p.displayWidth, margin, xx);
    if (p.displayWidth <= mobile) {
      layout.arrangeCoords("end");
    } else {
      layout.arrangeCoords("mid");
    }

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

    if (x <= from + this.margin) {
      dir = -1;
    } else {
      dir = 1;
    }
    nx = x + dir * (this.xx + this.margin + 1);

    if (nx <= this.margin || nx >= this.vw - this.xx) {
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
      x = this.vw - this.margin;
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

      const XOverlap1 =
        (toX >= fromBoxX && fromBoxX >= fromX) ||
        (toX >= toBoxX && toBoxX >= fromX);
      const XOverlap2 =
        (toBoxX >= fromX && fromX >= fromBoxX) ||
        (toBoxX >= toX && toX >= fromBoxX);
      const YOverlap1 =
        (toY >= fromBoxY && fromBoxY >= fromY) ||
        (toY >= toBoxY && toBoxY >= fromY);
      const YOverlap2 =
        (toBoxY >= fromY && fromY >= fromBoxY) ||
        (toBoxY >= toY && toY >= fromBoxY);

      // NOTE: for debug, check overlap
      // console.log(box.text);
      // console.log(ib.text);
      // console.log(fromX, toX);
      // console.log(fromY, toY);
      // console.log(fromBoxX, toBoxX);
      // console.log(fromBoxY, toBoxY);
      // console.log(XOverlap1 || XOverlap2, YOverlap1 || YOverlap2);

      if ((XOverlap1 || XOverlap2) && (YOverlap1 || YOverlap2)) {
        return false;
      }
    }
    return true;
  }
}

class NeonBox {
  constructor(
    p,
    w,
    h,
    textColor,
    dir,
    text,
    font,
    size,
    rect = true,
    thickness = 50,
    alpha = 40,
    url = "#",
    xx = 100
  ) {
    this.p = p;
    this.xx = Math.floor(xx);
    this.w = w * this.xx;
    this.h = h * this.xx;

    this.textColor = textColor;
    this.dir = dir;
    this.text = text;

    this.font = font;
    this.url = url;
    if (!size) {
      this.size = this.xx;
    } else {
      this.size = Math.floor(size);
    }
    this.rect = rect;
    this.thickness = thickness;
    this.alpha = alpha;
  }

  setXY(x, y) {
    this.x = x;
    this.y = y;
  }

  hexToColor(hex) {
    const c = this.p.color(hex);
    const red = this.p.red(c);
    const green = this.p.green(c);
    const blue = this.p.blue(c);
    return [red, green, blue];
  }

  hover() {}
  clicked() {}

  show(i, debug = false) {
    this.p.push();
    this.p.blendMode(this.p.BLEND);

    let alpha = this.alpha;
    if (this.p.random(1) < 0.05) {
      alpha = this.alpha * 0.2;
    }

    this.p.noFill();

    if (debug) {
      this.p.stroke(255);
      this.p.fill(0);
      this.p.rect(this.x, this.y, this.w, this.h);
    }

    this.p.blendMode(this.p.SCREEN);
    this.p.textSize(this.size);
    this.p.textFont(this.font);
    const [r, g, b] = this.hexToColor(this.textColor);

    for (var i = 1; i < this.thickness; ++i) {
      this.p.strokeWeight(i * 0.25);
      const [rm, gm, bm] = [
        this.p.map(i, 0, 50, r - 50, r),
        this.p.map(i, 0, 50, g - 50, g),
        this.p.map(i, 0, 50, b - 50, b),
      ];
      this.p.stroke(rm, gm, bm, alpha);

      if (this.rect) {
        this.p.rect(this.x, this.y, this.w, this.h, 10);
      }
      this.p.text(this.text, this.x + this.xx / 2, this.y, this.w, this.h);
    }

    this.p.pop();
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
    this.text = text;

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
    this.p.noStroke();
    this.p.fill(this.textColor);
    this.p.textSize(this.size);
    this.p.textFont(this.font);

    if (this.dir === "x") {
      this.p.text(this.text, this.x + this.xx / 2, this.y, this.w, this.h);
    }

    if (this.dir === "y") {
      this.text.split("").forEach((char, ix) => {
        var x, y;
        // if (this.dir === "y") {
        x = this.x + Math.floor((ix * this.size) / this.h) * this.size;
        y = this.y + ((ix * this.size) % this.h) + this.size * 0.9;
        // }

        // if (this.dir === "x") {
        //   x = this.x + ((ix * this.size) % this.w);
        //   y =
        //     this.y +
        //     Math.floor((ix * this.size) / this.w) * this.size +
        //     this.size * 0.9;
        // }

        this.p.text(char, x, y);
      });
    }
  }

  show(i, debug = false) {
    this.p.push();
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
    this.p.pop();
  }
}

new p5(c);
