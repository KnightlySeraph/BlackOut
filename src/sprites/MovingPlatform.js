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

    this.setupTween(this.id)
  }

  setupTween (id) {
    let duration = 8000
    let destination = {}

    switch (id) {
      case 1: destination = { x: this.x - 100 }; break
      case 2: destination = { x: this.x + 100 }; break
      case 3: destination = { y: this.y - 100 }; break
      case 4: destination = { y: this.y + 100 }; break
      // case 5:
      //   // move left and up
      //   this.tween = this.game.add.tween(this.body).to({ x: this.x - 100 }, 5000, Phaser.Easing.Linear.None, false, 100, -1, true)
      //   this.tween = this.game.add.tween(this.body).to({ y: this.y - 100 }, 5000, Phaser.Easing.Linear.None, false, 100, -1, true)
      //   // tween left and up
      //   break
      default:
        console.log('Error steppedOn: this moving platform id is not valid.')
    }

    this.tween = this.game.add.tween(this.body).to(destination, duration, Phaser.Easing.Linear.None, false, 100, -1, true)
    if (this.spriteName === 'Elevator') { 
    this.light.createLight(this.body.x + 30, this.body.y - 600, 250.0, 0.5)
    } else if (this.spriteName === 'smallPlatform'){
      this.light.createLight(this.body.x + 30, this.body.y - 400, 150.0, 0.5)
    }
  }

  startMovement () {
    if (this.tween.isPaused) {
      this.tween.resume()
    } else if (!this.tween.isRunning) {
      this.tween.start()
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
        // this.tween.start()
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

  changeOffset (deltaX, deltaY) {
    if (this.player != null) {
      /*switch (this.id) {
        case 1:
          // move left
          this.playerOffsetX += deltaX
          break
        case 2:
          // move right
          this.playerOffsetX -= deltaX
          break
        case 3:
          // move up
          this.playerOffsetY += deltaY
          break
        case 4:
          // move down
          this.playerOffsetY -= deltaY
          break
        case 5:
          // move left and up
          this.playerOffsetX += deltaX
          this.playerOffsetY += deltaY
          break
        default:
          console.log('Error changeOffset: this moving platform id is not valid.')
      }*/
       this.playerOffsetX += deltaX
      // this.playerOffsetX -= deltaX
      // this.playerOffsetY += deltaY
      // this.playerOffsetY -= deltaY
    }
  }

  update () {
    super.update()
    if (this.player != null) {
      /*switch (this.id) {
        case 1:
          this.player.body.x = this.body.x + this.playerOffsetX
          console.log('move left')
          break
        case 2:
          this.player.body.x = this.body.x + this.playerOffsetX
          console.log('move right')
          break
        case 3:
          this.player.body.y = this.body.y + this.playerOffsetY
          console.log('move up')
          break
        case 4:
          this.player.body.y = this.body.y + this.playerOffsetY
          console.log('move down')
          break
        case 5:
          this.player.body.x = this.body.x + this.playerOffsetX
          this.player.body.y = this.body.y + this.playerOffsetY
          console.log('move left UP')
          break
        default:
          console.log('Error Update: this moving platform id is not valid.')
      }*/
      this.player.body.x = this.body.x + this.playerOffsetX
    }
  }
}

export default MovingPlatform
