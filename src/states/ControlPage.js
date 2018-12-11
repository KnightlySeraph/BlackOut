import Phaser from 'phaser'

// Import config settings
import config from '../config'

class ControlPage extends Phaser.State {

  preload () {
    
  }

  create () {
    this.game.camera.flash('000000', 1000, false, 1)
    let controlPageBG = this.game.add.sprite(0, 0, 'controlMenu', 0)
    controlPageBG.smoothed = false

    this.adMovement = this.game.add.sprite(this.game.world.centerX - 400, this.game.world.centerY - 350, 'controlSprites', 0)
    this.adMovement.smoothed = false
    this.adMovement.scale.setTo(2, 2)

    this.lrMovement = this.game.add.sprite(this.game.world.centerX - 400, this.game.world.centerY - 250, 'controlSprites', 0)
    this.lrMovement.smoothed = false
    this.lrMovement.scale.setTo(2, 2)

    this.tabAnim = this.game.add.sprite(this.game.world.centerX - 400, this.game.world.centerY - 150, 'controlSprites', 0)
    this.tabAnim.smoothed = false
    this.tabAnim.scale.setTo(2, 2)

    this.escAnim = this.game.add.sprite(this.game.world.centerX - 400, this.game.world.centerY - 50, 'controlSprites', 0)
    this.escAnim.smoothed = false
    this.escAnim.scale.setTo(2, 2)

    this.eAnim = this.game.add.sprite(this.game.world.centerX - 400, this.game.world.centerY + 50, 'interactAnim', 0)
    this.eAnim.smoothed = false
    this.eAnim.scale.setTo(2, 2)

    this.spaceAnim = this.game.add.sprite(this.game.world.centerX - 400, this.game.world.centerY + 150, 'spacebarAnim', 0)
    this.spaceAnim.smoothed = false
    this.spaceAnim.scale.setTo(2, 2)

    this.controlsAnimations()

    // Set up the return to menu button
    let buttonReturn
    buttonReturn = this.game.add.button(this.game.world.centerX + 500, this.game.world.centerY + 350, 'MenuButtons', returnToMenu, this, 24, 25, 26, 27)

    buttonReturn.smoothed = false
    buttonReturn.scale.setTo(8, 8)

    // let jText = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'jumpText', 0)
    // jText.scale.setTo(8, 8)
    // jText.smoothed = false

    // let jAnim = this.game.add.sprite(this.game.world.centerX - (this.game.world.centerX / 2), this.game.world.centerY, 'spacebarAnim', 0)
    // jAnim.scale.setTo(8, 8)
    // jAnim.smoothed = false
  }

  controlsAnimations () {
    this.adMovement.animations.add('mAnim', [0, 1], 10, true)
    this.adMovement.animations.play('mAnim', 2, true)

    this.lrMovement.animations.add('mAnim2', [2, 3], 10, true)
    this.lrMovement.animations.play('mAnim2', 2, true)

    this.tabAnim.animations.add('tabAnim', [4, 5], 10, true)
    this.tabAnim.animations.play('tabAnim', 2, true)

    // this.escAnim.animations.add('escAnim', [6, 7], 10, true)
    // this.escAnim.animations.play('escAnim', 2, true)

    // this.eAnim.animations.add('eAnim', [8, 9], 10, true)
    // this.eAnim.animations.play('eAnim', 2, true)

    // this.spaceAnim.animations.add('spaceAnim', [10, 11], 10, true)
    // this.spaceAnim.animations.play('spaceAnim', 2, true)
    
  }

}

function returnToMenu () {
  this.game.sounds.play('mainMenuClick', config.SFX_VOLUME)
  this.state.start('MainMenu')
}

export default ControlPage
