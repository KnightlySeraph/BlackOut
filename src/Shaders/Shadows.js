import Phaser from 'phaser'

/* Will be used to provide an adjustbale amount of darkness to the world
*/
class Shadows extends Phaser.Filter {
  constructor (game) {
    super(game)

    // Set Filter Uniforms
    this.uniforms.darkness = { type: '1f', value: 0 }

    // Setup the glsl fragment shader source
    this.fragmentSrc = [
      'precision mediump float;',
      'uniform float darkness;',
      'varying vec2 vTextureCoord;',
      'uniform sampler2D uSampler;',
      'void main(void){',
      'vec4 dark = texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y)) * darkness;',
      'gl_FragColor = dark;',
      '}'
    ]
  }

  // Get and Set
  get darkness () {
    return this.uniforms.darkness.value
  }

  set darkness (value) {
    this.dirty = true
    this.uniforms.darkness.value = value
  }
}

// Allow export
export default Shadows
