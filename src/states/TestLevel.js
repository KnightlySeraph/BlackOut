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
import PitOfDeath from '../sprites/PitDeath'

import BasicMovingPlatform from '../sprites/BasicMovingPlatform'
import Elevator from '../sprites/Elevator'

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
// var lightSize = 0
// var blink = 0
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
    // fade in to level from black
    this.game.camera.flash('000000', 1000, false, 1)
    // Uncomment this section if you want the level to show up
    // Imports level
    this.map = this.game.add.tilemap('Mytilemap')
    this.map.addTilesetImage('tiles1', 'tiles1')
    // this.map = this.game.add.tilemap('FinalLevel')
    // this.map.addTilesetImage('tiles1t', 'tiles1t')

    // Uncomment this section if you want the level to show up
    // // Creates Layers
    this.layer3 = this.map.createLayer('bg_black')
    this.layer2 = this.map.createLayer('bg_close')
    this.layer1 = this.map.createLayer('bg_decor')
    this.layer0 = this.map.createLayer('main_level')

    // this.layer3 = this.map.createLayer('bg_black')
    // this.layer2 = this.map.createLayer('bg_far')
    // this.layer1 = this.map.createLayer('bg_close')
    // this.layer0 = this.map.createLayer('main_level')

    // Uncomment this section if you want the level to show up
    // Main collider
    let customCollider = this.map.objects['collision']
    customCollider.forEach(element => {
      this.Collider = this.game.add.sprite(element.x, element.y)
      this.game.physics.p2.enable(this.Collider)
      this.Collider.body.debug = __DEV__
      this.Collider.body.addPolygon({}, element.polygon)
      this.Collider.body.static = true
      this.Collider.body.setCollisionGroup(this.game.platformGroup)
      this.Collider.body.collides(this.game.playerGroup)
    })

    // Uncomment this section if you want the level to show up
    // // Resize the world to the layers
    this.layer0.resizeWorld()
    this.layer1.resizeWorld()
    this.layer2.resizeWorld()
    this.layer3.resizeWorld()

    // Creates the Shader
    this.setupShader()

    // Create and add the main player object
    this.player = new MainPlayer({
      game: this.game,
      x: this.world.centerX - 550,
      y: this.world.centerY - 100
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

    // this.emit.start(true, 0, null, 5000)

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
    // this.platforms = [
    //   new Platform({
    //     game: this.game, x: 500, y: 575, width: 200, height: 50, id: 3
    //   })//,

    // Side Platforms to mimic World Bounds while they are "broken"
    // new Platform({ // Temp Ground
    //   game: this.game, x: this.game.world.width / 2, y: this.game.world.height, width: this.game.world.width, height: 100, id: 0
    // }),
    // new Platform({ // Right Side Wall
    //   game: this.game, x: 20, y: this.game.world.height - 100, width: 50, height: this.world.height + 10000, id: 1
    // }),
    // new Platform({ // Left Side Wall
    //   game: this.game, x: this.game.world.width, y: this.game.world.height - 100, width: 50, height: this.world.height + 10000, id: 2
    // })
    // ]
    // this.platforms.forEach((obj) => { // forEach(function()) is like a for loop call
    //   this.game.add.existing(obj)
    // })

    // make the main elevator
    this.mover = [
      new Elevator({
        game: this.game, x: 500, y: 800, id: config.ELEVATOR_1, light: this.radialLight
      })
    ]
    this.mover.forEach((obj) => {
      this.game.add.existing(obj)
      Lever.movers[obj.id] = obj
    })

    // Make Levers that can be interacted with
    this.lever = [
      new Lever({
        game: this.game, x: 990, y: 998, width: 50, height: 100, id: config.ELEVATOR_1, spriteKey: 'LeverFloor', light: this.radialLight
      }),
      new Lever({
        game: this.game, x: 1300, y: 1000, width: 50, height: 100, id: config.ELEVATOR_1, spriteKey: 'LeverWall', light: this.radialLight
      })
    ]
    this.lever.forEach((obj) => {
      this.game.add.existing(obj)
    })

    // Make "Spring" objects in the world
    this.jumper = [
      new Jumper({
        game: this.game, x: 800, y: 1022, width: 50, height: 50, id: 1, light: this.radialLight
      })
    ]
    this.jumper.forEach((obj) => {
      this.game.add.existing(obj)
    })

    // Make "Death" objects in the world
    this.pits = [
      new PitOfDeath({
        game: this.game, x: 1000, y: 2055, width: 50000, height: this.game.world.height - 500, light: this.radialLight
      })
    ]
    this.pits.forEach((obj) => {
      this.game.add.existing(obj)
    })

    // Make MovingPlatform objects in the world
    this.autoMover = [
      new BasicMovingPlatform({
        game: this.game, x: 1200, y: 660, id: config.PLATFORM_1, light: this.radialLight
      }),
      new BasicMovingPlatform({
        game: this.game, x: 1000, y: 660, id: config.PLATFORM_2, light: this.radialLight
      }),
      new BasicMovingPlatform({
        game: this.game, x: 800, y: 660, id: config.PLATFORM_3, light: this.radialLight
      }),
      new BasicMovingPlatform({
        game: this.game, x: 600, y: 660, id: config.PLATFORM_4, light: this.radialLight
      })
    ]
    this.autoMover.forEach((obj) => {
      this.game.add.existing(obj)
      obj.startMovement()
    })

    // Add player after the floor
    this.game.add.existing(this.player)

    // Start playing the background music
    this.game.sounds.play('mainAmbience', config.MUSIC_VOLUME, true)

    // Setup the key objects
    this.setupKeyboard()

    // Set up a camera to follow the player
    // camera follows the player
    this.game.camera.follow(this.player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1)
  }

  // This is the function called to set up GLSL Shaders and add them to the world
  setupShader () {
    // Make the Shader Filter
    this.radialLight = new RadialLightFilter(this.game)
    this.radialLight.timedDistance = 50
    this.game.world.filters = [ this.radialLight ]
  }

  consoleLogDebug () {
    console.log('Timers are working')
  }

  toScreenSpace (point) {
    return {
      x: point.x - this.world.camera.x,
      y: this.world.height - (point.y - this.world.camera.y) - 500
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

  setupKeyboard () {
    // Register the keys
    this.leftKey = this.game.input.keyboard.addKey(Phaser.KeyCode.LEFT)
    this.rightKey = this.game.input.keyboard.addKey(Phaser.KeyCode.RIGHT)

    this.jumpKey = this.game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR)

    this.dim = this.game.input.keyboard.addKey(Phaser.KeyCode.Q)
    this.logInfo = this.game.input.keyboard.addKey(Phaser.KeyCode.D)
    this.interact = this.game.input.keyboard.addKey(Phaser.KeyCode.E)

    // Returns to main menu
    this.return = this.game.input.keyboard.addKey(Phaser.KeyCode.ESC)

    // Wind Clock with lshift
    this.clock = this.game.input.keyboard.addKey(Phaser.KeyCode.TAB)
    // Light Testing Inputs
    this.socket2 = this.game.input.keyboard.addKey(Phaser.KeyCode.TWO)
    this.debugLight = this.game.input.keyboard.addKey(Phaser.KeyCode.THREE)

    // Stop the following keys from propagating up to the browser
    this.game.input.keyboard.addKeyCapture([
      Phaser.KeyCode.LEFT, Phaser.KeyCode.RIGHT, Phaser.KeyCode.SPACEBAR, Phaser.KeyCode.D, Phaser.KeyCode.P, Phaser.KeyCode.O, Phaser.KeyCode.E, Phaser.KeyCode.TAB, Phaser.KeyCode.TWO, Phaser.KeyCode.ESC
    ])
  }

  update () {
    // Check state of keys to control main character
    let speed = 0
    if (this.rightKey.isDown) { speed++ }
    if (this.leftKey.isDown) { speed-- }

    // Enable the player to move on platforms
    if (speed !== 0) {
      this.autoMover.forEach((obj) => {
        obj.changeOffset(speed * 5)
      })
      this.mover.forEach((obj) => {
        obj.changeOffset(speed * 5)
      })
    }

    if (this.jumpKey.isDown && this.player.touching(0, 1)) {
      this.player.overrideState = MainPlayer.overrideStates.JUMPING
      if (this.game.sounds.get('walking2').isPlaying) {
        this.game.sounds.get('walking2', config.WALKING_VOLUME, false).stop()
      }
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
          //this.game.sounds.get('walking2').allowMultiple = true
          if (!this.game.sounds.get('walking2').isPlaying && MainPlayer.overrideStates.NONE /*&& (!MainPlayer.overrideStates.FALLING || !MainPlayer.overrideStates.JUMPING)*/) {
            this.game.sounds.play('walking2', config.WALKING_Volume, true)
          }
          else /*(this.game.sounds.get('walking2').isPlaying && !MainPlayer.overrideStates.NONE && !MainPlayer.moveStates.WALKING)*/ {
            this.game.sounds.get('walking2', config.WALKING_VOLUME, false).fadeOut(1000)
          }
        } else {
          this.player.moveState = MainPlayer.moveStates.STOPPED
          if (this.game.sounds.get('watchWind').isPlaying) {
            this.game.sounds.get('watchWind', config.SFX_Volume, false).fadeOut(1000)
          }
          if (this.game.sounds.get('walking2').isPlaying && (MainPlayer.overrideStates.FALLING || MainPlayer.overrideStates.JUMPING) && !MainPlayer.moveStates.WALKING) {
            this.game.sounds.get('walking2', config.WALKING_VOLUME, false).fadeOut(1000)
          }
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
          { x: this.player.world.x, y: this.player.world.y - this.player.height * 2 }
        )
        this.radialLight.moveLight(screenSpacePos)
        // this.radialLight.varyDist = 50
      }
    }

    // Return to main menu
    if (this.return.justPressed()) {
      this.game.world.setBounds(0, 0, this.game.width, this.game.height)
      this.state.start('MainMenu')
    }

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

    // Interactive light increase block, must exists in any level's update where the player exists
    if (this.radialLight.GetTimer() < 150.0) {
      if (this.isWinding) {
        this.radialLight.SetTimer(this.radialLight.GetTimer() + 0.7)
      }
      if (this.game.resetLight) {
        this.radialLight.SetTimer(150.0)
      }
    }
    // Absolutely vital to the lights working, do not remove this line
    this.radialLight.iterate()
    // Debug button bound to three, tests the createLight function
    if (this.debugLight.justPressed()) {
      this.radialLight.createLight(600, 100, 150.0, 0.1)
      this.radialLight.createLight(700, 100, 200.0, 0.1)
      this.radialLight.createLight(800, 100, 75.0, 0.1)
      this.radialLight.createLight(900, 100, 400.0, 1.5)
    }

    // let lightPos = this.setLightPos(0, 0)
    // this.radialLight.moveSocket2(lightPos)

    // Light Positioning Block ~ This must be in a level update, it keeps the lights situated in world space
    if (this.radialLight.socket2 === 1) {
      this.radialLight.moveSocket2(this.setLightPos(this.radialLight.passLoc2.x, this.radialLight.passLoc2.y))
    }
    if (this.radialLight.socket3 === 1) {
      this.radialLight.moveSocket3(this.setLightPos(this.radialLight.passLoc3.x, this.radialLight.passLoc3.y))
    }
    if (this.radialLight.socket4 === 1) {
      this.radialLight.moveSocket4(this.setLightPos(this.radialLight.passLoc4.x, this.radialLight.passLoc4.y))
    }
    if (this.radialLight.socket5 === 1) {
      this.radialLight.moveSocket5(this.setLightPos(this.radialLight.passLoc5.x, this.radialLight.passLoc5.y))
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
