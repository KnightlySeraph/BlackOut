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
class MovingPlatform extends Phaser.Sprite {
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

    this.body.setCollisionGroup(this.game.movingPlatformGroup)
    this.body.collides(this.game.playerGroup)

    this.anchor.setTo(0, 0)

    // Create a new sensor to see if player has collided
    /* WIP
    let checker = new MovingPlatform(game, x, y, width, height, id, maxVelocity)
    checker.body = new Phaser.Physics.P2.Body(this.game, this, x, y)
    checker.body.x = this.body.x
    checker.body.y = this.body.y
    checker.body.dynamic = false
    checker.body.setRectangle(width, height, 0, height)

    checker.body.data.shapes[0].sensor = true

    checker.body.setCollisionGroup(this.game.movingPlatformGroup)
    checker.body.collides(this.game.playerGroup)

    checker.anchor.setTo(0, 0)
    */

  }

  /**
   * Moves a movable platform up, dow, left, or right based on the type of movement indicated
   * 
   * @param {*} mp the MovingPlatform
   * @param {*} p the player
   * @param {*} type integer: 1 for left, 2 for right, 3 for up, 4 for down
   */
  moveMe (mp, p, type) {
  // mp.body.velocity.x = 0
    if (type === 1) { // If leftward platform
      console.log('Moving Leftward')
    } else if (type === 2) { // If rightward platform
      console.log('Moving Rightward')
    } else if (type === 3) { // If upward platform
      console.log('Moving Upward')
    } else if (type === 4) { // If downward platform
      console.log('Moving Downward')
    } else { console.log('Error not a valid type: please choose 1-4') }
  }
}

export default MovingPlatform
