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
  constructor ({ game, x, y, id, spriteName, light }) {
    super(game, 0, 0, spriteName, 0)
    this.name = 'mover'
    this.spriteName = spriteName
    this.light = light
//    this.scale.setTo(width / 10, height / 10)
    this.id = id
    this.body = new Phaser.Physics.P2.Body(this.game, this, x, y)
    this.body.dynamic = false
    if (spriteName === 'Elevator') {
      this.body.setRectangle(125, 95, 63.5, 239.5)
      this.topSensor = this.body.addRectangle(125 * 0.9, 5, 63.5, 190)
    }
    else if (spriteName === 'smallPlatform') {
      this.body.setRectangle(57, 16, 31, 15)
      this.topSensor = this.body.addRectangle(57 * 0.9, 5, 31, 7)
    }
    this.body.debug = __DEV__

    this.body.mass = 0
    this.topSensor.sensor = true
    this.topSensor.name = 'Top Sensor'

    this.body.setCollisionGroup(this.game.movingPlatformGroup)
    this.body.collides(this.game.playerGroup)

    this.anchor.setTo(0, 0)

    this.playerIsOnTop = false
    this.player = null
    this.body.onBeginContact.add(this.steppedOn, this)
    this.body.onEndContact.add(this.steppedOff, this)

    this.case1X = x - 50
    this.case2X = x + 50
    this.case3Y = x - 50
    this.case4y = y + 50

    this.setupTween(this.id)
  }

  setupTween (id) {
    let duration = 8000
    let destination = {}

    switch (id) {
      case 1: destination = { x: this.case1X }; break
      case 2: destination = { x: this.case2X }; break
      case 3: destination = { y: this.case3Y }; break
      case 4: destination = { y: this.case4Y }; break
      // case 5:
      //   // move left and up
      //   this.tween = this.game.add.tween(this.body).to({ x: this.x - 100 }, 5000, Phaser.Easing.Linear.None, false, 100, -1, true)
      //   this.tween = this.game.add.tween(this.body).to({ y: this.y - 100 }, 5000, Phaser.Easing.Linear.None, false, 100, -1, true)
      //   // tween left and up
      //   break
      default:
        console.log('Error steppedOn: this moving platform id is not valid.')
    }

    if (this.spriteName === 'Elevator') {
      this.tween = this.game.add.tween(this.body).to(destination, duration, Phaser.Easing.Linear.None, false, 10, 0, false)
      this.tween.onComplete.add(this.tweenDone, this)
    } else if (this.spriteName === 'smallPlatform') {
      //this.light.createLight(this.body.x + 100, this.body.y + 300, 350.0, 0.5)
      this.tween = this.game.add.tween(this.body).to(destination, duration, Phaser.Easing.Linear.None, true, 100, -1, true)
    }
  }

  startMovement () {
    console.log('Starting movement for ' + this.id + ' ' + this.spriteName)
    if (this.tween) {
      if (this.spriteName === 'Elevator') {
        this.light.createLight(this.x + 60, this.y - 550, 450.0, 0.5)
      } else if (this.spriteName === 'smallPlatform') {
        this.light.createLight(this.body.x + 100, this.body.y + 800, 250.0, 0.5)
      }
      if (this.tween.isPaused) {
        this.tween.resume()
      } else if (!this.tween.isRunning) {
        this.tween.start()
      }
    }
  }

  nextTween () {
    if (this.tween) {
      if (this.spriteName === 'Elevator') {
        this.light.createLight(this.x + 60, this.y - 550, 450.0, 0.5)
        this.tween.start([1])
      }
    }
  }

  stopMovement () {
    if (this.tween.isRunning) {
      this.tween.pause()
    }
  }

  steppedOn (otherPhaserBody, otherP2Body, myShape, otherShape, contactEqns) {
    if (otherPhaserBody !== null && otherPhaserBody.sprite !== null && otherPhaserBody.sprite.name === 'Main Player') {
      if (myShape === this.topSensor) {
        this.player = otherPhaserBody.sprite
        this.playerOffsetX = this.player.body.x - this.body.x
      }
    }
  }

  steppedOff (otherPhaserBody, otherP2Body, myShape, otherShape) {
    if (otherPhaserBody !== null && otherPhaserBody.sprite !== null && otherPhaserBody.sprite.name === 'Main Player') {
      if (myShape === this.topSensor) {
        this.player.dynamic = true
        this.player = null
      }
    }
  }

  tweenDone () {
    if (this.spriteName === 'Elevator') {
      this.stopMovement()
      this.tween = this.game.add.tween(this.body).to(this.y + 50, this.duration, Phaser.Easing.Linear.None, false, 10, 0, false)
      console.log('New tween set')
    }
  }

  changeOffset (deltaX, deltaY) {
    if (this.player != null) {
      this.playerOffsetX += deltaX
      // this.playerOffsetX -= deltaX
      // this.playerOffsetY += deltaY
      // this.playerOffsetY -= deltaY
    }
  }

  update () {
    super.update()
    if (this.player != null) {
      this.player.body.x = this.body.x + this.playerOffsetX
    }
  }
}

export default MovingPlatform
