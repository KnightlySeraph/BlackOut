/* globals __DEV__ */

// Import the entire 'phaser' namespace
import Phaser from 'phaser'
import P2 from 'p2'

// Import needed functions from utils and config settings
import { sequentialNumArray } from '../utils.js'
import config from '../config'

import MainPlayer from './Player.js'

/**
 * The "spring" sprite. This class encapsulates the logic for the "spring" sprite.
 *
 * See Phaser.Sprite for more about sprite objects and what they support.
 */
class Jumper extends Phaser.Sprite {
  constructor ({ game, x, y, width, height, id }) {
    super(game, 0, 0, 'Spring', 0)
    this.name = 'jumper'
    this.smoothed = false
    //this.scale.setTo(2, 2)
    this.scale.setTo(width / 24.8, height / 24.8)
    this.id = id
    this.body = new Phaser.Physics.P2.Body(this.game, this, x, y)
    this.body.dynamic = false
    this.body.setRectangle(width, height / 3.2, 31, 56)
    this.body.debug = __DEV__

    // this.isSpring = true

    this.body.setCollisionGroup(this.game.jumperGroup)
    this.body.data.shapes[0].sensor = true // Makes the object pass throughable
    this.body.collides(this.game.playerGroup)

    this.anchor.setTo(0, 0)
  }
}

export default Jumper
