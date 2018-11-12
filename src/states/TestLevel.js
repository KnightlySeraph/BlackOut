/* globals __DEV__ */

// Import the entire 'phaser' namespace
import Phaser from 'phaser'
import P2 from 'p2'

// Import the main player sprite
import MainPlayer from '../sprites/Player'
import Platform from '../sprites/Platform' // Import Platforms
import Lever from '../sprites/Lever' // import Levers
import Jumper from '../sprites/Jumper' // import Springs

// Import config settings
import config from '../config'

// Import the filters for the scene
import PlayerLightFilter from '../Shaders/PlayerLightFilter'
import RadialLightFilter from '../Shaders/RadialLightFilter'
import MovingPlatform from '../sprites/MovingPlatform'

/**
 * The TestLevel game state. This game state is a simple test level showing a main
 * player sprite that can be roughly controlled with the left, right, and shift keys.
 * It also displays some text, shows how to display debugging info properly, and
 * sequences and plays some background music and sound FX. Level can usually occur
 * more than once during a play session so assume this state CAN be re-entered. All
 * assets are pre-loaded and cached in the Splash state so this must have run once
 * before loading this state.
 *
 * See Phaser.State for more about game states.
 */
var timerTesting = 150.0
var lightSize = 0
var blink = 0
class TestLevel extends Phaser.State {
  init () {
    // Set / Reset world bounds (based off of world bounds)
    this.game.world.setBounds(0, 0, 2440, 768)
  }

  preload () {
    console.log('preload has run once')
    this.game.load.image('light', 'assets/images/light.png')
  }

  create () {
    // this.map = this.game.add.tilemap('Mytilemap')
    // this.map.addTilesetImage('tiles1', 'tiles1')
    // this.map.addTilesetImage('tiles2', 'tiles2')
    
    // this.layer3 = this.map.createLayer('bg_black')
    // this.layer2 = this.map.createLayer('bg_close')
    // this.layer1 = this.map.createLayer('bg_decor')
    // this.layer0 = this.map.createLayer('main_level')

    // this.layer0.resizeWorld()
    // this.layer1.resizeWorld()
    // this.layer2.resizeWorld()
    // this.layer3.resizeWorld()

    // Create and add the main player object
    this.player = new MainPlayer({
      game: this.game,
      x: this.world.centerX,
      y: this.world.centerY + 32
    })

    this.isWinding = false

    // Testing particles
    this.emit = this.game.add.emitter(this.game.world.centerX, 300, 700)
    this.emit.makeParticles('light')
    this.emit.setRotation(0, 360)
    this.emit.setAlpha(0.5, 0.1, 2000)
    this.emit.setScale(1.0, 1.0)
    this.emit.blendMode = 'ADD'
    // this.emit.particleDrag = { x: 0, y: -100 }
    this.emit.bounce = 0.5
    this.emit.gravity = 50
    

    this.emit.start(true, 0, null, 5000)

    // Compute a reasonable height for the floor based on the height of the player sprite
    let floorHeight = this.player.bottom

    // Create the "floor" as a manually drawn rectangle
    // this.floor = this.game.add.graphics(0, 0)
    // this.floor.beginFill(0x5e7ca0)
    // this.floor.drawRect(0, floorHeight, this.game.world.width, this.game.world.height * 2)
    // this.floor.endFill()
    this.timer = new Phaser.Timer(this.game)
    this.timer.add(4000, this.consoleLogDebug, this)
    this.timer.start()
    // this.floor.body.setRectangle(this.game.world.width, this.game.world.height * 2)
    this.platforms = [
      new Platform({
        game: this.game, x: 500, y: 575, width: 200, height: 50, id: 3
      }),

      // Side Platforms to mimic World Bounds while they are "broken"
      new Platform({ // Temp Ground
        game: this.game, x: this.game.world.width / 2, y: this.game.world.height, width: this.game.world.width, height: 100, id: 0
      }),
      new Platform({ // Right Side Wall
        game: this.game, x: 20, y: this.game.world.height - 100, width: 50, height: this.world.height + 10000, id: 1
      }),
      new Platform({ // Left Side Wall
        game: this.game, x: this.game.world.width, y: this.game.world.height - 100, width: 50, height: this.world.height + 10000, id: 2
      })
    ]
    this.platforms.forEach((obj) => { // forEach(function()) is like a for loop call
      this.game.add.existing(obj)
    })

    // Make Levers that can be interacted with
    this.lever = [
      new Lever({
        game: this.game, x: 1000, y: 670, width: 50, height: 100, id: 4, spriteKey: 'blank'
      }),
      new Lever({
        game: this.game, x: 1200, y: 670, width: 50, height: 100, id: 5, spriteKey: 'blank'
      })
    ]
    this.lever.forEach((obj) => {
      this.game.add.existing(obj)
    })

    // Make "Spring" objects in the world
    this.jumper = [
      new Jumper({
        game: this.game, x: 800, y: 695, width: 50, height: 50, id: 1
      })
    ]
    this.jumper.forEach((obj) => {
      this.game.add.existing(obj)
    })

    // Make MovingPlatform objects in the world
    this.autoMover = [
      new MovingPlatform({
        game: this.game, x: 2000, y: 660, width: 150, height: 50, id: 2, maxVelocity: 200
      })
    ]
    this.autoMover.forEach((obj) => {
      this.game.add.existing(obj)
      obj.startMovement()
    })

    // Add player after the floor
    this.game.add.existing(this.player)

    // Setup all the text displayed on screen
    // this.setupText(floorHeight)

    // Start playing the background music
    this.game.sounds.play('Rock_Intro_1', config.MUSIC_VOLUME)

    // Setup the key objects
    this.setupKeyboard()

    // Creates the Shader
    this.setupShader()
    // Lighting vars, must be made here in every level that uses the lighting system
    this.socket2Toggle = false
    this.socket3Toggle = false
    this.socket4Toggle = false
    this.socket5Toggle = false
    this.socket2Size = 150.0
    this.socket3Size = 150.0
    this.socket4Size = 150.0
    this.socket5Size = 150.0
    this.socket2Rate = 0.1
    this.socket3Rate = 0.1
    this.socket4Rate = 0.1
    this.socket5Rate = 0.1

    // Set up a camera to follow the player
    this.game.camera.follow(this.player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1)
  }

