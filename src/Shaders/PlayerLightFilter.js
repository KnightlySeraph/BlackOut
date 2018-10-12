// The Phaser Filter to use on the player
// This filter is expected to take the Frag Source Code PlayerLight.glsl
// Import PlayerLight.glsl
import PlayerPointLight from './PlayerLight.glsl'
// Import Phaser
import Phaser from 'phaser'

class PlayerLightFilter extends Phaser.Filter {
  constructor (game) {
    super(game)

    // Set Filter Uniforms
    this.uniforms.locationX = { type: '1f', value: 0 }
    this.uniforms.locationY = { type: '1f', value: 0 }

    // Setup the glsl fragment shader source
    this.fragmentSrc = PlayerPointLight
  }

  // Sets
  set locX (_pX) {
    this.uniforms.locationX.value = _pX
  }
  set locY (_pY) {
    this.uniforms.locationY.value = _pY
  }
}

export default PlayerLightFilter
