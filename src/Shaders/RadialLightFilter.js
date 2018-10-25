// The Phaser Filter to use on the player
import RadialLightShader from './RadialLightShader.glsl'

// Import Phaser
import Phaser from 'phaser'

class RadialLightFilter extends Phaser.Filter {
  constructor (game) {
    super(game)

    // Set Filter Uniforms
    this.uniforms.lightPos = { type: '2fv', value: [ -1, -1 ] }
    this.uniforms.socket2Pos = { type: '2fv', value: [ -1, -1 ] }
    this.uniforms.socket3Pos = { type: '2fv', value: [ -1, -1 ] }
    this.uniforms.socket4Pos = { type: '2fv', value: [ -1, -1 ] }
    this.uniforms.socket5Pos = { type: '2fv', value: [ -1, -1 ] }

    this.uniforms.timedDistance = { type: '1f', value: 0 }
    // this.uniforms.socket2 = { type: '0', value: false }

    // Setup the glsl fragment shader source
    this.fragmentSrc = RadialLightShader
  }

  moveLight (pos) {
    this.uniforms.lightPos.value[0] = pos.x
    this.uniforms.lightPos.value[1] = pos.y
  }

  set timedDistance (value) {
    this.uniforms.timedDistance.value = value
  }
}

export default RadialLightFilter
