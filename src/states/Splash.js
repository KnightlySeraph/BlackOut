// Import the entire 'phaser' namespace
import Phaser from 'phaser'

// Import needed functions from utils and config settings
import { centerGameObjects } from '../utils'
import config from '../config'

/**
 * The Splash game state. This game state displays a dynamic splash screen used
 * to communicate the progress of asset loading. It should ensure it is always
 * displayed some mimimum amount of time (in case the assets are already cached
 * locally) and it should have pre-loaded any assets it needs to display in Boot
 * before it is run. Generally only runs once, after Boot, and cannot be re-entered.
 *
 * See Phaser.State for more about game states.
 */
class Splash extends Phaser.State {
  // Initialize some local settings for this state
  init () {
    // When was this state started?
    this.started = this.game.time.time

    // Set / Reset world bounds
    this.game.world.setBounds(0, 0, this.game.width, this.game.height)
  }

  preload () {
    // Create sprites from the progress bar assets
    this.loaderBg = this.add.sprite(
      this.game.world.centerX, this.game.world.centerY + 500, 'loaderBg')
    this.loaderBar = this.add.sprite(
      this.game.world.centerX, this.game.world.centerY + 500, 'loaderBar')
    centerGameObjects([this.loaderBg, this.loaderBar])

    // Display the progress bar
    this.load.setPreloadSprite(this.loaderBar)
    this.startLogoSequence()

    // Set up bool to play music on splash screen
    this.game.splashReady = false

    // Tiled Map
    this.load.tilemap('Mytilemap', 'assets/images/testlevel_02.json', null, Phaser.Tilemap.TILED_JSON)
    this.load.tilemap('Mytilemap2', 'assets/images/testlevel_03.json', null, Phaser.Tilemap.TILED_JSON)
    this.load.tilemap('VersionFinal', 'assets/images/level01.json', null, Phaser.Tilemap.TILED_JSON)
    this.load.image('tiles1', 'assets/images/tiles1.png')

    // Load all the assets needed for next state

    // Re-Start Physics
    this.game.physics.p2 = null
    this.game.physics.startSystem(Phaser.Physics.P2JS)
    this.game.physics.p2.setImpactEvents(true)

    this.game.physics.p2.gravity.y = 700
    this.game.physics.p2.world.defaultContactMaterial.friction = 0.3

    // collision group creation
    this.game.playerGroup = this.game.physics.p2.createCollisionGroup()
    this.game.platformGroup = this.game.physics.p2.createCollisionGroup()
    this.game.leverGroup = this.game.physics.p2.createCollisionGroup()
    this.game.jumperGroup = this.game.physics.p2.createCollisionGroup()
    this.game.movingPlatformGroup = this.game.physics.p2.createCollisionGroup()
    this.game.deathGroup = this.game.physics.p2.createCollisionGroup()
    this.game.finishGroup = this.game.physics.p2.createCollisionGroup()

    // put in button sprites here
    this.game.load.spritesheet('MenuButtons', 'assets/images/menuTextSprites.png', 72, 18)
    this.game.load.spritesheet('mainMenu', 'assets/images/mainMenuBG.png', 1920, 938, 1, 0, 0)
    this.game.load.spritesheet('credits', 'assets/images/credits.png', 1920, 938, 1, 0, 0)
    this.game.load.spritesheet('mmLogo', 'assets/images/blackoutLogo.png', 80, 16, 1, 0, 0)
    this.game.load.spritesheet('sethsBastment', 'assets/images/sethsBasement.png', 128, 14, 1, 0, 0)

    // Load assets for the control page
    this.game.load.spritesheet('controlAnims', '/assets/images/horizontalControlSpriteSheet.png', 32, 32, 12, 0, 0)
    this.game.load.spritesheet('controlMenu', 'assets/images/mainMenuBG.png', 1920, 938, 1, 0, 0)
    this.game.load.spritesheet('pocketWatchText', 'assets/images/windPocketwatchTitle.png', 128, 16, 1, 0, 0)
    this.game.load.spritesheet('movementText', 'assets/images/movementTitle.png', 64, 16, 2, 0, 0)
    this.game.load.spritesheet('interactText', 'assets/images/interactTitle.png', 64, 16, 1, 0, 0)
    this.game.load.spritesheet('jumpText', 'assets/images/jumpTitle.png', 64, 16, 1, 0, 0)
    this.game.load.spritesheet('returnText', 'assets/images/returnToMain.png', 64, 16, 1, 0, 0)
    this.game.load.spritesheet('spacebarAnim', 'assets/images/spacebarSpriteSheet_64x32.png', 64, 32, 2)
    this.game.load.spritesheet('interactAnim', 'assets/images/eSpriteSheet_64x32.png', 64, 32, 2, 0, 0)
    this.game.load.spritesheet('arrowKeyAnim', 'assets/images/leftRightSpriteSheet_64x32.png', 64, 32, 2, 0, 0)
    this.game.load.spritesheet('tabAnim', 'assets/images/tabSpriteSheet_64x32.png', 64, 32, 2, 0, 0)
    this.game.load.spritesheet('overlayControls', 'assets/images/controlsOverlay.png', 1920, 938, 1, 0, 0)
    this.game.load.spritesheet('bOverlay', 'assets/images/Black.png', 1920, 938, 1, 0, 0)

    // The main player spritesheet
    this.load.spritesheet('toki-main', 'assets/images/tokiSpriteSheet.png', 64, 64)
    this.load.spritesheet('blank', 'assets/images/blank.png', 10, 10)
    this.load.spritesheet('light', 'assets/images/light.png', 10, 10)

    // The audiosprite with all music and SFX
    // - Add .wav files to 'assets/audio' (convert other formats to .wav)
    // - Edit the 'sfx' script in package.json to indicate which ones should loop
    // - Run 'npm run sfx' to generate the files loaded below
    // - Be sure to re-run the 'sfx' script when you cloan the repo or any time you add audio files
    this.load.audioSprite('sounds', [
      'assets/audio/sounds.ogg', 'assets/audio/sounds.mp3',
      'assets/audio/sounds.m4a', 'assets/audio/sounds.ac3'
    ], 'assets/audio/sounds.json')
  }

