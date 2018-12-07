// Import the entire 'phaser' namespace
import Phaser from 'phaser'

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
    this.tweenStages.push(this.makeMultiStageTween({ x: startX - 100 }, 1))
    this.tweenStages.push(this.makeMultiStageTween({ y: startY - 100 }, 2))
    this.tweenStages.push(this.makeMultiStageTween({ x: startX }, 3))
    this.tweenStages.push(this.makeMultiStageTween({ y: startY }, 0))
    this.setTweenStage(0)
  }

  makeMultiStageTween (destination, chainTo) {
    let tween = this.game.add.tween(this.body).to(destination, 1000, Phaser.Easing.Linear.None)
    tween.onComplete.add(() => {
      console.log('Elevator stage complete')
      this.setTweenStage(chainTo)
    }, this)
    return tween
  }

  setTweenStage (index) {
    this.curTween = index
    if (this.curTween < this.tweenStages.length) {
      console.log('Elevator stage set to ' + this.curTween)
      this.tween = this.tweenStages[this.curTween]
    } else {
      console.log('Invalid stage ' + this.curTween)
    }
  }

  /**
   * Start the platform moving.
   */
  startMovement () {
    // Call the parent movement method
    if (super.startMovement()) {
      this.game.add.audio('gears2Audio').play()
      // Create a light when the movement starts
      this.light.createLight(this.startX, this.startY, 200.0, 1.0)
      return true
    }

    // Movement is already happening
    return false
  }
}

export default Elevator
