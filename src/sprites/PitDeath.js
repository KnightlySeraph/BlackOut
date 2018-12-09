/* globals __DEV__ */

// Import the entire 'phaser' namespace
import Phaser from 'phaser'

/**
 * The "spring" sprite. This class encapsulates the logic for the "spring" sprite.
 *
 * See Phaser.Sprite for more about sprite objects and what they support.
 */
class PitOfDeath extends Phaser.Sprite {
  constructor ({ game, x, y, width, height, light }) {
    super(game, 0, 0, 'blank', 0)
    this.name = 'pitOfDeath'
    this.smoothed = false
    this.body = new Phaser.Physics.P2.Body(this.game, this, x, y)
    this.body.dynamic = false
    this.body.setRectangle(width, height, 0, 0)
    this.body.debug = __DEV__

    this.body.setCollisionGroup(this.game.deathGroup)
    this.body.data.shapes[0].sensor = true // Makes the object pass throughable
    this.body.collides(this.game.playerGroup)

    this.anchor.setTo(0, 0)
  }

  resetPlayer (playerObj) {
    this.game.camera.flash('000000', 1000, false, 1)
    // reset player light
    this.game.resetLight = true
    if (this.game.LVL_1_PASSED && !this.game.LVL_2_PASSED) { // TODO change value to be correct for level
      playerObj.x = 1000
      playerObj.y = 1000
    } else if (this.game.LVL_2_PASSED) {// TODO change value to be correct for level
      playerObj.x = 1200
      playerObj.y = 1000
    } else { // default respawn point
      playerObj.x = 3000
      playerObj.y = 1000
    }
    this.game.resetLight = false
  }
}

export default PitOfDeath
