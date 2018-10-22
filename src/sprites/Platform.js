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
class Platform extends Phaser.Sprite {
  constructor ({ game, x, y, width, height }) {
    super(game, 0, 0, 'blank', 0)
    this.name = 'plat'
//    this.scale.setTo(width / 10, height / 10)

    this.body = new Phaser.Physics.P2.Body(this.game, this, x, y)
    this.body.dynamic = false
    this.body.setRectangle(width, height, 0, 0)
    this.body.debug = __DEV__

    this.body.setCollisionGroup(this.game.platformGroup)
    this.body.collides(this.game.playerGroup)

    this.anchor.setTo(0, 0)
  }
}

export default Platform