  // This is the function called to set up GLSL Shaders and add them to the world
  setupShader () {
    // Make the Shader Filter
    this.radialLight = new RadialLightFilter(this.game)
    this.radialLight.timedDistance = 50
    this.game.world.filters = [ this.radialLight ]

    // this.radialLight.moveSocket2(this.toScreenSpace({ x: 1000, y: 500 }))
  }

  consoleLogDebug () {
    console.log('Timers are working')
  }

  toScreenSpace (point) {
    return {
      x: point.x - this.world.camera.x,
      y: this.world.height - (point.y - this.world.camera.y)
    }
  }

  setLightPos (posX, posY) {
    return {
      x: posX - this.world.camera.x,
      y: posY + this.world.camera.y
    }
  }

  toWorldSpace (point) {
    return {
      x: this.world.camera.x - point.x,
      y: (point.y - this.world.camera.y) - this.world.height
    }
  }

  decrementNumber (num, rate) {
    while (num > 0) {
      num -= rate
      console.log(num)
    }
  }

  setupText (floorHeight) {
    // Title message to show on screen
    const bannerText = 'UW Stout / GDD 325 - 2D Web Game Base'
    let banner = this.add.text(this.world.centerX, 180, bannerText)

    // Configure all the title message font properties
    banner.font = 'Libre Franklin'
    banner.padding.set(10, 16)
    banner.fontSize = 30
    banner.fontWeight = 'bolder'
    banner.stroke = '#FFFFFF'
    banner.strokeThickness = 1
    banner.fill = '#012169'
    banner.anchor.setTo(0.5)

    // Control message to show on screen
    const controlText = 'L & R arrow -- walk\n' +
                        '      SHIFT -- hold to run'
    let controls = this.add.text(this.game.width - 100, floorHeight + 60, controlText)

    // Configure all the control message font properties
    controls.font = 'Courier'
    controls.padding.set(10, 0)
    controls.fontSize = 18
    controls.fill = '#000000'
    controls.anchor.setTo(1.0, 0)

    // Credits message to show on screen
    const creditsText = 'Based on "The Great Tsunami Theif":\n' +
                        '     Colton Barto -- Programming\n' +
                        ' Nicole Fairchild -- Art\n' +
                        '   Maria Kastello -- Programming\n' +
                        '     Austin Lewer -- Art\n' +
                        '    Austin Martin -- Music\n' +
                        '    Cole Robinson -- Programming\n' +
                        '       Shane Yach -- Programming'

    // Configure all the credits message font properties
    let credits = this.add.text(100, floorHeight + 20, creditsText)
    credits.font = 'Courier'
    credits.padding.set(10, 0)
    credits.fontSize = 14
    credits.fill = '#999999' // '#000000'
    credits.setShadow(1, 1, 'rgba(0,0,0,0.5)', 2)
    credits.anchor.setTo(0, 0)

    // Sets Credits to follow the camera
    credits.fixedToCamera = true
    credits.cameraOffset.setTo(500, floorHeight - 30)
  }

