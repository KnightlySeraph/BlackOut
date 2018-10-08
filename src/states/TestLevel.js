/* globals __DEV__ */

// Import the entire 'phaser' namespace
import Phaser from 'phaser'
import P2 from 'p2'
// Import the main player sprite
import MainPlayer from '../sprites/Player'

// Import config settings
import config from '../config'

// Import the filters for the scene
import Shadows from '../Shaders/Shadows'

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
    this.game.world.setBounds(0, 0, this.world.width, this.world.height)
    // Set the world bounds for how big the world is
    this.world.setBounds(0, 0, 2440, 768)
  }

  preload () {
    this.tweenRate = 3000
    console.log('preload has loaded once')
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
    this.floor = this.game.add.graphics(0, 0)
    this.floor.beginFill(0x5e7ca0)
    this.floor.drawRect(0, floorHeight, this.game.world.width, this.game.world.height * 2)
    this.floor.endFill()

    // this.floor.body.setRectangle(this.game.world.width, this.game.world.height * 2)
    this.platform = new Phaser.Sprite(this.game, 500, 500, 'blank')
    this.platform.body = new Phaser.Physics.P2.Body(this.game, this.platform, 500, 500)
    this.platform.body.dynamic = false
    this.platform.body.setRectangle(200, 50, 0, 0)
    this.platform.body.debug = __DEV__
    this.platform.scale.setTo(20, 5)
    this.platform.anchor.setTo(0.5, 0.5)
    this.game.add.existing(this.platform)

    this.platform1 = new Phaser.Sprite(this.game, 500, 500, 'blank')
    this.platform1.body = new Phaser.Physics.P2.Body(this.game, this.platform1, 750, 450)
    this.platform1.body.dynamic = false
    this.platform1.body.setRectangle(200, 50, 0, 0)
    this.platform1.body.debug = __DEV__
    this.platform1.body.setCollisionGroup([this.game.platformGroup])
    this.platform1.scale.setTo(20, 5)
    this.platform1.anchor.setTo(0.5, 0.5)
    this.game.add.existing(this.platform1)

    this.platform2 = new Phaser.Sprite(this.game, 1100, 700, 'blank')
    this.platform2.body = new Phaser.Physics.P2.Body(this.game, this.platform2, 1100, 700)
    this.platform2.body.dynamic = false
    this.platform2.body.setRectangle(100, 100, 0, 0) // Collider Box
    this.platform2.body.debug = __DEV__
    // this.platform2.body.data.isSensor = true
    this.platform2.body.setCollisionGroup(this.game.platformGroup)
    this.platform2.body.collides([this.game.playerGroup])

    this.platform2.scale.setTo(10, 10)
    this.platform2.anchor.setTo(0.5, 0.5)
    this.game.add.existing(this.platform2)

    // Add player after the floor
    this.game.add.existing(this.player)

    // Setup all the text displayed on screen
    this.setupText(floorHeight)

    // Start playing the background music
    this.game.sounds.play('Rock_Intro_1', config.MUSIC_VOLUME)

    // Setup the key objects
    this.setupKeyboard()

    // this.setupShader()

    // Set up a camera to follow the player
    this.game.camera.follow(this.player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1)
    this.setupShader()

    // Set up interact Key boolean
    var interacting = false

    // this.setupBitmap()

    // Create the 'Light' Around the player
    this.setupPlayerLighting()
  }

  // This is the function called to set up GLSL Shaders and add them to the world
  setupShader () {
    // Make the filter
    this.shadowFilter = new Shadows(this.game)
    this.shadowFilter.darkness = 1.0
    this.game.world.filters = [this.shadowFilter]
  }

  // Create a small light on the player
  setupPlayerLighting () {
    // bitmap approach
    // SETH: width and height here are important and should probably match player
    this.bmd = new Phaser.BitmapData(this.game, this.player.width, this.player.height)

    // Create Circles
    // SETH: Changed this to be centered at (100, 100)
    this.innerCircle = new Phaser.Circle(100, 100, 25)
    this.outerCircle = new Phaser.Circle(100, 100, 100)

    // SETH: Adding to world right on top of player
    this.bmdImage = this.bmd.addToWorld(
      this.player.x, this.player.y, 0.5, 0.5)

    // SETH: changed this to be centered at (100, 100)
    // SETH: this means the only value actually being tweened is radius
    // Setup the 'innerCircle' radius to smoothly change between 25 and 1
    this.game.add.tween(this.innerCircle).to(
      { x: 100, y: 100, radius: 1 },
      2500, Phaser.Easing.Circular.Out, true, 0, -1, true)
  }

  // setupBitmap () {
  //   this.darken = new Phaser.BitmapData(this.game, 'keystring', 256, 256)
  //   this.darken.blendDarken()
  //   this.darken.addToWorld()
  // }

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
    this.sprintKey = this.game.input.keyboard.addKey(Phaser.KeyCode.SHIFT)
    this.jumpKey = this.game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR)
    this.brighten = this.game.input.keyboard.addKey(Phaser.KeyCode.R)
    this.dim = this.game.input.keyboard.addKey(Phaser.KeyCode.Q)
    this.tweenFaster = this.game.input.keyboard.addKey(Phaser.KeyCode.P)
    this.tweenSlower = this.game.input.keyboard.addKey(Phaser.KeyCode.O)
    this.logInfo = this.game.input.keyboard.addKey(Phaser.KeyCode.D)

    // Stop the following keys from propagating up to the browser
    this.game.input.keyboard.addKeyCapture([
      Phaser.KeyCode.LEFT, Phaser.KeyCode.RIGHT, Phaser.KeyCode.SHIFT, Phaser.KeyCode.SPACEBAR, Phaser.KeyCode.D, Phaser.KeyCode.P, Phaser.KeyCode.O
    ])
  }

  update () {
    // Check state of keys to control main character
    let speed = 0
    let jump = false

    // The light follows the player
    // this.light.x = this.player.x
    // this.light.y = this.player.y

    if (this.rightKey.isDown) { speed++ }
    if (this.leftKey.isDown) { speed-- }
    if (this.sprintKey.isDown) { speed *= 2 }
    if (this.jumpKey.isDown && this.player.touching(0, 1)) { jump = true }
    if (this.tweenFaster.isdown) {
      this.tweenRate -= 25
      this.setupPlayerLighting()
    }
    if (this.tweenSlower.isdown) {
      this.tweenRate += 25
      this.setupPlayerLighting()
    }
    if (this.brighten.isDown) {
      this.shadowFilter.darkness += 0.1
      // this.setupShader()
      console.log('E is pressed')
    }
    if (this.dim.isDown) {
      this.shadowFilter.darkness -= 0.1
    }
    if (this.logInfo.isDown) {
      console.log('Bitmap Data Location: (' + this.bmd.x + ', ' + this.bmd.y + ')')
      console.log('Inner Circle Location: (' + this.innerCircle.x + ', ' + this.innerCircle.y + ')')
      // console.log('Outer Circle Location: (' + this.outerCircle.x + ', ' + this.outerCircle.y + ')')
      console.log('Player Location: (' + this.player.x + ', ' + this.player.y + ')')
    }

    // Create a gradient
    var grd = this.bmd.context.createRadialGradient(
      this.innerCircle.x, this.innerCircle.y, this.innerCircle.radius,
      this.outerCircle.x, this.outerCircle.y, this.outerCircle.radius)
    grd.addColorStop(0, '#fdffa8')
    grd.addColorStop(1, '#2e3333')

    // Clear the bitmap and re-render the gradient circle
    this.bmd.cls()
    this.bmd.circle(this.outerCircle.x, this.outerCircle.y, this.outerCircle.radius, grd)

    // SETH: Remove the previous bitmap image
    this.game.world.remove(this.bmdImage)

    // SETH: Add the bitmap image at same place as player
    this.bmdImage = this.bmd.addToWorld(
      this.player.x, this.player.y, 0.5, 0.5)

    if (jump === true) {
      this.player.overrideState = MainPlayer.overrideStates.JUMPING
    } else if (jump === false) {
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
    }
  }
}

// Expose the class TestLevel to other files
export default TestLevel
