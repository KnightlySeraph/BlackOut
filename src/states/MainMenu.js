import Phaser from 'phaser'

/**
 * 
 */
class MainMenu extends Phaser.State {

  preload () {
    // put in button sprites here
    // this.game.load.spriteSheet( name of sprite, 'link to sprite', size of grid slice (x,y, max of sprites in sheet))
  }

  create () {
    let buttonPlay, buttonSettings, buttonControls

    buttonPlay = this.game.add.button(this.game.world.centerX - 1000, this.game.world.centerY, 'PlayButton', moveToTestLevel, this, 'hover', 0, 0)
  }
}

function moveToTestLevel () {
  this.state.start('TestLevel')
}

export default MainMenu