  setupKeyboard () {
    // Register the keys
    this.leftKey = this.game.input.keyboard.addKey(Phaser.KeyCode.LEFT)
    this.rightKey = this.game.input.keyboard.addKey(Phaser.KeyCode.RIGHT)

    this.jumpKey = this.game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR)

    this.dim = this.game.input.keyboard.addKey(Phaser.KeyCode.Q)
    this.logInfo = this.game.input.keyboard.addKey(Phaser.KeyCode.D)
    this.interact = this.game.input.keyboard.addKey(Phaser.KeyCode.E)

    // Wind Clock with lshift
    this.clock = this.game.input.keyboard.addKey(Phaser.KeyCode.TAB)
    // Light Testing Inputs
    this.socket2 = this.game.input.keyboard.addKey(Phaser.KeyCode.TWO)
    this.debugLight = this.game.input.keyboard.addKey(Phaser.KeyCode.THREE)

    // Stop the following keys from propagating up to the browser
    this.game.input.keyboard.addKeyCapture([
      Phaser.KeyCode.LEFT, Phaser.KeyCode.RIGHT, Phaser.KeyCode.SPACEBAR, Phaser.KeyCode.D, Phaser.KeyCode.P, Phaser.KeyCode.O, Phaser.KeyCode.E, Phaser.KeyCode.TAB, Phaser.KeyCode.TWO
    ])
  }

  update () {
    // Check state of keys to control main character
    let speed = 0
    if (this.rightKey.isDown) { speed++ }
    if (this.leftKey.isDown) { speed-- }

    if (speed !== 0) {
      this.autoMover.forEach((obj) => {
        obj.changeOffset(speed * 5)
      })
    }

    if (this.jumpKey.isDown && this.player.touching(0, 1)) {
      this.player.overrideState = MainPlayer.overrideStates.JUMPING
    }

    // else if (MainPlayer.isSpring === true) { this.player.overrideState = MainPlayer.overrideStates.JUMPING }
    else {
      if (this.player.overrideState !== MainPlayer.overrideStates.WINDING) {
        // Update sprite facing direction
        if (speed > 0 && !this.player.isFacingRight()) {
          this.player.makeFaceRight()
        } else if (speed < 0 && !this.player.isFacingLeft()) {
          this.player.makeFaceLeft()
        }

        // Update sprite movement state and playing audio
        if (Math.abs(speed) > 0) {
          this.player.moveState = MainPlayer.moveStates.WALKING
        } else {
          this.player.moveState = MainPlayer.moveStates.STOPPED
        }
      }
    }
    // Toggle shader off/on
    if (!this.game.world.filters) {
      if (this.dim.justPressed()) {
        let screenSpacePos = this.toScreenSpace(
          { x: this.player.world.x, y: this.player.world.y + this.player.height / 2 }
        )
        this.radialLight.moveLight(screenSpacePos)
        this.game.world.filters = [this.radialLight]
        console.log('Shader Enabled')
      }
    } else {
      if (this.dim.justPressed()) {
        this.game.world.filters = null
        console.log('Shader Disabled')
      } else {
        let screenSpacePos = this.toScreenSpace(
          { x: this.player.world.x, y: this.player.world.y + this.player.height / 2 }
        )
        this.radialLight.moveLight(screenSpacePos)
        // this.radialLight.varyDist = 50
      }
    }

    // this.radialLight.moveSocket2(
    //   this.setLightPos({ x: 50, y: 50 })
    // )

    // Testing a numbers deacrese rate
    if (timerTesting > 0) {
      timerTesting -= 0.1
      this.radialLight.timedDistance = timerTesting
      // console.log(timerTesting)
    }
    // interactable button
    if (this.interact.justPressed()) {
      this.player.interact()
    }

    if (this.clock.justPressed() && this.player.touching(0, 1) && speed === 0) {
      this.player.overrideState = MainPlayer.overrideStates.WINDING
      this.isWinding = true
    }

    if (this.player.overrideState === MainPlayer.overrideStates.WINDING) {
      if (!this.clock.isDown) {
        this.isWinding = false
        this.player.overrideState = MainPlayer.overrideStates.NONE
      }
    }

    // create light on the player when shift is pressed
    if (timerTesting < 150.0) {
      if (this.isWinding) {
        timerTesting += 0.7
      }
    }
    if (timerTesting <= 0.0) {
      lightSize = 0
    } else if (timerTesting <= 50.0) {
      lightSize = 1
    } else if (timerTesting <= 75.0) {
      lightSize = 2
    } else if (timerTesting <= 100.0) {
      lightSize = 3
    } else if (timerTesting <= 125.0) {
      lightSize = 4
    } else {
      lightSize = 5
    }
    // blink light
    blink++
    if (lightSize !== 1) {
      if (blink > 30) {
        blink = 0
        lightSize = 0
      }
    } else {
      if (blink > 10) {
        blink = 0
        lightSize = 0
      }
    }
    // update the player light source
    if (lightSize === 5) {
      this.radialLight.timedDistance = 150.0
    } else if (lightSize === 4) {
      this.radialLight.timedDistance = 125.0
    } else if (lightSize === 3) {
      this.radialLight.timedDistance = 100.0
    } else if (lightSize === 2) {
      this.radialLight.timedDistance = 75.0
    } else if (lightSize === 1) {
      this.radialLight.timedDistance = 50.0
    } else {
      this.radialLight.timedDistance = 0.0
    }

    // Seperate from the player light, turn on socket 2
    if (this.socket2.justPressed()) {
      // Console out the two was pressed
      console.log('Two was pressed')
      // Turn Socket 2 on/off
      if (this.socket2Toggle) {
        this.radialLight.socket2 = 0
        this.socket2Toggle = false
      } else {
        this.radialLight.socket2 = 1
        console.log('Turning Socket 2 on')
        this.socket2Toggle = true
        this.radialLight.socket3 = 1
        this.radialLight.socket4 = 1
        this.radialLight.socket5 = 1
      }

      let screenSpacePos = this.setLightPos(0, 0)

      this.radialLight.moveSocket2(screenSpacePos)

      console.log('Camera Height is ' + this.game.camera.height + '   Camera Width is ' + this.game.camera.width)
      console.log('Location of the camera is (' + this.world.camera.x + ', ' + this.world.camera.y + ')')
      console.log('Location of the player is (' + this.player.world.x + ', ' + this.player.world.y + ')')
      console.log('Size of the world is Height: ' + this.world.height + ' Width: ' + this.world.width)
      console.log('Player height is' + this.player.height)

      // this.radialLight.moveSocket2([this.player.world.x, this.player.world.y + this.player.height / 2])
    }
    if (this.socket2Toggle) {
      this.radialLight.moveSocket2(this.setLightPos(1240, 200))
      this.radialLight.moveSocket3(this.setLightPos(1000, 150))
      this.radialLight.moveSocket4(this.setLightPos(1350, 150))
      this.radialLight.moveSocket5(this.setLightPos(1550, 150))
      console.log('setting light')
    }

    if (this.debugLight.justPressed()) {
      this.radialLight.createLight(500, 150, 40, 40)
    }

    // let lightPos = this.setLightPos(0, 0)
    // this.radialLight.moveSocket2(lightPos)

    // update lights
    // This block of code uses the update function to
    // drive certain timed events, such as light fade
    // and must be in all updates the use the create light function
    if (this.radialLight.socket2) {

    }
    if (this.radialLight.socket3) {

    }
    if (this.radialLight.socket4) {

    }
    if (this.radialLight.socket5) {

    }
  }

  render () {
    // Optionally render some development/debugging info
    if (__DEV__) {
      // Print info about the player sprite at (32, 32) -> top left
      this.game.debug.spriteInfo(this.player, 32, 32)

      // Print some text about the player state machine
      this.game.debug.text(`Movement State: ${this.player.moveState}`, this.game.width - 350, 32)
      this.game.debug.text(`Override State: ${this.player.overrideState}`, this.game.width - 350, 48)

      // Print a warning that the game is running in DEV/Debug mode
      this.game.debug.text('DEV BUILD', this.game.width - 100, this.game.height - 10, '#AA0000')

      // console.log(`Camera: (${this.world.camera.position.x}, ${this.world.camera.position.y})`)
      // console.log(`Player: (${this.player.world.x}, ${this.player.world.y})`)
    }
  }
}

// Expose the class TestLevel to other files
export default TestLevel
