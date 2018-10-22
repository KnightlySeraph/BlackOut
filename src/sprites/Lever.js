/* globals __DEV__ */

// Import the entire 'phaser' namespace
import Phaser from 'phaser'
import P2 from 'p2'
import Platform from '../sprites/Platform.js'

// Import needed functions from utils and config settings
import { sequentialNumArray } from '../utils.js'
import config from '../config'

/**
 * The lever sprite. This class encapsulates the logic for the lever sprite.
 *
 * See Phaser.Sprite for more about sprite objects and what they support.
 */
class Lever extends Phaser.Sprite {
  constructor ({ game, x, y, width, height }) {
    super(game, 0, 0, 'blank', 0)
    this.name = 'lever'
//    this.scale.setTo(width / 10, height / 10)
    
    this.body = new Phaser.Physics.P2.Body(this.game, this, x, y)
    // this.body.dynamic = false
    this.body.static = true
    this.body.setRectangle(width, height, 0, 0)
    this.body.debug = __DEV__

    this.body.setCollisionGroup(this.game.leverGroup)
    this.body.data.shapes[0].sensor = true // Makes the object pass throughable
    this.body.collides(this.game.playerGroup)

    this.anchor.setTo(0, 0)

    this.isInteractable = true

    this.ispulled = false
  }

  interact () {
    console.log('In pull func')
    // Check to see whether the lever is left or right (pulled or not)
    if ( this.ispulled === false) {
      console.log('lever on')
      this.ispulled = true

      this.platforms = [
        new Platform({ // Test Platform
          game: this.game, x: 1400, y: 600, width: 200, height: 50
        })]

    } else if (this.ispulled === true) {
      console.log('lever off')
      this.ispulled = false
      let deleteMe = this.platforms[this.platforms.length - 1]
      this.platforms.splice(this.platforms.length - 1, 1)
      deleteMe.destroy()
      // JS Map type for id w3school?
    }
  }
}

export default Lever
