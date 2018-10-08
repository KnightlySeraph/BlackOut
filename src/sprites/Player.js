/* globals __DEV__ */

// Import the entire 'phaser' namespace
import Phaser from 'phaser'
import P2 from 'p2'

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

    this._jumpTimer = 0

    // turn off smoothing (this is pixel art)
    this.smoothed = false

    // Set a reference to the top-level phaser game object
    this.game = game

    // Setup all the animations
    this.setupAnimations()

    // All variabes that start with '_' are meant to be private
    // Initial state is 'unknown' as nothing has happened yet
    this._move_state = MainPlayer.moveStates.UNKNOWN
    this._override_state = MainPlayer.overrideStates.NONE

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

    // this.body.setCollisionGroup(this.game.playerGroup)
    // this.body.collides([this.game.platformGroup, this.game.physics.p2.boundsCollisionGroup],
    //   this.onCollide, this)
  }

  // Collision function
  /** Checks to see if one object is colliding with another and what action to take.
   *
   * @param {Phaser.Phyics.P2.Body} myBody The body of this object
   * @param {Phaser.Phyics.P2.Body} otherBody The body of the colliding object
   * @param {P2.Shape} myShape // The shape of this body
   * @param {P2.Shape} otherShape // The shape of the colliding body
   */
  onCollide (myBody, otherBody, myShape, otherShape, contactEquation) {
    console.log('I am colliding')
    // otherBody.parent calls for sprite of game object
    // if ((myBody.x <= otherBody.x + 1 || myBody.x >= otherBody.x - 1) && (myBody.y <= otherBody.y + 1 || myBody.y >= otherBody.y - 1)) {
    //   if (__DEV__) {
    //     console.log('I am colliding')
    //   }
    // }
    // else {
    //   console.log('nope')
    // }
  }

  // Setter and getter for the movement state property
  get moveState () { return this._move_state }
  set moveState (newState) {
    if (this._move_state !== newState &&
        (this._move_state !== MainPlayer.moveStates.IDLE ||
        newState !== MainPlayer.moveStates.STOPPED)) {
      // Update the state
      this._move_state = newState
      if (this.overrideState === MainPlayer.overrideStates.NONE) {
        this.updateAnimation()
      }
    }
  }

  get overrideState () { return this._override_state }
  set overrideState (newState) {
    if (this._override_state !== newState) {
      if (this._override_state !== MainPlayer.overrideStates.FALLING || newState === MainPlayer.overrideStates.NONE) {
        this._override_state = newState
        this.updateAnimation()
      }
    }
  }

  // Borrowed from http://www.html5gamedevs.com/topic/12545-system-to-detect-on-ground-with-p2-physics/
  touching (x, y) {
    let yAxis = P2.vec2.fromValues(x, y)
    let result = false
    for (let i = 0; i < this.game.physics.p2.world.narrowphase.contactEquations.length; i++) {
      // cycles through all the contactEquations until it finds ourself
      let c = this.game.physics.p2.world.narrowphase.contactEquations[i]
      if (c.bodyA === this.body.data || c.bodyB === this.body.data) {
        let d = P2.vec2.dot(c.normalA, yAxis)
        if (c.bodyA === this.body.data) { d *= -1 }
        if (d > 0.5) {
          result = true
          break
        }
      }
    }
    return result
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
    if (this._override_state !== MainPlayer.overrideStates.NONE) {
      switch (this._override_state) {
        case MainPlayer.overrideStates.JUMPING:
          if (__DEV__) console.info('playing "jump"')
          this.animations.play('jump')
          this._jumpTimer = 40
          break

        case MainPlayer.overrideStates.FALLING:
          if (__DEV__) console.info('playing "falling"')
          this.animations.play('fall')
      }
    } else {
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
      }
    }
  }

  // Function that runs every tick to update this sprite
  update () {
    // Always give parent a chance to update
    super.update()
    // Override state that controls jumping and falling
    if (this.overrideState === MainPlayer.overrideStates.JUMPING) {
      if (this._jumpTimer > 0) {
        this._jumpTimer -= 0.625
        this.body.moveUp(250)
      } else {
        this.overrideState = MainPlayer.overrideStates.FALLING
      }
    } else if (this.overrideState === MainPlayer.overrideStates.FALLING) {
      if (this.touching(0, 1)) {
        this.overrideState = MainPlayer.overrideStates.NONE
      }
    }

    // Automatically switch to idle after designated countdown
    if (this.moveState === MainPlayer.moveStates.STOPPED) {
      this.body.velocity.x = 0
      if (this._idle_countdown <= 0) {
        this.moveState = MainPlayer.moveStates.IDLE
      } else {
        this._idle_countdown -= 1
      }
    } else if (this.moveState === MainPlayer.moveStates.WALKING) {
      if (this.isFacingRight()) {
        this.body.moveRight(500)
      } else {
        this.body.moveLeft(500)
      }
    } else if (this.moveState === MainPlayer.moveStates.RUNNING) {
      if (this.isFacingRight()) {
        this.body.moveRight(1000)
      } else {
        this.body.moveLeft(1000)
      }
    }
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
  IDLE: 'idle'
})

MainPlayer.overrideStates = Object.freeze({
  JUMPING: 'jumping',
  FALLING: 'falling',
  NONE: 'none'
})

// Expose the MainPlayer class to other files
export default MainPlayer
