// Import the entire 'phaser' namespace
import Phaser from 'phaser'

// Use configuration for pre-coded ID constants
import config from '../config'

// Import parent class
import MovingPlatform from './MovingPlatform'

/**
 * A specific kind of moving platform that can be enabled or disabled (with
 * a single leaver) and that yoyo's back and forth between two positions.
 */
class BasicMovingPlatform extends MovingPlatform {
  constructor ({ game, x, y, id, light }) {
    // Initialize parent
    super({ game, x, y, id, spriteName: 'smallPlatform', light })
  }

  /**
   * Create the physics body for this platform (specific to each child)
   * @override
   */
  createPhysicsBodyShapes () {
    // For now, all simple moving platforms have the same body
    // TODO: Differentiate by this.id if needed
    this.body.setRectangle(57, 16, 31, 15)
    this.topSensor = this.body.addRectangle(57 * 0.9, 5, 31, 7)
  }

  /**
   * Setup the motion or motions for this specific body (called from parent constructor)
   * @override
   */
  setupTween (startX, startY) {
    let duration = 5000
    let destination = {}

    // Customize for given ID
    switch (this.id) {
      // Change these to suit your needs and add more in config.js
      case config.PLATFORM_1: destination = { y: startY + 400 }; break // platform near spawn
      case config.PLATFORM_2: destination = { y: startY + 375 }; break // 1st floor platform
      case config.PLATFORM_3: destination = { y: startY - 50 }; break
      case config.PLATFORM_4: destination = { y: startY + 50 }; break

      default:
        console.log('ERROR: this.id is not a valid BasicMovingPlatform ID.')
    }

    // Create the cooresponding tween
    this.tween = this.game.add.tween(this.body).to(
      destination, duration, Phaser.Easing.Linear.None, true, 100, -1, true)
  }

  /**
   * Start the platform moving.
   */
  startMovement () {
    // Call the parent movement method
    if (super.startMovement()) {
      this.game.sounds.play('gears1', config.SFX_VOLUME)
      // Create a light when the movement starts
      this.light.createLight(this.startX, this.startY + 2500, 50.0, 0.5)
      return true
    }

    // Movement is already happening
    return false
  }
}

export default BasicMovingPlatform
