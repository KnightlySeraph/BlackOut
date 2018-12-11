/* globals __DEV__ */

// Import the entire 'phaser' namespace
import Phaser from 'phaser'

// Use configuration for pre-coded ID constants
import config from '../config'

// Import parent class
import MovingPlatform from './MovingPlatform'

/**
 * A specific kind of moving platform that moves between multiple
 * locations and is controlled by multiple levers.
 */
class Elevator extends MovingPlatform {
  constructor ({ game, x, y, id, light }) {
    // Initialize parent
    super({ game, x, y, id, spriteName: 'Elevator', light })
  }

  /**
   * Create the physics body for this platform (specific to each child)
   * @override
   */
  createPhysicsBodyShapes () {
    // For now, all simple moving platforms have the same body
    // TODO: Differentiate by this.id if needed
    this.body.setRectangle(125, 95, 63.5, 239.5)
    this.topSensor = this.body.addRectangle(125 * 0.9, 5, 63.5, 190)
  }

  /**
   * Setup the motion or motions for this specific body (called from parent constructor)
   * @override
   */
  setupTween (startX, startY) {
    this.tweenStages = []
    this.tweenStages.push(this.makeMultiStageTween({ y: startY - 667 }, 1))
    this.tweenStages.push(this.makeMultiStageTween({ y: startY - 1340 }, 2))
    this.tweenStages.push(this.makeMultiStageTween({ y: startY }, 0))
    this.setTweenStage(0)
  }

  makeMultiStageTween (destination, chainTo) {
    let tween = this.game.add.tween(this.body).to(destination, 8000, Phaser.Easing.Linear.None)
    tween.onComplete.add(() => {
      if (__DEV__) { console.log('Elevator stage complete') }
      this.setTweenStage(chainTo)
    }, this)
    return tween
  }

  setTweenStage (index) {
    this.curTween = index
    if (this.curTween < this.tweenStages.length) {
      if (__DEV__) { console.log('Elevator stage set to ' + this.curTween) }
      this.tween = this.tweenStages[this.curTween]
    } else {
      if (__DEV__) { console.log('Invalid stage ' + this.curTween) }
    }
  }

  /**
   * Start the platform moving.
   */
  startMovement () {
    // Call the parent movement method
    if (super.startMovement()) {
      this.game.sounds.play('gears2', config.SFX_VOLUME)
      // Create a light when the movement starts
      this.light.createLight(this.startX, this.startY + 2500, 200.0, 1.0)
      return true
    }

    // Movement is already happening
    return false
  }
}

export default Elevator
