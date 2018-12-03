/* globals __DEV__ */

// Import the entire 'phaser' namespace
import Phaser from 'phaser'
import P2 from 'p2'

import Jumper from './Jumper.js'

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
    super(game, x, y, 'toki-main', 0)
    this.name = 'Main Player'
    this.anchor.setTo(0.5, 1.0)

    // Boolean to see if object is being interacted with
    this._interact = false

    // Timer for jump function
    this._jumpTimer = 0

    // objects that are colliding will be put into a set
    this._overlapping = new Set()

    // turn off smoothing (this is pixel art)
    this.smoothed = false

    // Set a reference to the top-level phaser game object
    this.game = game

    // Set up the reference to call to see if the player has hit a "spring"
    this.isSpring = false

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
    this.body.fixedRotation = true

    // Create a custom shape for the collider body
    this.body.clearShapes()
    this.body.setRectangle(20, 85, 0, -35)
    this.body.offset.setTo(0, -40)

    // Configure custom physics properties
    this.body.damping = 0.5
    this.body.allowGravity = true

    // Set up collision groups
    this.body.setCollisionGroup(this.game.playerGroup)
    this.body.collides([this.game.platformGroup, this.game.deathGroup, this.game.movingPlatformGroup, this.game.leverGroup, this.game.jumperGroup, this.game.physics.p2.boundsCollisionGroup])

    this.body.onBeginContact.add(this.onBeginContact, this)
    this.body.onEndContact.add(this.onExitContact, this)
  }

  /** Checks to see if an object has entered a collision
 * @param {Phaser.Phyics.P2.Body} otherPhaserBody // Body of object
 * @param {P2.Body} otherP2Body // Shape of body
 * @param {P2.Shape} myShape // Shape of body colliding
 * @param {P2.Shape} otherShape // Shape of body colliding
 * @param {*} contactEquation  //IDK
 */
  onBeginContact (otherPhaserBody, otherP2Body, myShape, otherShape, contactEquation) {
    if (otherPhaserBody === null || otherPhaserBody.sprite === null) return

    if ((otherPhaserBody.x <= this.body.x + 1 || otherPhaserBody.x >= this.body.x - 1) && (otherPhaserBody.y <= this.body.y + 1 || otherPhaserBody.y >= this.body.y - 1)) {
      console.log('collidable')
      if (otherPhaserBody.sprite.isInteractable) { // Checks to see if other body is interactable
        this._overlapping.add(otherPhaserBody.sprite) // adds object to set
      } else if (otherPhaserBody.sprite.name === 'jumper') { // Checks if the colliding object is a spring
        this._overlapping.add(otherPhaserBody.sprite)
        this._override_state = MainPlayer.overrideStates.NONE
        this.body.velocity.y = 0
        this.overrideState = MainPlayer.overrideStates.JUMPING
        otherPhaserBody.sprite.animate(true)
        this.jumpingFromJumper = true
      } else if (otherPhaserBody.sprite.name === 'pitOfDeath') {
        this.game.state.start(this.game.state.current)
      }
    }
  }

  /** Checks to see if an object has left a collision
   *
   * @param {Phaser.Phyics.P2.Body} otherPhaserBody
   * @param {P2.Body} otherP2Body
   * @param {P2.Shape} myShape
   * @param {P2.Shape} otherShape
   */
  onExitContact (otherPhaserBody, otherP2Body, myShape, otherShape) {
    if (otherPhaserBody === null || otherPhaserBody.sprite === null) return

    if (otherPhaserBody.sprite.isInteractable) { // Checks to see if other body is interactable
      this._overlapping.delete(otherPhaserBody.sprite) // removes object from set
    } else if (otherPhaserBody.sprite.name === 'jumper') {
     // Jumper.animate(false)
     // otherPhaserBody.sprite.animations.play('stopped', 10, true)
      this.isSpring = false
      console.log('exit spring')
      this._overlapping.delete(otherPhaserBody.sprite) // removes object from set
    } else if (otherPhaserBody.sprite.name === 'mover') {
      console.log('exit mover')
      this._overlapping.delete(otherPhaserBody.sprite) // removes object from set
    } else if (otherPhaserBody.sprite.name === 'pitOfDeath') {
      console.log('Left the pit')
    }
  }

  /**
   *  Calls/Checks all the objects in the set and calls their interact function
   */
  interact () {
    this._overlapping.forEach(function (item) {
      item.interact()
    })
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
      if (this._override_state === MainPlayer.overrideStates.WINDING) {
        // Winding is only allowed to go back to NONE
        if (newState === MainPlayer.overrideStates.NONE) {
          this._override_state = newState
          this.updateAnimation()
        }
      } else if (this._override_state !== MainPlayer.overrideStates.FALLING || newState === MainPlayer.overrideStates.NONE) {
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
          this._jumpTimer = 50
          break

        case MainPlayer.overrideStates.FALLING:
          if (__DEV__) console.info('playing "falling"')
          this.animations.play('fall')
          break

        case MainPlayer.overrideStates.WINDING:
          if (__DEV__) console.info('playing "winding"')
          this.animations.play('winding')
          break
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

    if (this.body.velocity.y >= 100 && this.overrideState !== MainPlayer.overrideStates.FALLING) {
      this.overrideState = MainPlayer.overrideStates.FALLING
    }

    // Override state that controls jumping and falling
    if (this.overrideState === MainPlayer.overrideStates.JUMPING) {
      if (this._jumpTimer > 0) {
        this._jumpTimer -= 5
        if (this.jumpingFromJumper) {
          this.body.moveUp(300)
        } else {
          this.body.moveUp(150)
        }
      } else {
        this.overrideState = MainPlayer.overrideStates.FALLING
      }
    } else if (this.overrideState === MainPlayer.overrideStates.FALLING) {
      if (this.touching(0, 1)) {
        this.overrideState = MainPlayer.overrideStates.NONE
      }
    }

    if (this.overrideState !== MainPlayer.overrideStates.WINDING) {
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
          this.body.moveRight(450)
        } else {
          this.body.moveLeft(450)
        }
      }
    }
  }

  // Function to setup all the animation data
  setupAnimations () {
    // Basic movement animations
    this.animations.add('stop', [32], 1, false)
    this.animations.add('walk', [0, 1, 2, 3, 4, 5, 6, 7], 10, true)

    // Different parts of the idle animation
    this.animations.add('idle', sequentialNumArray(32, 55), 4, true)
    this.animations.add('jump', [24, 25], 4, false)
    this.animations.add('fall', [26], 4, true)
    this.animations.add('winding', sequentialNumArray(8, 19), 10, true)
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
  WINDING: 'winding',
  NONE: 'none'
})

// Expose the MainPlayer class to other files
export default MainPlayer
