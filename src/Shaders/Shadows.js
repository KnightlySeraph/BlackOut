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
    this.uniforms.playerHeight = { type: '1f', value: 0 }
    this.uniforms.playerWidth = { type: '1f', value: 0 }

    // Setup the glsl fragment shader source
    this.fragmentSrc = [
      'precision mediump float;',
      'uniform float darkness;',
      'uniform float playerX;',
      'uniform float playerY;',
      'uniform float playerHeight;',
      'uniform float playerWidth;',
      'varying vec2 vTextureCoord;',
      'vec4 borders;',
      'uniform sampler2D uSampler;',
      'void main(void){',
        'borders = vec4(',
          'playerX - (0.5*playerWidth),',
          'playerX + (0.5*playerWidth),',
          'playerY + (0.5*playerHeight),',
          'playerY - (0.5*playerHeight));',
        'vec4 notDark = texture2D(uSampler, vec2(playerX, playerY));',
        'vec4 dark = texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y)) * darkness;',
        'vec4 normal = texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y));',
        '//gl_FragColor = vec4(1,1,1,1);',
        'if (vTextureCoord.x < borders.y || vTextureCoord.x > borders.x || vTextureCoord.y < borders.z || vTextureCoord.y > borders.w ) {',
            'gl_FragColor = vec4(0.03, 0.38, 0.96, 1);',
        '}',
        'gl_FragColor = vec4(0.27, 0.31, 0.38, 1) + dark;',
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
  set playerHeight (height) {
    this.uniforms.playerHeight = height
  }
  set playerWidth (width) {
    this.uniforms.playerWidth = width
  }
}

// Allow export
export default Shadows
