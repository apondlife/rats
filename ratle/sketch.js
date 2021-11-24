const WIDTH = 600.0
const HEIGHT = 800.0

let g_background
let g_drawing
let referenceImage

let lastPosition


let state = {
  hasBackground: true,
  isDrawing: false,
  lastDrawing: false,
  pickedColor: null,
  lastPosition: null
}

function preload() {
  referenceImage = loadImage('img/me.jpg');
}

function setup() {
  createCanvas(WIDTH, HEIGHT);
  g_drawing = createGraphics(WIDTH, HEIGHT)
  g_background = createGraphics(WIDTH, HEIGHT)

  g_background.background(referenceImage);
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
    if(state.pickedColor == null) {
      const refX = Math.floor(mouseX * referenceImage.width/WIDTH)
      const refY = Math.floor(mouseY * referenceImage.height / HEIGHT)
      state.pickedColor = referenceImage.get(refX, refY)
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
}

function keyPressed() {
  console.log(keyCode)
  if (keyCode === 82) { // R
    state.hasBackground = !state.hasBackground
  }
}
