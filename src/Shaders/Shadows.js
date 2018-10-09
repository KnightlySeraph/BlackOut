import Phaser from 'phaser'

/* Will be used to provide an adjustbale amount of darkness to the world
*/
class Shadows extends Phaser.Filter {
  constructor (game) {
    super(game)

    // Set Filter Uniforms
    this.uniforms.darkness = { type: '1f', value: 0 }
    this.uniforms.playerX = { type: '1f', value: 0 }
    this.uniforms.playerY = { type: '1f', value: 0 }

    // Setup the glsl fragment shader source
    this.fragmentSrc = [
      'precision mediump float;',
      'uniform float darkness;',
      'uniform float playerX;',
      'uniform float playerY;',
      'varying vec2 vTextureCoord;',
      'uniform sampler2D uSampler;',
      'void main(void){',
        'vec4 notDark = texture2D(uSampler, vec2(playerX, playerY));',
        'vec4 dark = texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y)) * darkness;',
        'gl_FragColor = dark * notDark;',
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

  set PlayerLocationX (_x) {
    this.uniforms.playerX.value = _x
  }
  set PlayerLocationY (_y) {
    this.uniforms.playerX.value = _y
  }
}

// Allow export
export default Shadows
