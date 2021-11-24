const WIDTH = 600.0
const HEIGHT = 800.0
const MAX_TIME_PER_STROKE = 0.01

let g_background
let g_drawing

let lastPosition


let state = {
  hasBackground: true,
  isDrawing: false,
  lastDrawing: false,
  pickedColor: null,
  lastPosition: null,
  timeSinceLastPick: 0,
  alpha: 0.5,
}

let initialImage
function preload() {
  referenceImage = loadImage('img/me.jpg');
}

function setup() {
  const canvas = createCanvas(WIDTH, HEIGHT);
  canvas.drop(onDropFile)
  g_drawing = createGraphics(WIDTH, HEIGHT)
  g_background = createGraphics(WIDTH, HEIGHT)
  g_background.background(referenceImage);
}

function onDropFile(file) {
// If it's an image file
  if (file.type === 'image') {
    // Create an image DOM element but don't show it
    const img = createImg(file.data).hide();
    g_background.image(img, 0, 0, WIDTH, HEIGHT);
  } else {
    alert('Not an image file!');
  }
}

function update() {

}

function draw() {
  //update
  state.isDrawing = mouseIsPressed

  // draw
  clear()
  if(state.hasBackground) {
    image(g_background, 0, 0)
  }

  if(state.isDrawing) {
    if(state.pickedColor == null || state.timeSinceLastPick > MAX_TIME_PER_STROKE) {
      state.pickedColor = g_background.get(mouseX, mouseY)
      state.pickedColor[3] = Math.floor(state.alpha * 255)
      state.timeSinceLastPick = 0
    }
    g_drawing.fill(state.pickedColor)
    const radius = 10
    if(state.lastPosition == null) {
      g_drawing.noStroke()
      g_drawing.circle(mouseX, mouseY, radius);
    } else {
      g_drawing.strokeWeight(radius)
      g_drawing.stroke(state.pickedColor)
      g_drawing.line(state.lastPosition.x, state.lastPosition.y, mouseX, mouseY, 10);
    }
  }

  image(g_drawing, 0, 0)

  // late update
  if(state.isDrawing) {
    state.lastPosition = {x: mouseX, y: mouseY}
  } else {
    state.lastPosition = null
    state.pickedColor = null
  }

  state.isDrawing = state.wasDrawing
  state.timeSinceLastPick += deltaTime
}

function keyPressed() {
  console.log(keyCode)
  if (keyCode === 82) { // R
    state.hasBackground = !state.hasBackground
  }
}
