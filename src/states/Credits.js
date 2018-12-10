import Phaser from 'phaser'

// Import config settings
import config from '../config'

/**
 * The Credits Page
 */
class Credits extends Phaser.State {

  preload () {
    this.return = this.game.input.keyboard.addKey(Phaser.KeyCode.ESC)
    this.game.world.setBounds(0, 0, this.game.width, this.game.height)
  }

  create () {
    this.game.sounds.stop()
    this.game.sounds.play('happyAmbience', config.MUSIC_VOLUME, true)
    this.game.camera.flash('000000', 1000, false, 1)
    let creditsBG = this.game.add.sprite(0, 0, 'credits', 0)
    creditsBG.smoothed = false
  }

  update () {
    super.update()
    if (this.return.justPressed()) {
      this.game.sounds.play('mainMenuClick', config.SFX_VOLUME)
      this.game.sounds.get('happyAmbience').stop()
      this.state.start('MainMenu')
    }
  }
}

export default Credits
