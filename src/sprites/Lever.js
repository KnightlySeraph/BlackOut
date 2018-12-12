/* globals __DEV__ */

// Import the entire 'phaser' namespace
import Phaser from 'phaser'
import P2 from 'p2'
import Platform from '../sprites/Platform.js'

// Import needed functions from utils and config settings
import { sequentialNumArray } from '../utils.js'
import config from '../config'

import TestLevel from '../states/TestLevel.js'
import Jumper from '../sprites/Jumper.js'
import Timer from '../sprites/Timer.js'

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
      this.scale.setTo(width / 35, height / 78)
      this.body.setRectangle(width / 2.5, height / 2.5, 22.5, 21)
    } else {
      this.scale.setTo(width / 34, height / 46)
      this.body.setRectangle(width * 1.25, height / 2.3, 24, 45)
    }

    this.myAnimations()
    
    this.body.debug = __DEV__

    this.body.setCollisionGroup(this.game.leverGroup)
    this.body.data.shapes[0].sensor = true // Makes the object pass throughable
    this.body.collides(this.game.playerGroup)

    this.anchor.setTo(0, 0)

    this.isInteractable = true

    this.ispulled = false

    // Create the timer
    this.myTimer = new Timer()
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
    this.light.createLight(this.body.x + 25, this.body.y - 2830, 150.0, 2) // 150
    this.animations.play('on')
    this.ispulled = true

    switch (this.id) {
      case config.ELEVATOR_1: // Elevator
        if (Lever.movers[this.id]) {
          let curPlatform = Lever.movers[this.id]
          curPlatform.startMovement()
        }
        break

        case config.LEVER4_LVL1:
        this.game.LEVER4_LVL1 = true
        break

      case config.LEVER5_LVL1:
        this.game.LEVER5_LVL1 = true
        Lever.creations[config.PLATFORM_2].startMovement()
        break
    
      case config.LEVER6_LVL1:
        this.game.LEVER6_LVL1 = true
        break
      
      case config.WALL_3:
      if (Lever.creations[this.id]) {
        this.removePlatform(this.id)
      }
        this.game.LEVER3_LVL1 = true
        break

      case config.WALL_2:
      if (Lever.creations[this.id]) {
        this.removePlatform(this.id)
      }
        this.game.LEVER2_LVL1 = true
        break
      
      case config.WALL_1:
      if (Lever.creations[this.id]) {
        this.removePlatform(this.id)
      }
        this.game.LEVER1_LVL1 = true
        break

      case config.LEVER1_LVL2:
        Lever.creations[config.PLATFORM_3].startMovement()
        break

      case config.LEVER2_LVL2:
        this.game.L2_LVL2 = true
        break

      case config.LEVER3_LVL2:
        this.game.L3_LVL2 = true
        break

      case config.LEVER4_LVL2:
        this.game.L4_LVL2 = true
        break

      case config.LEVER5_LVL2:
        this.game.L5_LVL2 = true
        break

      case config.LEVER6_LVL2:
        this.game.L6_LVL2 = true
        break

      case config.LEVER7_LVL2:
        this.game.L7_LVL2 = true
        break

      default:
        this.removePlatform(this.id)
        break
    }
  }

  turnOff () {
    if (__DEV__) { console.log('lever off') }
    this.game.sounds.play('lever2', config.SFX_VOLUME)
    this.light.createLight(this.body.x + 25, this.body.y - 2830, 150.0, 2)
    this.animations.play('off')

    this.ispulled = false
    switch (this.id) {
      case config.ELEVATOR_1: // Elevator
        if (Lever.movers[this.id]) {
          Lever.movers[this.id].startMovement()
        }
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
      this.light.createLight(Lever.creations[id].x, Lever.creations[id].y - 2830, 250.0, 2)
      let deleteMe = Lever.creations[id]
      delete Lever.creations[id]
      deleteMe.destroy()
    }
  }

  /**
   * Called every tick while the sprite is awake and in the world.
   * @override
   */
  update () {
    // Always call the parent's update
    super.update()
    this.myTimer.TimerDriver()
    
    if (this.game.removeF2P) {
      if (Lever.creations[config.LVL2_WALL]) {
        this.removePlatform(config.LVL2_WALL)
      }
      this.game.removeF2P = false
    }
  }

}

Lever.creations = []
Lever.movers = []

export default Lever
