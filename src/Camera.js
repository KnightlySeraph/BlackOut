import Phaser from 'phaser'

/**
 * The CameraSpace class serves to make a camera in game that can be referenced, resized of switched to.
 */
class CameraSpace extends Phaser.Camera {
    camSetUp() {
    this.game.camera.x = 30
    this.game.camera.y = 50
  }
}
