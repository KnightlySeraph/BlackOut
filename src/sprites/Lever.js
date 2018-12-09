/* globals __DEV__ */

// Import the entire 'phaser' namespace
import Phaser from 'phaser'
import P2 from 'p2'
import Platform from '../sprites/Platform.js'

// Import needed functions from utils and config settings
import { sequentialNumArray } from '../utils.js'
import config from '../config'

import TestLevel from '../states/TestLevel.js'
import MovingPlatform from '../sprites/MovingPlatform.js'

// TODO expand lever function to include 1 or 2 sprite choices?

/**
 * The lever sprite. This class encapsulates the logic for the lever sprite.
 *
 * See Phaser.Sprite for more about sprite objects and what they support.
 */
class Lever extends Phaser.Sprite {
  constructor ({ game, x, y, width, height, spriteKey, id, light }) {
    super(game, 0, 0, spriteKey, 0)
    this.name = 'lever'
    this.light = light
    this.id = id
    this.body = new Phaser.Physics.P2.Body(this.game, this, x, y)
    // this.body.dynamic = false
    this.body.static = true
    this.smoothed = false

    if (spriteKey === 'LeverWall') {
      this.scale.setTo(width / 28, height / 58)
      this.body.setRectangle(width / 2, height / 2, 28, 28)
    } else {
      this.scale.setTo(width / 24, height / 36)
      this.body.setRectangle(width * 1.5, height / 1.3, 32, 50)
    }

    this.myAnimations()
    
    this.body.debug = __DEV__

    this.body.setCollisionGroup(this.game.leverGroup)
    this.body.data.shapes[0].sensor = true // Makes the object pass throughable
    this.body.collides(this.game.playerGroup)

    this.anchor.setTo(0, 0)

    this.isInteractable = true

    this.ispulled = false
  }

  myAnimations () {
    // add animations
    //if (this.sprite.name === 'LeverFloor') {
      this.animations.add('off', [4, 3, 2, 1, 0], 10, false)
      this.animations.add('on', [0, 1, 2, 3, 4], 10, false)
    //}
    // if (this.sprite.name === 'LeverWall') {
    //   this.animations.add('on', [4, 3, 2, 1, 0], 10, false)
    //   this.animations.add('off', [0, 1, 2, 3, 4], 10, false)
    // }
  }

  turnOn () {
    if (__DEV__) { console.log('lever on') }
    this.game.sounds.play('lever1', config.SFX_VOLUME)
    this.light.createLight(this.body.x + 29, this.body.y - 1120, 150.0, 2)
    this.animations.play('on')
    this.ispulled = true

    switch (this.id) {
      case config.ELEVATOR_1: // Elevator
        if (Lever.movers[this.id]) {
          let curPlatform = Lever.movers[this.id]
          curPlatform.startMovement()
        }
        break

      default:
        break
    }
  }

  turnOff () {
    if (__DEV__) { console.log('lever off') }
    this.game.sounds.play('lever2', config.SFX_VOLUME)
    this.light.createLight(this.body.x + 29, this.body.y - 1120, 150.0, 2)
    this.animations.play('off')

    this.ispulled = false
    switch (this.id) {
      case config.ELEVATOR_1: // Elevator
        if (Lever.movers[this.id]) {
          Lever.movers[this.id].startMovement()
        }
        break
      case config.LEVER_LVL1_FINISH:
        this.game.LVL1_Passed = true
        break

      case config.LEVER_LVL2_FINISH:
        this.game.LVL2_Passed = true
        break

      default:
        this.removePlatform(this.id)
        break
    }
  }

  interact () {
    // Check to see whether the lever is left or right (pulled or not)
    if (!this.ispulled) { this.turnOn() }
    else { this.turnOff() }
  }

  removePlatform (id) {
    if (Lever.creations[id]) {
      let deleteMe = Lever.creations[id]
      delete Lever.creations[id]
      deleteMe.destroy()
    }
  }
}

Lever.creations = {}
Lever.movers = {}

export default Lever
