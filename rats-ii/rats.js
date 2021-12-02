import { Vector, Box } from "../lib/flatten.min.js"

function main() {
  const game = new Game()
  game.start()
}

class Rat {
  // members
  // desired position
  constructor(pos = new Vector(0, 0)) {
    this.pos = pos
    this.target = pos
    this.speed = 1
    this.size = new Vector(100, 50)
  }

  setTarget(target) {
    this.target = target
  }

  update(delta) {
    const dir = this.target.subtract(this.pos)

    // if dir is 0, flatten library has an error when we normalize
    if (dir.length > 0.01) {
      const dist = Math.min(this.speed * delta, dir.length)
      this.pos = this.pos.add(dir.normalize().multiply(dist))
    }
  }
}

class Game {
  constructor() {
    const $el = document.getElementById("game-canvas")

    // get canvas props
    this.$el = $el
    this.ctx = $el.getContext("2d")

    // the rats
    this.rats = [new Rat()]

    // get sprites
    this.sprites = {
      rat: [
        document.getElementById("rat-sprite-0"),
        document.getElementById("rat-sprite-1"),
      ]
    }
  }

  start() {
    this.bindEvents()

    requestAnimationFrame((time) => {
      this.time = time
      this.loop(time)
    })
  }

  bindEvents() {
    const $el = this.$el
    const mouse = {
      leftButton: false,
      rightButton: false
    }

    function getMouseVector(e) {
      return new Vector(
        e.offsetX * ($el.width / $el.clientWidth),
        e.offsetY * ($el.height / $el.clientHeight)
      )
    }

    $el.addEventListener("mouseup", e => {
      const target = getMouseVector(e)
      if(e.button == 0) {
        mouse.leftButton = false
      }

      if (e.button == 2) {
        mouse.rightButton = false
      }
    })

    $el.addEventListener("mousedown", e => {
      const mousePos = getMouseVector(e)

      // LEFT MOUSE BUTTON
      if (e.button == 0) {
        mouse.leftButton = true
        this.rats.push(new Rat(mousePos))
      }

      // RIGHT MOUSE BUTTON
      else if (e.button == 2) {
        mouse.rightButton = true

        const l = this.rats.length
        const s = Math.floor(Math.sqrt(l))
        const step = 30.0
        const noise = 70.0

        let i = 0
        for (const rat of shuffle(this.rats)) {
          const noiseX = (Math.random() * 2 - 1) * noise;
          const noiseY = (Math.random() * 2 - 1) * noise;

          const target = mousePos.add(new Vector(
            (Math.floor(i / s) - s / 2) * step + noiseX,
            (Math.floor(i % s) - s / 2) * step + noiseY
          ))

          rat.setTarget(target);
          i++
        }
      }
    });

    $el.addEventListener("mousemove", e => {
      const target = getMouseVector(e)
      if(mouse.leftButton) {
        this.rats.push(new Rat(target))
      }
    });
  }

  loop = (time) => {
    const delta = time - this.time
    this.time = time

    this.update(delta)
    this.draw()

    requestAnimationFrame(this.loop)
  }

  update(delta) {
    for(const rat of this.rats) {
      rat.update(delta)
    }
  }

  draw() {
    const $el = this.$el
    const ctx = this.ctx

    // draw bg
    ctx.fillStyle = "green"
    ctx.fillRect(0, 0, $el.width, $el.height)

    // draw rats
    const sprite = this.sprites.rat
    const frame = Math.floor((this.time / 100.0) % sprite.length)
    for(const rat of this.rats) {
      ctx.drawImage(sprite[frame], rat.pos.x, rat.pos.y, rat.size.x, rat.size.y)
    }
  }
}

main()


// LIBRATY

function shuffle(array) {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}