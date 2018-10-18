// The Phaser Filter to use on the player
import RadialLightShader from './RadialLightShader.glsl'

// Import Phaser
import Phaser from 'phaser'

class RadialLightFilter extends Phaser.Filter {
  constructor (game) {
    super(game)

    // Set Filter Uniforms
    this.uniforms.lightPos = { type: '2fv', value: [ -1, -1 ] }

    // Setup the glsl fragment shader source
    this.fragmentSrc = RadialLightShader
  }

  moveLight (pos) {
    this.uniforms.lightPos.value[0] = pos.x
    this.uniforms.lightPos.value[1] = pos.y
  }
}

export default RadialLightFilter
