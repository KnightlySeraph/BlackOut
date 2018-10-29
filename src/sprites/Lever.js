/* globals __DEV__ */

// Import the entire 'phaser' namespace
import Phaser from 'phaser'
import P2 from 'p2'
import Platform from '../sprites/Platform.js'

// Import needed functions from utils and config settings
import { sequentialNumArray } from '../utils.js'
import config from '../config'

// TODO expand lever function to include 1 or 2 sprite choices?

/**
 * The lever sprite. This class encapsulates the logic for the lever sprite.
 *
 * See Phaser.Sprite for more about sprite objects and what they support.
 */
class Lever extends Phaser.Sprite {
  constructor ({ game, x, y, width, height, spriteKey, id }) {
    super(game, 0, 0, spriteKey, 0)
    this.name = 'lever'
//    this.scale.setTo(width / 10, height / 10)
    this.id = id
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

      switch (this.id) {
        case 4:
          Lever.creations.push(
            new Platform({ // Test Platform
              game: this.game, x: 1400, y: 600, width: 200, height: 50, id: this.id
            })
          )
          break

        case 5:
          Lever.creations.push(
            new Platform({ // Test Platform
              game: this.game, x: 1600, y: 600, width: 200, height: 50, id: this.id
            })
          )
          break
      }
    } else if (this.ispulled === true) {
      console.log('lever off')
      this.ispulled = false
      this.removePlatform(this.id)
    }
  }

  removePlatform (id) {
    for (let i = 0; i < Lever.creations.length; i++) {
      if (Lever.creations[i].id === id) { // does lever need a platform related id? or how do I check to see if a specific platform exhists in teh world to be interacted with?
        console.log("I've found the Id")
        let deleteMe = Lever.creations[i]
        Lever.creations.splice(i, 1)
        deleteMe.destroy()
        console.log("destroyed")
        // let deleteMe = this.platforms[this.platforms.length - 1]
        // this.platforms.splice(this.platforms.length - 1, 1)
        // deleteMe.destroy()
        // TODO look up JS Map type for id w3school?
      }
    }
  }
}

Lever.creations = []

export default Lever
