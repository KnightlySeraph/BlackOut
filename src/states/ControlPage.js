import Phaser from 'phaser'

class ControlPage extends Phaser.State {
  preload () {

  }


  create () {
    let controlPageBG = this.game.add.sprite(0, 0, 'controlMenu', 0)
    controlPageBG.smoothed = false

    // Set up the return to menu button
    let buttonReturn
    buttonReturn = this.game.add.button(this.game.world.centerX, this.game.world.centerY, 'PlayButton', returnToMenu, this, 2, 2, 3, 3)

    buttonReturn.smoothed = false
    buttonReturn.scale.setTo(8, 8)
  }

}

function returnToMenu () {
  this.state.start('MainMenu')
}

export default ControlPage
