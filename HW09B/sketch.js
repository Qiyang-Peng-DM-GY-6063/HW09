let mCamera;
let faceMesh;
let faces = [];

let vidWidth, vidHeight, scale, newWidth, newHeight, offsetX, offsetY;

let enlargedPart = null; // Variable to store the enlarged facial part name

function preload() {
  faceMesh = ml5.faceMesh();
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  mCamera = createCapture(VIDEO);
  mCamera.hide();
  faceMesh.detectStart(mCamera, gotFaces);
}

function gotFaces(results) {
  faces = results;
}

function draw() {
  background(180, 200, 255);
  centerFull(mCamera);
  noStroke();

  if (faces.length > 0) {
    let face = faces[0];
    drawKeypoints(face);
  }
}

function drawKeypoints(face) {
  let parts = ["lips", "leftEye", "rightEye", "faceOval", "leftEyebrow", "rightEyebrow"];

  parts.forEach(part => {
    let keypoints = face[part].keypoints;

    keypoints.forEach(keypoint => {
      let x = offsetX + keypoint.x * scale;
      let y = offsetY + keypoint.y * scale;

      if (part === enlargedPart) {
        // Get color from the canvas at this position
        let c = get(x, y);
        fill(c[0]+70,c[1]+70,c[2]+70);
        ellipse(x, y, 20, 20); // enlarge
      } else {
        fill(255,255, 0);
        ellipse(x, y, 4, 4); 
      }
    });
  });
}

function mousePressed() {
  if (faces.length > 0) {
    let face = faces[0];
    let parts = {
      lips: face.lips,
      leftEye: face.leftEye,
      rightEye: face.rightEye,
      faceOval: face.faceOval,
      leftEyebrow: face.leftEyebrow,
      rightEyebrow: face.rightEyebrow
    };

    // check if click on 
    for (let part in parts) {
      let { keypoints } = parts[part];

      for (let i = 0; i < keypoints.length; i++) {
        let keypoint = keypoints[i];
        let x = offsetX + keypoint.x * scale;
        let y = offsetY + keypoint.y * scale;
        let d = dist(mouseX, mouseY, x, y);

        if (d < 10) { // Adjust sensitivity (clicking)
          enlargedPart = part; // Store the name of the facial part
          return;
        }
      }
    }
  }
}


function centerFull(myCamera) {
  vidWidth = myCamera.elt.videoWidth;
  vidHeight = myCamera.elt.videoHeight;

  let scaleX = width / vidWidth;
  let scaleY = height / vidHeight;

  scale = Math.max(scaleX, scaleY);

  newWidth = vidWidth * scale;
  newHeight = vidHeight * scale;

  offsetX = (width - newWidth) / 2;
  offsetY = (height - newHeight) / 2;

  image(myCamera, offsetX, offsetY, newWidth, newHeight);
}