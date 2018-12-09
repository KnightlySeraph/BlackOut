/* globals __DEV__ */

// Import the entire 'phaser' namespace
import Phaser from 'phaser'
import P2 from 'p2'

/**
 * The Finish Point sprite. This class sets an empty object that can be walked through by the player.
 *
 * See Phaser.Sprite for more about sprite objects and what they support.
 */
class FinishPoint extends Phaser.Sprite {
  constructor ({ game, x, y, width, height }) {
    super(game, 0, 0, '', 0)
    this.name = 'finishPoint'
    this.scale.setTo(width / 24.8, height / 24.8)
    this.body = new Phaser.Physics.P2.Body(this.game, this, x, y)
    this.body.dynamic = false
    this.body.setRectangle(width, height / 3.2, 31, 56)
    this.body.debug = __DEV__

    this.body.setCollisionGroup(this.game.finishGroup)
    this.body.data.shapes[0].sensor = true // Makes the object pass throughable
    this.body.collides(this.game.playerGroup)

    this.anchor.setTo(0, 0)
  }
}
export default FinishPoint