  // Pre-load is done
  create () {
    // Destroy progress bar assets
    this.loaderBar.destroy()
    this.loaderBg.destroy()

    // Setup the audio which should now be loaded
    this.setupAudio()
  }

  setupAudio () {
    // Load the audio sprite into the global game object (and also make a local variable)
    this.game.sounds = this.game.add.audioSprite('sounds')

    // NOTE: Use this area to setup any events that are important for music or sounds
  }

  // Called repeatedly after pre-load finishes and after 'create' has run
  update () {
    // Make sure the audio is not only loaded but also decoded before advancing
    if (this.doneWithLogos && this.game.sounds.get('gears1').isDecoded) {
      this.state.start('MainMenu') // change to MainMenu
    }
  }

  startLogoSequence () {
    // Begin the logo process
    let myState = this
    let myCam = this.game.camera
    this.stage.backgroundColor = '#000000'
    myCam.fade(0x000000, 1)
    myCam.onFadeComplete.add(() => {
      myCam.onFadeComplete.removeAll()
      myState.makeSethsBasementLogo()
    })
  }

  makeSethsBasementLogo () {
    // Add the background audio
    this.basementAudio = this.game.add.audio('basement', 0.5)

    // Add the logo to the screen and center it
    this.sethsBlogo = this.game.add.sprite(
      this.game.world.centerX, this.game.world.centerY, 'sethsBLogo')

    // Setup the text
    this.sethsBText1 = this.game.add.text(
      this.game.world.centerX,
      this.game.world.centerY - this.sethsBlogo.height / 2 - 50,
      'A game made in')

    this.sethsBText2 = this.game.add.bitmapText(
      this.game.world.centerX,
      this.game.world.centerY + this.sethsBlogo.height / 2 + 50,
      'sethsBFont', 'Seth\'s Basement', 64)

    // Configure the non-bitmap text
    this.sethsBText1.font = 'Arial'
    this.sethsBText1.padding.set(10, 16)
    this.sethsBText1.fontSize = 40
    this.sethsBText1.fontWeight = 'bold'
    this.sethsBText1.stroke = '#000000'
    this.sethsBText1.strokeThickness = 4
    this.sethsBText1.fill = '#FFFFFF'

    // Center everything
    centerGameObjects([this.sethsBlogo, this.sethsBText1,
      this.sethsBText2])

    // Setup transition fade to happen when audio stops
    let myState = this
    let myCam = this.game.camera
    setTimeout(() => {
      this.basementAudio.fadeOut(1000)
      myCam.fade(0x000000, 1000, false, 1.0)
      myCam.onFadeComplete.add(() => {
        // Reset signal
        myCam.onFadeComplete.removeAll()

        // Remove previous logo
        myState.sethsBlogo.destroy()
        myState.sethsBText1.destroy()
        myState.sethsBText2.destroy()

        // Create next logo
        myState.makeTeamLogo()
      })
    }, 4000)

    // Fade in from black
    myCam.flash(0x000000, 1000)

    // Start the audio
    this.basementAudio.play()
  }

  makeTeamLogo () {
    // Set final background color
    this.stage.backgroundColor = '#000000'

    // Add the logo to the screen and center it
    this.logo = this.game.add.sprite(
      this.game.world.centerX, this.game.world.centerY, 'logo')

    centerGameObjects([this.logo])

    // Setup transition fade to happen after timeout
    let myState = this
    let myCam = this.game.camera
    setTimeout(() => {
      myCam.onFadeComplete.add(() => {
        myState.doneWithLogos = true
      })
      myCam.fade(0x000000, 1000, false, 1.0)
    }, 4000)

    // Fade in from black
    myCam.flash(0x000000, 1000)
  }
}

// Expose the Splash class for use in other modules
export default Splash
