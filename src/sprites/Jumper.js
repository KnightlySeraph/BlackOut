/* globals __DEV__ */

// Import the entire 'phaser' namespace
import Phaser from 'phaser'

// Import needed functions from utils and config settings
import config from '../config'

/**
 * The "spring" sprite. This class encapsulates the logic for the "spring" sprite.
 *
 * See Phaser.Sprite for more about sprite objects and what they support.
 */
class Jumper extends Phaser.Sprite {
  constructor ({ game, x, y, width, height, id, light }) {
    super(game, 0, 0, 'Spring', 0)
    this.name = 'jumper'
    this.smoothed = false
    this.light = light

    this.scale.setTo(width / 30, height / 30)
    this.id = id
    this.body = new Phaser.Physics.P2.Body(this.game, this, x, y)
    this.body.dynamic = false
    this.body.setRectangle(width / 1.1, height / 4, 27, 47)
    this.body.debug = __DEV__

    this.myAnimations()

    // this.isSpring = true

    this.body.setCollisionGroup(this.game.jumperGroup)
    this.body.data.shapes[0].sensor = true // Makes the object pass throughable
    this.body.collides(this.game.playerGroup)

    this.anchor.setTo(0, 0)
  }

  myAnimations () {
    // add animations
    this.animations.add('stopped', [0], 1, true)
    this.animations.add('jumping', [1, 2, 3, 4, 5, 6, 7, 8, 9], 10, false)

    // Configure 'jumping' to change to 'stopped' when it ends
    this.animations.getAnimation('jumping').onComplete.add(() => {
      this.animations.play('stopped', 10, true)
    }, this)

    // Start in the 'stopped' animation
    this.animations.play('stopped', 10, true)
  }

  animate (isOn) {
    if (isOn === true) {
      this.game.sounds.play('spring', config.SFX_VOLUME)
      this.light.createLight(this.body.x + 29, this.body.y - 2850, 250.0, 1.8)
      this.animations.play('jumping', 10, false)
    } else {
      this.animations.play('stopped', 10, true)
    }
  }
}

export default Jumper
