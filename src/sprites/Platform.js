/* globals __DEV__ */

// Import the entire 'phaser' namespace
import Phaser from 'phaser'
import P2 from 'p2'

// Import needed functions from utils and config settings
import { sequentialNumArray } from '../utils.js'
import config from '../config'

/**
 * The main player-controllable sprite. This class encapsulates the logic for the main
 * player sprite with all of it's animations and states. It includes a simple, hard-coded
 * movement state-machine that coordinates transitions between differnt movement states
 * and the idle state. It shows examples of setting up animations that are embedded in a
 * larger sprite-sheet and carefule management of the current state. No physics are used
 * in this example, only basic animation.
 *
 * See Phaser.Sprite for more about sprite objects and what they support.
 */
class Platform extends Phaser.Sprite {
  constructor ({ game, x, y, width, height }) {
    super(game, x, y, 'blank', 0)
    this.name = 'Main Player'
    this.anchor.setTo(0.5, 0.5)
    this.scale.setTo(width / 10, height / 10)

    this.body = new Phaser.Physics.P2.Body(this.game, this, x, y)
    this.body.dynamic = false
    this.body.setRectangle(width, height, 0, 0)
    this.body.debug = __DEV__
  }
}

export default Platform
