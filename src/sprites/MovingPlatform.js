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

    this.topSensor = this.body.addRectangle(width * 0.9, 5, 0, -height / 2)
    this.topSensor.sensor = true
    this.topSensor.name = 'Top Sensor'

    this.body.setCollisionGroup(this.game.movingPlatformGroup)
    this.body.collides(this.game.playerGroup)

    this.anchor.setTo(0, 0)

    this.playerIsOnTop = false
    this.player = null
    this.body.onBeginContact.add(this.steppedOn, this)
    this.body.onEndContact.add(this.steppedOff, this)

    this.tween = this.game.add.tween(this.body).to(
      { x: x - 1000 }, 5000, Phaser.Easing.Linear.None, false, 100, -1, true)
  }

  steppedOn (otherPhaserBody, otherP2Body, myShape, otherShape, contactEqns) {
    if (otherPhaserBody !== null && otherPhaserBody.sprite !== null && otherPhaserBody.sprite.name === 'Main Player') {
      if (myShape === this.topSensor) {
        this.player = otherPhaserBody.sprite
        this.playerOffset = this.player.body.x - this.body.x
        this.tween.start()
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

  changeOffset (deltaX) {
    if (this.player != null) {
      this.playerOffset += deltaX
    }
  }

  update () {
    super.update()
    if (this.player != null) {
      this.player.body.x = this.body.x + this.playerOffset
    }
  }
}

export default MovingPlatform
