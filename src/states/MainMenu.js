import Phaser from 'phaser'

// Import config settings
import config from '../config'

/**
 * The MainMenu Page
 */
class MainMenu extends Phaser.State {

  preload () {
    this.game.load.spritesheet('LeverFloor', 'assets/images/leverSpriteSheet.png', 32, 32, 5, 0, 0)
    this.game.load.spritesheet('LeverWall', 'assets/images/leverWallSpriteSheet.png', 32, 32, 5, 0, 0)
    this.game.load.spritesheet('Spring', 'assets/images/springSpriteSheet.png', 32, 32, 10, 0, 0)
    this.game.load.spritesheet('Elevator', 'assets/images/main_elevator.png', 128, 288, 1, 0, 0)
    this.game.load.spritesheet('smallPlatform', 'assets/images/platform_small.png', 64, 32, 1, 0, 0)

    // The issue is the prites are not counted as two separtate sprites but a single one - aka talk to the artist about adding in margins/spaceing
    this.game.load.spritesheet('controlSprites', 'assets/images/controlspritesheet_64x32.png', 32, 32, 6, 0, 8) // should be 12 but it doesn't split the sprites correctly
    // this.game.load.spritesheet('adMovement', 'assets/images/adSpriteSheet_64x32.png', 64, 32, 1, 0, 0)

    this.load.spritesheet('vanishWall', 'assets/images/vanish_wall.png', 16, 64)
  }

  create () {
    this.game.sounds.stop()
    this.game.sounds.play('gears1', 0.5)
    this.game.sounds.play('mainAmbience', config.MUSIC_VOLUME, true)

    this.game.LVL1_PASSED = false
    this.game.LVL2_PASSED = false
    this.game.camera.flash('000000', 1000, false, 1)
    let mainMenuBG = this.game.add.sprite(0, 0, 'mainMenu', 0)
    mainMenuBG.smoothed = false

    // Add team logo
    let logo = this.game.add.sprite(this.game.world.centerX - 800, this.game.world.centerY - 400, 'mmLogo', 0)
    logo.scale.setTo(9, 9)
    logo.smoothed = false

    // Add class logo
    let sethsBastment = this.game.add.sprite(this.game.world.centerX - 620, this.game.world.centerY + 370, 'sethsBastment', 0)
    sethsBastment.scale.setTo(3, 3)
    sethsBastment.smoothed = false

    // Make the buttons
    let buttonX = this.game.world.centerX - 715
    let buttonY = this.game.world.centerY
    let buttonPlay = this.game.add.button(buttonX, buttonY - 190, 'MenuButtons', moveToTestLevel, this, 4, 5, 6, 7) // over, out, down, up
    let buttonControls = this.game.add.button(buttonX, buttonY - 10, 'MenuButtons', moveToControls, this, 8, 9, 10, 11)
    let buttonExit = this.game.add.button(buttonX, buttonY + 140, 'MenuButtons', moveToExit, this, 24, 25, 26, 27)

    buttonPlay.smoothed = false
    buttonPlay.scale.setTo(8, 8)

    buttonControls.smoothed = false
    buttonControls.scale.setTo(8, 8)

    buttonExit.smoothed = false
    buttonExit.scale.setTo(8, 8)
  }

}

function moveToTestLevel () {
  this.game.sounds.play('mainMenuClick', config.SFX_VOLUME)
  this.state.start('TestLevel')
}

function moveToControls () {
  this.game.sounds.play('mainMenuClick', config.SFX_VOLUME)
  this.state.start('ControlPage')
}

function moveToExit () {
  this.game.sounds.play('mainMenuClick', config.SFX_VOLUME)
  // Exit Game
}

export default MainMenu

/*
array of tweening platforms with a function call on what to do after the tween has finnished, turn off looping
*/
