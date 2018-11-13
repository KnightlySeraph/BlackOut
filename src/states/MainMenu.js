import Phaser from 'phaser'

/**
 * 
 */
class MainMenu extends Phaser.State {

  preload () {
  }

  create () {
    let buttonPlay, buttonSettings, buttonControls

    buttonPlay = this.game.add.button(this.game.world.centerX - 100, this.game.world.centerY, 'PlayButton', moveToTestLevel, this, 0, 1, 2, 3)
  }
}

function moveToTestLevel () {
  this.state.start('TestLevel')
}

export default MainMenu

/*
array of tweening platforms with a function call on what to do after the tween has finnished, turn off looping
*/
