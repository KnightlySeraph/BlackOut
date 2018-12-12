/* globals __DEV__ */

// Import the entire 'phaser' namespace
import Phaser from 'phaser'

/**
 * The "spring" sprite. This class encapsulates the logic for the "spring" sprite.
 *
 * See Phaser.Sprite for more about sprite objects and what they support.
 */
class PitOfDeath extends Phaser.Sprite {
  constructor ({ game, x, y, width, height, light, name }) {
    super(game, 0, 0, '', 0)
    this.name = name
    this.id = 'pitOfDeath'
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
    if (this.name === 'spawn') { // Spawn Zone
      playerObj.x = 560
      playerObj.y = 1951.6
    } else if (this.name === 'first') { // 2nd kill zone (under elevators)
      playerObj.x = 3500
      playerObj.y = 2600
    } else if (this.name === 'second') { // 3rd kill zone (on second floor)
      playerObj.x = 4480
      playerObj.y = 1800
    } else if (this.name === 'secondLVL') {
      playerObj.x = 3900
      playerObj.y = 1900
    } else if (this.name === 'third') { // 4th kill zone (on third floor)
      playerObj.x = 4480
      playerObj.y = 1200
    }
    this.game.resetLight = false
  }
}

export default PitOfDeath
