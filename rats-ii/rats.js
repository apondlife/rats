import { Vector, Box } from "../lib/flatten.min.js"

function main() {
  const game = new Game()
  game.start()
}

class Sprite {
  constructor(elementId) {
    this.img = document.getElementById(elementId)
    const ox = this.img.getAttribute("ox") || 0
    const oy = this.img.getAttribute("oy") || 0
    this.baseSize = new Vector(this.img.width, this.img.height)
    this.offset = new Vector(
      parseFloat(ox), parseFloat(oy)
    )
  }

  draw(ctx, pos, size) {
    ctx.drawImage(
      this.img,
      pos.x - this.offset.x * size.x / this.baseSize.x,
      pos.y - this.offset.y * size.y / this.baseSize.y,
      size.x,
      size.y)
  }
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
    this.rats = []
    this.selection = null
    this.cheese = null
    this.cheeseTimeout = null

    // get sprites
    this.sprites = {
      rat: [
        new Sprite("rat-sprite-0"),
        new Sprite("rat-sprite-1"),
      ],
      background: new Sprite("background"),
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

        for (const rat of this.rats) {
          const p = rat.pos
          rat.selected = this.selection.intersect(new Box(p.x, p.y, p.x, p.y))
        }

        this.selection = null
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
        this.selection = new Box(mousePos.x, mousePos.y, mousePos.x, mousePos.y)
      }

      // RIGHT MOUSE BUTTON
      else if (e.button == 2) {
        mouse.rightButton = true

        const l = this.rats.length
        const s = Math.floor(Math.sqrt(l))
        const step = 30.0
        const noise = 70.0

        let i = 0
        this.cheese = mousePos.clone()
        this.cheeseTimeout = setTimeout(() => this.cheese = null, 1000)
        for (const rat of shuffle(this.rats.filter(r => r.selected))) {
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
      const mousePos = getMouseVector(e)
      if(mouse.leftButton) {
        // make selection work in any direction
        if(mousePos.x <= this.selection.xmin) {
          this.selection.xmin = mousePos.x
        } else {
          this.selection.xmax = mousePos.x
        }

        if(mousePos.y <= this.selection.ymin) {
          this.selection.ymin = mousePos.y;
        } else {
          this.selection.ymax = mousePos.y;
        }

        const randomPos = new Vector(
          this.selection.xmin + Math.random() * (this.selection.xmax - this.selection.xmin),
          this.selection.ymin + Math.random() * (this.selection.ymax - this.selection.ymin)
        )

        this.rats.push(new Rat(randomPos))
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
    this.sprites.background.draw(ctx, new Vector(0, 0), new Vector($el.width * 2, $el.height * 2))

    // draw selection box
    if (this.selection != null) {
      const s = this.selection

      ctx.strokeStyle = "yellow";
      ctx.lineWidth = "6";
      ctx.beginPath();
      ctx.rect(s.xmin, s.ymin, s.xmax - s.xmin, s.ymax - s.ymin)
      ctx.stroke();
    }

    // draw the cheese (rats target)
    if (this.cheese != null) {
      ctx.font = "30px Arial";
      ctx.fillText("🧀", this.cheese.x, this.cheese.y);
    }

    // draw rats
    const spriteSheet = this.sprites.rat
    const frame = Math.floor((this.time / 100.0) % spriteSheet.length)
    for(const rat of this.rats) {
      let sprite = spriteSheet[frame]
      if(!rat.selected) {
        sprite = spriteSheet[0]
      }
      sprite.draw(ctx, rat.pos, rat.size)
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