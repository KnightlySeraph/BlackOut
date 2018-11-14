import Phaser from 'phaser'

/**
 * 
 */
class MainMenu extends Phaser.State {

  preload () {
  }

  create () {
    let buttonPlay, buttonSettings, buttonControls, buttonExit
    
    buttonPlay = this.game.add.button(this.game.world.centerX - 400, this.game.world.centerY - 150, 'PlayButton', moveToTestLevel, this, 2, 2, 3, 3) // hover, idle, on click,  
    buttonControls = this.game.add.button(this.game.world.centerX - 400, this.game.world.centerY - 50, 'ControlsButton', moveToSettings, this, 4, 4, 5, 5)
    buttonSettings = this.game.add.button(this.game.world.centerX - 400, this.game.world.centerY + 50, 'SettingsButton', moveToSettings, this, 6, 6, 7, 7)
    buttonExit = this.game.add.button(this.game.world.centerX - 400, this.game.world.centerY + 150, 'SettingsButton', moveToExit, this, 12, 12, 13, 13)
 
    buttonPlay.smoothed = false
    buttonPlay.scale.setTo(5, 5)

    buttonControls.smoothed = false
    buttonControls.scale.setTo(5, 5)

    buttonSettings.smoothed = false
    buttonSettings.scale.setTo(5, 5)

    buttonExit.smoothed = false
    buttonExit.scale.setTo(5, 5)
  }

}

function moveToTestLevel () {
  this.state.start('TestLevel')
}

function moveToSettings () {
  // this.state.start('Settings')
}

function moveToExit () {
  // Exit Game
}

export default MainMenu

/*
array of tweening platforms with a function call on what to do after the tween has finnished, turn off looping
*/
