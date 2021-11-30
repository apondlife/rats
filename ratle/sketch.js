let WIDTH = 600.0
let HEIGHT = 800.0
const ASPECT = 4/5
const MAX_TIME_PER_STROKE = 0.01

let g_background
let g_drawing

let lastPosition


let state = {
  hasBackground: true,
  isDrawing: false,
  lastDrawing: false,
  pickedColor: null,
  position: null,
  lastPosition: null,
  timeSinceLastPick: 0,
  brushSize: 10,
  alpha: 0.5,
}

let initialImage
function preload() {
  referenceImage = loadImage('img/me.jpg');
}

function setup() {
  WIDTH = Math.min(windowWidth * 0.9, windowHeight * ASPECT * 0.95)
  HEIGHT = WIDTH / ASPECT
  // ASPECT = WIDTH / HEIGHT
  const canvas = createCanvas(WIDTH, HEIGHT);
  canvas.parent('canvas-container')
  canvas.id = 'canvas'

  g_drawing = createGraphics(WIDTH, HEIGHT)
  g_background = createGraphics(WIDTH, HEIGHT)
  g_background.background(referenceImage);

  document.getElementById('toggle-button').addEventListener('click', (event) => {
    state.hasBackground = !state.hasBackground
  })

  document.getElementById('download-button').addEventListener('click', (event) => {
      saveCanvas(`foto${new Date().getTime()}`, `png`)
  })

  document.getElementById('slider-size').addEventListener('change', (event) => {
    state.brushSize = lerp(0.0001, 20, event.target.value/100)
  })

  document.getElementById('slider-opacity').addEventListener('change', (event) => {
    state.alpha = lerp(0, 1, event.target.value/100)
  })

  document.getElementById('file-button').addEventListener('change', (event) => {
    const file = event.target.files[0]
    // Check if the file is an image.
    if (file.type && !file.type.startsWith('image/')) {
      console.log('File is not an image.', file.type, file);
      return;
    }

    const reader = new FileReader();
    reader.addEventListener('load', (event) => {
      loadImage(event.target.result, (img) => {
        const asp = float(img.width)/float(img.height)
        if(asp > 1)
          g_background.image(img, 0, 0, HEIGHT * asp, HEIGHT);
        else 
          g_background.image(img, 0, 0, WIDTH, WIDTH / asp);
      })
    });
    reader.readAsDataURL(file);
  });
}

function draw() {
  //update
  state.isDrawing = mouseIsPressed
  state.position = {x: mouseX, y: mouseY}

  // draw
  clear()
  if(state.hasBackground) {
    image(g_background, 0, 0)
  }

  if(state.isDrawing) {
    if(state.pickedColor == null || state.timeSinceLastPick > MAX_TIME_PER_STROKE) {
      state.pickedColor = g_background.get(state.position.x, state.position.y)
      state.pickedColor[3] = Math.floor(state.alpha * 255)
      state.timeSinceLastPick = 0
    }
    g_drawing.fill(state.pickedColor)
    if(state.lastPosition == null) {
      g_drawing.noStroke()
      // g_drawing.circle(state.position.x, state.position.y, state.brushSize);
    } else {
      g_drawing.strokeWeight(state.brushSize)
      g_drawing.stroke(state.pickedColor)
      // g_drawing.strokeCap(SQUARE)
      // g_drawing.strokeJoin(ROUND)
      g_drawing.line(state.lastPosition.x, state.lastPosition.y, state.position.x, state.position.y, 10);
    }
  }

  if(state.pickedColor != null) {
    fill(state.pickedColor)
    noStroke()
  } else {
    stroke(color(0, 0, 0))
    noFill()
  }
  circle(state.position.x, state.position.y, state.brushSize)
  image(g_drawing, 0, 0)

  // late update
  if(state.isDrawing) {
    state.lastPosition = {x: state.position.x, y: state.position.y}
  } else {
    state.lastPosition = null
    state.pickedColor = null
  }

  state.wasDrawing = state.isDrawing
  state.timeSinceLastPick += deltaTime
}

function keyPressed() {
  console.log(keyCode)
  if (keyCode === 82) { // R
    state.hasBackground = !state.hasBackground
  }
}

function lerp(a, b, n) {
  return (1 - n) * a + n * b;
}