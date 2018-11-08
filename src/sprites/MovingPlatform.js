/* globals __DEV__ */

// Import the entire 'phaser' namespace
import Phaser from 'phaser'
import P2 from 'p2'

// Import needed functions from utils and config settings
import { sequentialNumArray } from '../utils.js'
import config from '../config'

/**
 * The platform sprite. This class encapsulates the logic for the platform sprite.
 *
 * See Phaser.Sprite for more about sprite objects and what they support.
 */
class MovingPlatform extends Phaser.Sprite { // extends phaser.Sprite
  constructor ({ game, x, y, width, height, id, maxVelocity }) {
    super(game, 0, 0, 'blank', 0)
    this.name = 'mover'
//    this.scale.setTo(width / 10, height / 10)
    this.id = id
    this.maxVelocity = maxVelocity
    this.body = new Phaser.Physics.P2.Body(this.game, this, x, y)
    this.body.dynamic = false
    this.body.setRectangle(width, height, 0, 0)
    this.body.debug = __DEV__

    this.body.mass = 0

    this.topSensor = this.body.addRectangle(width, 10, 0, -height / 2)
    this.topSensor.sensor = true
    this.topSensor.name = 'Top Sensor'
   

    this.body.setCollisionGroup(this.game.movingPlatformGroup)
    this.body.collides(this.game.playerGroup)

    this.anchor.setTo(0, 0)

    this.playerIsOnTop = false
    this.player = null
    this.body.onBeginContact.add(this.steppedOn, this)
    this.body.onEndContact.add(this.steppedOff, this)
  }

  steppedOn (otherPhaserBody, otherP2Body, myShape, otherShape, contactEqns) {
    if (otherPhaserBody !== null && otherPhaserBody.sprite !== null && otherPhaserBody.sprite.name === 'Main Player') {
      if (myShape === this.topSensor) {
        this.player = otherPhaserBody.sprite
      }
    }
  }

  steppedOff (otherPhaserBody, otherP2Body, myShape, otherShape) {
    if (otherPhaserBody !== null && otherPhaserBody.sprite !== null && otherPhaserBody.sprite.name === 'Main Player') {
      if (myShape === this.topSensor) {
        this.player = null
      }
    }
  }

  /**
   * Moves a movable platform up, dow, left, or right based on the type of movement indicated
   * @param {*} type integer: 1 for left, 2 for right, 3 for up, 4 for down
   * @param {*} p2 the position to move to
   */
  moveMe (type, point2) { // TODO: use tweening for smooth animation
    if (type === 1) { // If leftward platform
      if (this.body.x > point2) {
        console.log('Moving Leftward')
        this.game.add.tween(this.body).to({ x: 1000 }, 2000, Phaser.Easing.Linear.None, true)
         this.game.add.tween(this.player.body).to({ x: 1000 }, 2000, Phaser.Easing.Linear.None, true)

        // this.body.velocity.x -= 0.1
        // this.player.body.velocity.x = -1000
      }
    } else if (type === 2) { // If rightward platform
      console.log('Moving Rightward')
      if (this.body.x === point2) {
        // this.game.add.tween(this.body).to({ alpha: 0, x: 200 }, 1000, Phaser.Easing.Linear.None, true, 500, -1, true)
        // this.game.add.tween(this.player.body).to({ alpha: 0, x: 200 }, 1000, Phaser.Easing.Linear.None, true, 500, -1, true)
        // .x += 0.01
      }
    } else if (type === 3) { // If upward platform
      console.log('Moving Upward')
      // .y 
    } else if (type === 4) { // If downward platform
      console.log('Moving Downward')
    } else { console.log('Error not a valid type: please choose 1-4') }
  }

  update () {
    super.update()
    if (this.player != null) {
      this.moveMe(1, 100)
    } else {

    }
  }
}

export default MovingPlatform
