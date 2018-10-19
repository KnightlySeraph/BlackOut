/* globals __DEV__ */

// Import the entire 'phaser' namespace
import Phaser from 'phaser'
import P2 from 'p2'

// Import the main player sprite
import MainPlayer from '../sprites/Player'
import Platform from '../sprites/Platform'
import Lever from '../sprites/Lever'

// Import config settings
import config from '../config'

// Import the filters for the scene
import PlayerLightFilter from '../Shaders/PlayerLightFilter'
import RadialLightFilter from '../Shaders/RadialLightFilter'

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
class TestLevel extends Phaser.State {
  init () {
    // Set / Reset world bounds (based off of world bounds)
    this.game.world.setBounds(0, 0, 2440, 768)
  }

  preload () {
    console.log('preload has run once')
  }

  create () {
    // Create and add the main player object
    this.player = new MainPlayer({
      game: this.game,
      x: this.world.centerX,
      y: this.world.centerY + 32
    })

    // Compute a reasonable height for the floor based on the height of the player sprite
    let floorHeight = this.player.bottom

    // Create the "floor" as a manually drawn rectangle
    // this.floor = this.game.add.graphics(0, 0)
    // this.floor.beginFill(0x5e7ca0)
    // this.floor.drawRect(0, floorHeight, this.game.world.width, this.game.world.height * 2)
    // this.floor.endFill()

    // this.floor.body.setRectangle(this.game.world.width, this.game.world.height * 2)
    this.platforms = [
      new Platform({
        game: this.game, x: 500, y: 575, width: 200, height: 50
      }),

      // Side Platforms to mimic World Bounds while they are "broken"
      new Platform({ // Temp Ground
        game: this.game, x: this.game.world.width / 2, y: this.game.world.height, width: this.game.world.width, height: 100
      }),
      new Platform({ // Right Side Wall
        game: this.game, x: 20, y: this.game.world.height - 100, width: 50, height: this.world.height + 10000
      }),
      new Platform({ // Left Side Wall
        game: this.game, x: this.game.world.width, y: this.game.world.height - 100, width: 50, height: this.world.height + 10000
      })
    ]

    this.platforms.forEach((plat) => { // forEach(function()) is like a for loop call
      this.game.add.existing(plat)
    })

    // Make Levers that can be interacted with
    this.lever = [
      new Lever({
        game: this.game, x: 1000, y: 670, width: 50, height: 100
      })
    ]

    this.lever.forEach((Lever) => {
      this.game.add.existing(Lever)
    })

    // Add player after the floor
    this.game.add.existing(this.player)

    // Setup all the text displayed on screen
    this.setupText(floorHeight)

    // Start playing the background music
    this.game.sounds.play('Rock_Intro_1', config.MUSIC_VOLUME)

    // Setup the key objects
    this.setupKeyboard()

    // Broken do not turn on
    this.setupShader()

    // Set up a camera to follow the player
    this.game.camera.follow(this.player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1)
  }

  // This is the function called to set up GLSL Shaders and add them to the world
  setupShader () {
    // Make the Shader Filter
    this.radialLight = new RadialLightFilter(this.game)
    this.game.world.filters = [ this.radialLight ]

    // Make the filter
    // this.shadowFilter = new Shadows(this.game)
    // this.shadowFilter.darkness = -0.3
    // this.shadowFilter.PlayerLocationX = this.player.x
    // this.shadowFilter.PlayerLocationY = this.player.y
    // this.shadowFilter.screenHeight = this.game.height
    // this.shadowFilter.screenWidth = this.game.width
    // this.game.world.filters = [this.shadowFilter]
    // this.playerLight = new PlayerLightFilter(this.game)
    // this.player.filters = [this.playerLight]

    // new attempt
    // add player light before main shader
    // this.game.world.filters = [this.shadowFilter]
    // this.player.filters = [this.playerLight]
    // this.playerLight.locationX = this.player.x
    // this.playerLight.locationY = this.player.y
    // this.game.world.filters = [this.shadowFilter]
  }

  toScreenSpace (point) {
    return {
      x: point.x - this.world.camera.x,
      y: this.world.height - (point.y - this.world.camera.y)
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
    // remove sprint key later
    this.sprintKey = this.game.input.keyboard.addKey(Phaser.KeyCode.SHIFT)
    this.jumpKey = this.game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR)

    this.dim = this.game.input.keyboard.addKey(Phaser.KeyCode.Q)
    this.logInfo = this.game.input.keyboard.addKey(Phaser.KeyCode.D)
    this.interact = this.game.input.keyboard.addKey(Phaser.KeyCode.E)

    // Stop the following keys from propagating up to the browser
    this.game.input.keyboard.addKeyCapture([
      Phaser.KeyCode.LEFT, Phaser.KeyCode.RIGHT, Phaser.KeyCode.SHIFT, Phaser.KeyCode.SPACEBAR, Phaser.KeyCode.D, Phaser.KeyCode.P, Phaser.KeyCode.O, Phaser.KeyCode.E
    ])
  }

  update () {
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
      }
    }

    // Check state of keys to control main character
    let speed = 0
    if (this.rightKey.isDown) { speed++ }
    if (this.leftKey.isDown) { speed-- }
    // remove sprint key later
    if (this.sprintKey.isDown) { speed *= 2 }

    if (this.jumpKey.isDown && this.player.touching(0, 1)) {
      this.player.overrideState = MainPlayer.overrideStates.JUMPING
    } else {
      // Update sprite facing direction
      if (speed > 0 && !this.player.isFacingRight()) {
        this.player.makeFaceRight()
      } else if (speed < 0 && !this.player.isFacingLeft()) {
        this.player.makeFaceLeft()
      }

      // Update sprite movement state and playing audio
      if (Math.abs(speed) > 1) {
        // Player is running
        this.player.moveState = MainPlayer.moveStates.RUNNING
        if (!this.game.sounds.get('running').isPlaying) {
          this.game.sounds.play('running', config.SFX_VOLUME)
        }
      } else {
        // Player is walking or stopped
        this.game.sounds.stop('running')
        if (Math.abs(speed) > 0) {
          this.player.moveState = MainPlayer.moveStates.WALKING
        } else {
          this.player.moveState = MainPlayer.moveStates.STOPPED
        }
      }
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
