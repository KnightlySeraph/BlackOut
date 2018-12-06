/* globals __DEV__ */

// Import the entire 'phaser' namespace
import Phaser from 'phaser'

/**
 * A platform that can move and will carry the player with it.
 */
class MovingPlatform extends Phaser.Sprite {
  constructor ({ game, x, y, id, spriteName, light }) {
    // Initialize parent and copy needed parameters
    super(game, 0, 0, spriteName, 0)
    this.name = 'mover'
    this.spriteName = spriteName
    this.light = light
    this.id = id

    // Create physics body for collisions
    this.body = new Phaser.Physics.P2.Body(this.game, this, x, y)
    this.body.dynamic = false

    // Child customizes this function
    this.createPhysicsBodyShapes()

    // Configure the body
    this.body.debug = __DEV__
    this.body.mass = 0
    this.topSensor.sensor = true
    this.topSensor.name = 'Top Sensor'

    // Must occure AFTER all shapes have been created on body
    this.body.setCollisionGroup(this.game.movingPlatformGroup)
    this.body.collides(this.game.playerGroup)

    // Reset anchor
    this.anchor.setTo(0, 0)

    // Initialize player state
    this.playerIsOnTop = false
    this.player = null

    // Setup contact events
    this.body.onBeginContact.add(this.steppedOn, this)
    this.body.onEndContact.add(this.steppedOff, this)

    // Create the tween (implemented in child class)
    this.setupTween(x, y)
  }

  /**
   * Create the physics body for this platform (specific to each child). Must add
   * at least one shape to the body and create this.topSensor as a shape on the body.
   * @abstract
   */
  createPhysicsBodyShapes () {
    console.log('ERROR: Abstract function MovingPlatform.createPhysicsBodyShapes() called')
  }

  /**
   * Setup the motion or motions for this specific body
   * @abstract
   */
  setupTween () {
    console.log('ERROR: Abstract function MovingPlatform.setupTween() called')
  }

  /**
   * Begin moving the current platform. Will resume the tween if paused or start
   * it if it is not yet running. If there is no tween or the tween is already
   * running it does nothing.
   * @returns {boolean} true if the tween was resumed or started
   */
  startMovement () {
    console.log('Moving ' + this.name)
    // Try and start the tween
    if (this.tween) {
      if (this.tween.isPaused) {
        this.tween.resume()
        return true
      } else if (!this.tween.isRunning) {
        this.tween.start()
        return true
      }
    }

    // Movement is already happening
    return false
  }

  /**
   * Attempt to stop the movement (pause the current tween). If a tween exists and is
   * currently running it will pause it. Does nothing otherwise.
   * @return {boolean} True if the tween was successfully paused
   */
  stopMovement () {
    // Try and pause the tween
    if (this.tween && this.tween.isRunning) {
      this.tween.pause()
      return true
    }

    // Tween was already paused
    return false
  }

  /**
   * Slot activated when something contacts this body (responds to the onContactBegin signal)
   * @param {P2.Body} otherPhaserBody The other physics body
   * @param {Phaser.Physics.P2.Body} otherP2Body The other P2 body
   * @param {P2.Shape} myShape The shape belonging to this body that is in contact
   * @param {P2.Shape} otherShape The shape belonging to the other body that is in contact
   * @param {*} contactEqns The P2 contact equations
   */
  steppedOn (otherPhaserBody, otherP2Body, myShape, otherShape, contactEqns) {
    // Is this the player and the top sensor
    if (otherPhaserBody !== null && otherPhaserBody.sprite !== null && otherPhaserBody.sprite.name === 'Main Player') {
      if (myShape === this.topSensor) {
        // Attach the player to this moving platform
        this.player = otherPhaserBody.sprite
        this.playerOffsetX = this.player.body.x - this.body.x
      }
    }
  }

  /**
   * Slot activated when something stops contacting this body (responds to the onContactEnd signal)
   * @param {P2.Body} otherPhaserBody The other physics body
   * @param {Phaser.Physics.P2.Body} otherP2Body The other P2 body
   * @param {P2.Shape} myShape The shape belonging to this body that is ending contact
   * @param {P2.Shape} otherShape The shape belonging to the other body that is ending contact
   */
  steppedOff (otherPhaserBody, otherP2Body, myShape, otherShape) {
    // Is this the player and the top sensor
    if (otherPhaserBody !== null && otherPhaserBody.sprite !== null && otherPhaserBody.sprite.name === 'Main Player') {
      if (myShape === this.topSensor) {
        // Detach the player from this moving platform
        this.player.dynamic = true
        this.player = null
      }
    }
  }

  /**
   * Update the current offset value for the player. This allows them to move along the platform
   * instead of being glued to the spot the landed on.
   * @param {number} deltaX Change in the X offset
   * @param {number} deltaY Change in the Y offset
   */
  changeOffset (deltaX, deltaY) {
    if (this.player != null) {
      this.playerOffsetX += deltaX
    }
  }

  /**
   * Called every tick while the sprite is awake and in the world.
   * @override
   */
  update () {
    // Always call the parent's update
    super.update()

    // If the player is on this platform, move it with the platform
    if (this.player != null) {
      this.player.body.x = this.body.x + this.playerOffsetX
    }
  }
}

// Expose the class for importing in other files
export default MovingPlatform
