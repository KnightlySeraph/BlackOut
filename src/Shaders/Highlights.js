import Phaser from 'phaser'

/* Provided by florrent tepe on stack overflow
link: https://stackoverflow.com/questions/51042421/how-to-implement-a-shader-to-create-highlights-shadows */
class Highlights extends Phaser.Filter {
  constructor (game) {
    super(game)

    // Set Uniforms
    this.uniforms.highlights = { type: '1f', value: 0 }

    // Setup glsl frag shader
    this.fragmentSrc = [
      'precision mediump float',
      'uniform sampler2D texture;',
      'uniform float highlights;',
      
      'const float a = 1.357697966704323E-01;',
      'const float b = 1.006045552016985E+00;',
      'const float c = 4.674339906510876E-01;',
      'const float d = 8.029414702292208E-01;',
      'const float e = 1.127806558508491E-01;',
      
      'void main() {',
          'vec4 color = texture2D(iChannel0, coord.xy);',
          'float maxx = max(color.r, max(color.g, color.b));',
          'float minx = min(color.r, min(color.g, color.b));',
          'float lum = (maxx+minx)/2.0;',
          'float x1 = abs(highlights);',
          'float x2 = lum;',
          'float lum_new =  lum < 0.5 ? lum : lum+ a * sign(highlights) * exp(-0.5 * (((x1-b)/c)*((x1-b)/c) + ((x2-d)/e)*((x2-d)/e)));',
          '// gl_FragColor = color * lum_new / lum;',
          'gl_FragColor = vec4(color * lum_new / lum);',
      '}'
    ]
  }
}
// Allow Export
export default Highlights
