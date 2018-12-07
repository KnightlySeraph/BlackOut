import Phaser from 'phaser'

class ControlPage extends Phaser.State {

  preload () {
    
  }

  create () {
    this.game.camera.flash('000000', 2000, false, 1)
    let controlPageBG = this.game.add.sprite(0, 0, 'controlMenu', 0)
    controlPageBG.smoothed = false

    this.adMovement = this.game.add.sprite(this.game.world.centerX - 400, this.game.world.centerY - 350, 'adMovement', 0)
    this.adMovement.smoothed = false
    this.adMovement.scale.setTo(2, 2)

    this.controlsAnimations()

    // Set up the return to menu button
    let buttonReturn
    buttonReturn = this.game.add.button(this.game.world.centerX + 500, this.game.world.centerY + 350, 'ExitButton', returnToMenu, this, 12, 12, 13, 13)

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
    this.adMovement.animations.play('mAnim', 10, false)
    
    // this.animations.add('mAnim2', [2, 3], 2, true)
    // this.animations.add('tAnim', [4, 5], 2, true)
    // this.animations.add('escAnim', [6, 7], 2, true)
    // this.animations.add('eAnim', [8, 9], 2, true)
    // this.animations.add('sAnim', [10, 11], 2, true)
  }

}

function returnToMenu () {
  this.state.start('MainMenu')
}

export default ControlPage
