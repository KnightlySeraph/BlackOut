/* globals __DEV__ */

// Import the entire 'phaser' namespace
import Phaser from 'phaser'

// Import needed functions from utils and config settings
import { sequentialNumArray } from '../utils.js'
import config from '../config'

/**
 * The main player-controllable sprite. This class encapsulates the logic for the main
 * player sprite with all of it's animations and states. It includes a simple, hard-coded
 * movement state-machine that coordinates transitions between differnt movement states
 * and the idle state. It shows examples of setting up animations that are embedded in a
 * larger sprite-sheet and carefule management of the current state. No physics are used
 * in this example, only basic animation.
 *
 * See Phaser.Sprite for more about sprite objects and what they support.
 */
class MainPlayer extends Phaser.Sprite {
  constructor ({ game, x, y }) {
    // Initialize object basics
    super(game, x, y, 'player-main', 0)
    this.name = 'Main Player'
    this.anchor.setTo(0.5, 1.0)

    // turn off smoothing (this is pixel art)
    this.smoothed = false

    // Set a reference to the top-level phaser game object
    this.game = game

    // Setup all the animations
    this.setupAnimations()

    // All variabes that start with '_' are meant to be private
    // Initial state is 'unknown' as nothing has happened yet
    this._move_state = MainPlayer.moveStates.UNKNOWN
    this._active_state = MainPlayer.moveStates.NONE

    // These variables come from config.js rather than being hard-coded here so
    // they can be easily changed and played with
    this._SCALE = config.PLAYER_SCALE
    this._idle_countdown = config.IDLE_COUNTDOWN

    // Initialize the scale of this sprite
    this.scale.setTo(this._SCALE)

    // Create a P2 physics body for this sprite
    this.game.physics.p2.enable(this)
    this.body.debug = __DEV__
    this.body.collideWorldBounds = true
    this.body.fixedRotation = true

    // Create a custom shape for the collider body
    this.body.setRectangle(32, 110)
    this.body.offset.setTo(0, -40)

    // Configure custom physics properties
    this.body.damping = 0.5
  }

  // Setter and getter for the movement state property
  get moveState () { return this._move_state }
  set moveState (newState) {
    if (this._active_state !== MainPlayer.moveStates.NONE) {
      // TODO: Stay in the active state
      // - if the requested state is falling and the current active state is jumping, allow it
      if (this._active_state !== newState &&
        (this._active_state !== MainPlayer.moveStates.JUMPING ||
          newState !== MainPlayer.moveStates.NONE)) {
        this._active_state = newState
        this.updateAnimation()
      }
    } else {
      if (this._move_state !== newState &&
          (this._move_state !== MainPlayer.moveStates.IDLE ||
          newState !== MainPlayer.moveStates.STOPPED)) {
        // Update the state
        this._move_state = newState
        this.updateAnimation()
      }
    }
  }

  // Functions to help manage the way the character is facing.
  // We flip the sprite along the X dimensions to control this.
  isFacingRight () { return (this.scale.x > 0) }
  isFacingLeft () { return (this.scale.x < 0) }

  makeFaceRight () { this.scale.set(this._SCALE, this._SCALE) }
  makeFaceLeft () { this.scale.set(-this._SCALE, this._SCALE) }

  makeAboutFace () {
    if (this.facingRight()) {
      this.makeFaceLeft()
    } else {
      this.makeFaceRight()
    }
  }

  // Update animation to match state (called only when state changes)
  updateAnimation () {
    // Look at the current movement state and adjust the animation accordingly
    switch (this._move_state) {
      case MainPlayer.moveStates.STOPPED:
        if (__DEV__) console.info('Playing "stop"')
        this.animations.play('stop')
        this._idle_countdown = config.IDLE_COUNTDOWN
        break

      case MainPlayer.moveStates.WALKING:
        if (__DEV__) console.info('Playing "walk"')
        this.animations.play('walk')
        break

      case MainPlayer.moveStates.RUNNING:
        if (__DEV__) console.info('Playing "run"')
        this.animations.play('run')
        break

      case MainPlayer.moveStates.IDLE:
        if (__DEV__) console.info('Playing "idle"')
        this.animations.play('idle')
        break
      case MainPlayer.moveStates.JUMPING:
        if (__DEV__) console.info('playing "jump"')
        this.animations.play('jump')
    }
  }

  // Function that runs every tick to update this sprite
  update () {
    // Always give parent a chance to update
    super.update()

    // Automatically switch to idle after designated countdown
    if (this.moveState === MainPlayer.moveStates.STOPPED) {
      this.body.velocity.x = 0
      if (this._idle_countdown <= 0) {
        this.moveState = MainPlayer.moveStates.IDLE
      } else {
        this._idle_countdown -= 1
      }
    } else if (this.moveState === MainPlayer.moveStates.WALKING) {
      if (this.isFacingRight()) { this.body.moveRight(500) } else { this.body.moveLeft(500) }
    } else if (this.moveState === MainPlayer.moveStates.RUNNING) {
      if (this.isFacingRight()) { this.body.moveRight(1000) } else { this.body.moveLeft(1000) }
    } else if (this.moveState === MainPlayer.moveStates.JUMPING) { this.body.moveUp(250) }
  }

  // Function to setup all the animation data
  setupAnimations () {
    // Basic movement animations
    this.animations.add('stop', [48], 1, false)
    this.animations.add('walk', [0, 1, 2, 3, 4, 5, 6, 7], 10, true)
    this.animations.add('run', [16, 17, 18, 19, 20, 21, 22, 23], 10, true)

    // Different parts of the idle animation
    this.animations.add('idle', sequentialNumArray(48, 62), 4, false)
    this.animations.add('idle_breath', sequentialNumArray(48, 60), 4, false)
    this.animations.add('idle_yoyo', sequentialNumArray(144, 183), 8, false)
    this.animations.add('idle_kick', sequentialNumArray(63, 71), 8, false)

    // Action animations that override movement
    // Note: these are not used in this example but are in the spritesheet
    this.animations.add('dash', [34, 35, 36, 37], 20, false)
    this.animations.add('jump', [96], 10, true)
    this.animations.add('fall', [84], 10, true)

    // Setup the different idles animations to automatically trigger each other so it
    // makes a nice long, distinct idle animation that loops forever
    this.animations.getAnimation('idle').onComplete.add(() => {
      this.play('idle_yoyo')
    }, this)

    this.animations.getAnimation('idle_yoyo').onComplete.add(() => {
      this.play('idle_breath')
    }, this)

    this.animations.getAnimation('idle_breath').onComplete.add(() => {
      this.play('idle_kick')
    }, this)

    this.animations.getAnimation('idle_kick').onComplete.add(() => {
      this.play('idle')
    }, this)
  }
}

// All possible player 'movement states'
// Note: this is an example of a static 'enum' in JavaScript
MainPlayer.moveStates = Object.freeze({
  UNKNOWN: 'unknown',
  STOPPED: 'stopped',
  WALKING: 'walking',
  RUNNING: 'running',
  JUMPING: 'jumping',
  IDLE: 'idle',
  NONE: 'none'
})

// Expose the MainPlayer class to other files
export default MainPlayer
