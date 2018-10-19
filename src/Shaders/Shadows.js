import Phaser from 'phaser'

// Read in the Shadows.glsl file
import shaderText from './Shadows.glsl'

/* Will be used to provide an adjustbale amount of darkness to the world
*/
class Shadows extends Phaser.Filter {
  constructor (game) {
    super(game)

    // Set Filter Uniforms
    this.uniforms.darkness = { type: '1f', value: 0 }
    this.uniforms.playerX = { type: '1f', value: 0 }
    this.uniforms.playerY = { type: '1f', value: 0 }
    this.uniforms.playerHeight = { type: '1f', value: 0 }
    this.uniforms.playerWidth = { type: '1f', value: 0 }
    this.uniforms.screenHeight = { type: '1f', value: 0 }
    this.uniforms.screenWidth = { type: '1f', value: 0 }

    // Setup the glsl fragment shader source
    this.fragmentSrc = shaderText
  }

  // Get and Set
  get darkness () {
    return this.uniforms.darkness.value
  }

  set darkness (value) {
    this.dirty = true
    this.uniforms.darkness.value = value
  }

  set PlayerLocationX (_x) {
    this.uniforms.playerX.value = _x
  }
  set PlayerLocationY (_y) {
    this.uniforms.playerX.value = _y
  }
  set playerHeight (height) {
    this.uniforms.playerHeight = height
  }
  set playerWidth (width) {
    this.uniforms.playerWidth = width
  }
  set screenHeight (_h) {
    this.uniforms.screenHeight.value = _h
  }
  set screenWidth (_w) {
    this.uniforms.screenWidth.value = _w
  }
}

// Allow export
export default Shadows
