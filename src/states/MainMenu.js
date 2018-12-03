import Phaser from 'phaser'
import RadialLightFilter from '../Shaders/RadialLightFilter'

/**
 * 
 */
class MainMenu extends Phaser.State {

  preload () {
    this.game.load.spritesheet('LeverFloor', 'assets/images/leverSpriteSheet.png', 32, 32, 5, 0, 0)
    this.game.load.spritesheet('LeverWall', 'assets/images/leverWallSpriteSheet.png', 32, 32, 5, 0, 0)
    this.game.load.spritesheet('Spring', 'assets/images/springSpriteSheet.png', 32, 32, 10, 0, 0)
  }

  create () {
    let mainMenuBG = this.game.add.sprite(0, 0, 'mainMenu', 0)
    mainMenuBG.smoothed = false

    let logo = this.game.add.sprite(this.game.world.centerX - 800, this.game.world.centerY - 400, 'mmLogo', 0)
    logo.scale.setTo(9, 9)
    logo.smoothed = false

    let sethsBastment = this.game.add.sprite(this.game.world.centerX - 620, this.game.world.centerY + 370, 'sethsBastment', 0)
    sethsBastment.scale.setTo(3, 3)
    sethsBastment.smoothed = false

    let buttonPlay, buttonControls, buttonExit
    
    buttonPlay = this.game.add.button(this.game.world.centerX - 715, this.game.world.centerY - 190, 'PlayButton', moveToTestLevel, this, 2, 2, 3, 3) // hover, idle, on click
    
    buttonControls = this.game.add.button(this.game.world.centerX - 715, this.game.world.centerY - 10, 'ControlsButton', moveToSettings, this, 4, 4, 5, 5)

    buttonExit = this.game.add.button(this.game.world.centerX - 715, this.game.world.centerY + 140, 'SettingsButton', moveToExit, this, 12, 12, 13, 13)
 
    buttonPlay.smoothed = false
    buttonPlay.scale.setTo(8, 8)

    buttonControls.smoothed = false
    buttonControls.scale.setTo(8, 8)

    buttonExit.smoothed = false
    buttonExit.scale.setTo(8, 8)
  }

}

function moveToTestLevel () {
  this.state.start('TestLevel')
}

function moveToControls () {
  this.state.start('ControlPage')
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
