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
      'varying vec4 diffuse;',
      'varying vec4 ambientGlobal;',
      'varying vec4 exPos;',
      'varying vec3 normal;',
      'varying vec3 halfVector;',
      'void main(){',
      'vec3 n;',
      'vec3 halfV;',
      'vec3 viewV;',
      'vec3 lightDir;',
      'float NdotL;',
      'float NdotHV',
      'vec4 color = ambientGlobal;',
      'float att;',
      'float dist;',
      'n = normalize(normal);',
      'lightDir = vec3(gl_LightSource[0].position-ecPos);',
      'dist = length(lightDir);',
      'NdotL = max(dot(n,normalize(lightDir)),0.0);',
      'if(NdotL > 0.0) {',
      'att = 1.0 / (glLightSource[0].constantAttenuation + gl_LightSource[0].linearAttenuation * dist + gl_LightSource[0].quadraticAttenuation * dist * dist);',
      'color += att * (diffuse * NdotL + ambient);',
      'halfV = normalize(halfVector);',
      'NdotHV = max(dot(n,halfV),0.0);',
      'color += att * gl_FrontMaterial.specular * gl_LightSource[0].specular * pow(NdotHV, gl_FrontMaterial.shininess);',
      '}',
      'gl_FragColor = color;',
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
