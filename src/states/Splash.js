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

    // Add the logo to the screen and center it
    this.logo = this.game.add.sprite(
      this.game.world.centerX, this.game.world.centerY, 'logo')
    centerGameObjects([this.logo])
  }

  preload () {
    // Create sprites from the progress bar assets
    this.loaderBg = this.add.sprite(
      this.game.world.centerX, this.game.height - 30, 'loaderBg')
    this.loaderBar = this.add.sprite(
      this.game.world.centerX, this.game.height - 30, 'loaderBar')
    centerGameObjects([this.loaderBg, this.loaderBar])

    // Display the progress bar
    this.load.setPreloadSprite(this.loaderBar)

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
    this.game.load.spritesheet('controlAnims', '/assets/images/controlspritesheet_64x32.png', 64, 32, 12, 0, 0)
    this.game.load.spritesheet('controlMenu', 'assets/images/mainMenuBG.png', 1920, 938, 1, 0, 0)
    this.game.load.spritesheet('pocketWatchText', 'assets/images/windPocketwatchTitle.png', 64, 32, 1, 0, 0)
    this.game.load.spritesheet('movementText', 'assets/images/movementTitle.png', 64, 32, 1, 0, 0)
    this.game.load.spritesheet('interactText', 'assets/images/interactTitle.png', 64, 32, 1, 0, 0)
    this.game.load.spritesheet('jumpText', 'assets/images/jumpTitle.png', 64, 32, 1, 0, 0)
    this.game.load.spritesheet('spacebarAnim', 'assets/images/spacebarSpriteSheet_64x32.png', 64, 32, 2)
    this.game.load.spritesheet('interactAnim', 'assets/images/eSpriteSheet_64x32.png', 64, 32, 2, 0, 0)
    this.game.load.spritesheet('arrowKeyAnim', 'assets/images/leftRightSpriteSheet_64x32.png', 64, 32, 2, 0, 0)
    this.game.load.spritesheet('tabAnim', 'assets/images/tabSpriteSheet_64x32.png', 64, 32, 2, 0, 0)

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
    // Check how much time has elapsed since the stage started and only
    // proceed once MIN_SPLASH_SECONDS or more has elapsed
    if (this.game.time.elapsedSecondsSince(this.started) >= config.MIN_SPLASH_SECONDS) {

      // Make sure the audio is not only loaded but also decoded before advancing
      if (this.game.sounds.get('gears1').isDecoded) {
        this.game.sounds.play('gears1', config.SFX_VOLUME)
        this.state.start('MainMenu') // change to MainMenu
      }
    }
  }
}

// Expose the Splash class for use in other modules
export default Splash
