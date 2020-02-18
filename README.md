# mspaint.exe

The repository contains source code for generating motions on
[https://www.instagram.com/engineer.lulu/](https://www.instagram.com/engineer.lulu/).

## Development

Javascript packages are managed by npm and compiled by browserify.

```bash
npm install
npm install -g browserify watchify
# watch and compile js
watchify -t require-globify src/js/main.js -o src/js/bundle.js -v

# serves file to localhost
# this is only needed because some of the packages checks for cors when loading
# assets from url
python3 -m http.server --directory src
```

Sketches on available at [http://localhost:8000/?sketch=spring-character-3d](http://localhost:8000/?sketch=spring-character-3d)

Recording is enabled when `start-second` and `frame-rate` is provided in the url params. One can also change `format` to `webm` so it records video instead (default is set to `png`).

## Packages

- `src`: contains all the sketch assets.
- `python-utils`: contains some of the opencv transformation to post-process images captured from canvas (`p5.js` or `three.js`)

## Misc

Things worth knowing.

* When working with type in 3d, you can covert ttf to typeface at
[https://gero3.github.io/facetype.js/](https://gero3.github.io/facetype.js/)