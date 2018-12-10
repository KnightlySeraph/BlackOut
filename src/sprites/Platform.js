/* globals __DEV__ */

// Import the entire 'phaser' namespace
import Phaser from 'phaser'

/**
 * The platform sprite. This class encapsulates the logic for the platform sprite.
 *
 * See Phaser.Sprite for more about sprite objects and what they support.
 */
class Platform extends Phaser.Sprite {
  constructor ({ game, x, y, id, light }) {
    super(game, 0, 0, 'vanishWall', 0)
    this.scale.setTo(3, 3, 3)
    this.smoothed = false
    this.name = 'plat'
    this.id = id
    this.light = light
    // this.scale.setTo(width / 10, height / 10)
    this.id = id
    this.body = new Phaser.Physics.P2.Body(this.game, this, x, y)
    this.body.dynamic = false
    this.body.setRectangle(46, 95, 47, 47.2)
    this.body.debug = __DEV__

    this.body.setCollisionGroup(this.game.platformGroup)
    this.body.collides(this.game.playerGroup)

    this.anchor.setTo(0, 0)
  }
}

export default Platform
