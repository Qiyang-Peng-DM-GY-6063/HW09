// original image, to use as reference for pixel colors
let oImg;

let slider;

let x;
let y;

let RED = { r: 255, g: 0, b: 0 };
let YELLOW = { r: 255, g: 255, b: 0 };
let BLUE = { r: 0, g: 0, b: 255 };

// display image, to modify and display on canvas
let mImg;

function preload() {
  oImg = loadImage("../assets/mondriaan.jpg");
  mImg = loadImage("../assets/mondriaan.jpg");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  oImg.resize(0, height);
  mImg.resize(0, height);

  x = (width - oImg.width) / 2;
  y = (height - oImg.height) / 2;

  // we'll read pixel color info from the oImg, so let's load its pixels
  oImg.loadPixels();

  // TODO: setup sliders and other DOM/html elements here
  slider = createSlider(0, 255);
  slider.position(10, 10);
  slider.size(120);
}

function draw() {
  // we'll modify and display the mImg object, so let's load its pixels
  mImg.loadPixels();

  // TODO: do any filtering and pixel modifications here.
  //       This involves a for loop of some kind.
  //       Remember to read from the oImg pixels and write to the mImg.
  let SIMILARITY_VALUE = slider.value();

  for (let idx = 0; idx < oImg.pixels.length; idx += 4) {
    let redVal = oImg.pixels[idx + 0];
    let greenVal = oImg.pixels[idx + 1];
    let blueVal = oImg.pixels[idx + 2];
    let alphaVal = oImg.pixels[idx + 3];

    if (similar(redVal, greenVal, blueVal, RED, SIMILARITY_VALUE)) {
      mImg.pixels[idx] = 100;
      mImg.pixels[idx + 1] = 100;
      mImg.pixels[idx + 2] = 0;
      mImg.pixels[idx + 3] = 15;
    } else if (similar(redVal, greenVal, blueVal, YELLOW, SIMILARITY_VALUE)) {
      mImg.pixels[idx] = 0;
      mImg.pixels[idx + 1] = 100;
      mImg.pixels[idx + 2] = 100;
      mImg.pixels[idx + 3] = 15;
    } else if (similar(redVal, greenVal, blueVal, BLUE, SIMILARITY_VALUE)) {
      mImg.pixels[idx] = 100;
      mImg.pixels[idx + 1] = 0;
      mImg.pixels[idx + 2] = 100;
      mImg.pixels[idx + 3] = 15;
    } else {
      mImg.pixels[idx] = redVal;
      mImg.pixels[idx + 1] = greenVal;
      mImg.pixels[idx + 2] = blueVal;
      mImg.pixels[idx + 3] = alphaVal;
    }
  }

  // we'll display the updated mImg, so let's update its pixels
  mImg.updatePixels();

  // draw the display image
  image(mImg, x, y);
}

function similar(r, g, b, color, gap) {
  return (
    abs(r - color.r) < gap && abs(g - color.g) < gap && abs(b - color.b) < gap
  );
}
