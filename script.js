kaboom.import()

loadSprite("bg", "./assets/tiles and background_foreground/background.png")
loadSprite("ground", "./assets/tiles and background_foreground/tileset.png", {
  sliceX: 4,
  sliceY: 6,
  anims: {
    ground: [14],
  },
})
loadSprite(
  "hero",
  "./assets/herochar sprites(new)/herochar_spritesheet(new).png",
  {
    sliceX: 8,
    sliceY: 15,
    anims: {
      idle: [40, 43],
      jump: [56, 58],
      run: [8, 13],
    },
  }
)
loadSprite(
  "coin",
  "./assets/miscellaneous sprites/coin_anim_strip_6.png",
  {
    sliceX: 6,
    sliceY: 1,
    anims: {
      spin: [0, 5],
    },
  }
)
loadSprite("trap", "./assets/miscellaneous sprites/trap_suspended_anim.gif")

init({
  width: 480,
  height: 300,
  //   fullscreen: true,
  scale: 2,
})

scene("main", () => {
  /*********** ENVIROMENT ************/
  add([sprite("bg"), scale(width() / 240, height() / 150), origin("topleft")])

  const map = addLevel(
    [
      "                   ",
      "                   ",
      "                   ",
      "                  =",
      "   ?       *     = ",
      "         =  ^^ =   ",
      "===================",
    ],
    {
      width: 30,
      height: 50,
      pos: vec2(0, 0),
      // every "=" on the map above will be turned to a game object with following comps
      "=": [sprite("ground"), solid(), "block"],
      "*": [sprite("coin"), solid(), "block"],
      // use a callback for dynamic evauations per block
      "?": () => {
        return [sprite("prize"), color(0, 1, rand(0, 1)), "block"]
      },
      "^": [sprite("spike"), solid(), "spike", "block"],
    }
  )

  /*********** PLAYER ************/
  const JUMP_FORCE = 340
  const HERO_SPEED = 100

  const hero = add([
    sprite("hero", {
      animSpeed: 0.2,
      frame: 40,
    }),
    pos(80, 300),
    body(),
  ])

  /*********** CAMERA ************/
  //   campos(vec2(0, 0))

  //   center camera to player
  hero.action(() => {
    campos(-hero.pos.x + width() / 2, 0)
    // camscale(1, 1)
  })
  console.log(hero)

  /*********** PLAYER MOVING ************/
  hero.play("idle")

  keyPress("up", () => {
    if (hero.grounded()) {
      hero.jump(JUMP_FORCE)
      hero.play("jump")
    }
  })

  keyRelease("up", () => {
    if (keyIsDown("right")) {
      hero.play("run")
      hero.use(scale(1, 1))
    } else if (keyIsDown("left")) {
      hero.play("run")
      hero.use(scale(-1, 1))
    } else {
      hero.play("idle")
    }
  })

  keyDown("right", () => {
    hero.move(HERO_SPEED, 50)
  })

  keyPress("right", () => {
    hero.use(scale(1, 1))
    hero.play("run")
  })

  keyRelease("right", () => {
    hero.play("idle")
  })

  keyDown("left", () => {
    hero.move(-HERO_SPEED, 50)
  })

  keyPress("left", () => {
    hero.use(scale(-1, 1))
    hero.play("run")
  })

  keyRelease("left", () => {
    hero.play("idle")
  })

  hero.action(() => {
    if (hero.pos.y >= height()) {
      go("gameover")
    }
  })

  hero.collides("trap", () => {
    go("gameover")
  })

  const TRAP_OPEN = 120
  const TRAP_SPEED = 90

  // loop(1.5, () => {
  //     const trapPos = rand(0, height() - TRAP_OPEN)

  //     add([
  //         sprite("trap"),
  //         origin("bot"),
  //         pos(width(), trapPos),
  //         "trap",
  //     ])

  //     add([
  //         sprite("trap"),
  //         origin("bot"),
  //         pos(width(), trapPos + TRAP_OPEN),
  //         scale(1, -1),
  //         "trap"
  //     ])
  // })

  //   add([
  //     rect(width(), 10),
  //     pos(0, height()),
  //     origin("topleft"),
  //     solid(),
  //     "floor",
  //   ])

  // action("trap", pipe => {
  //     pipe.move(-TRAP_SPEED, 0)
  // })
})

scene("gameover", () => {
  add([text("you lose!", 24), pos(width() / 2, height() / 2)])

  keyPress("space", () => {
    go("main")
  })
})

start("main")
