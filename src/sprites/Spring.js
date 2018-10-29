/* globals __DEV__ */

// Import the entire 'phaser' namespace
import Phaser from 'phaser'
import P2 from 'p2'

// Import needed functions from utils and config settings
import { sequentialNumArray } from '../utils.js'
import config from '../config'
import Player from './Player.js';

/**
 * The spring sprite. This class encapsulates the logic for the spring sprite.
 *
 * See Phaser.Sprite for more about sprite objects and what they support.
 */
class Spring extends Phaser.Sprite {
  constructor ({ game, x, y, width, height, id }) {
    super(game, 0, 0, 'blank', 0)
    this.name = 'spring'
//    this.scale.setTo(width / 10, height / 10)
    this.id = id
    this.body = new Phaser.Physics.P2.Body(this.game, this, x, y)
    this.body.dynamic = false
    this.body.setRectangle(width, height, 0, 0)
    this.body.debug = __DEV__

    this.body.setCollisionGroup(this.game.springGroup)
    this.body.data.shapes[0].sensor = true // Makes the object pass throughable
    this.body.collides(this.game.playerGroup)

    this.anchor.setTo(0, 0)
  }

  interact () {
    console.log('IN Spring')
    // this.MainPlayer.body.moveUp(300)
    // this.Player.body.moveUp(300)
  }
}

export default Spring
