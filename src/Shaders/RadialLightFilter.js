// The Phaser Filter to use on the player
import RadialLightShader from './RadialLightShader.glsl'

// Import Phaser
import Phaser from 'phaser'

class RadialLightFilter extends Phaser.Filter {
  constructor (game) {
    super(game)

    // Set Filter Uniforms
    // Set Pos Uniforms
    this.uniforms.lightPos = { type: '2fv', value: [ -1, -1 ] }
    this.uniforms.socket2Pos = { type: '2fv', value: [ -1, -1 ] }
    this.uniforms.socket3Pos = { type: '2fv', value: [ -1, -1 ] }
    this.uniforms.socket4Pos = { type: '2fv', value: [ -1, -1 ] }
    this.uniforms.socket5Pos = { type: '2fv', value: [ -1, -1 ] }

    // Light Decay Uniforms
    this.uniforms.timedDistance = { type: '1f', value: 0 }
    this.uniforms.socket2Decay = { type: '1f', value: 0 }
    this.uniforms.socket3Decay = { type: '1f', value: 0 }
    this.uniforms.socket4Decay = { type: '1f', value: 0 }
    this.uniforms.socket5Decay = { type: '1f', value: 0 }
    
    // Socket on/off uniforms
    this.uniforms.socket2 = { type: '1i', value: 0 }
    this.uniforms.socket3 = { type: '1i', value: 0 }
    this.uniforms.socket4 = { type: '1i', value: 0 }
    this.uniforms.socket5 = { type: '1i', value: 0 }

    // Setup the glsl fragment shader source
    this.fragmentSrc = RadialLightShader
  }

  // Uniforms Sets
  moveLight (pos) {
    this.uniforms.lightPos.value[0] = pos.x
    this.uniforms.lightPos.value[1] = pos.y
  }

  set timedDistance (value) {
    this.uniforms.timedDistance.value = value
  }

  // Sets for each sockets position
  moveSocket2 (pos) {
    this.uniforms.socket2Pos.value[0] = pos.x
    this.uniforms.socket2Pos.value[1] = pos.y
  }

  moveSocket3 (pos) {
    this.uniforms.socket3Pos.value[0] = pos.x
    this.uniforms.socket3Pos.value[1] = pos.y
  }

  moveSocket4 (pos) {
    this.uniforms.socket4Pos.value[0] = pos.x
    this.uniforms.socket4Pos.value[1] = pos.y
  }

  moveSocket5 (pos) {
    this.uniforms.socket5Pos.value[0] = pos.x
    this.uniforms.socket5Pos.value[1] = pos.y
  }

  // Sets for each sockets decay float
  set socket2Decay (value) {
    this.uniforms.socket2Decay.value = value
  }

  set socket3Decay (value) {
    this.uniforms.socket3Decay.value = value
  }

  set socket4Decay (value) {
    this.uniforms.socket4Decay.value = value
  }

  set socket5Decay (value) {
    this.uniforms.socket5Decay.value = value
  }

  // Sets for each active socket
  set socket2 (value) {
    this.uniforms.socket2.value = value
  }

  set socket3 (value) {
    this.uniforms.socket3.value = value
  }

  set socket4 (value) {
    this.uniforms.socket4.value = value
  }

  set socket5 (value) {
    this.uniforms.socket5.value = value
  }
}

export default RadialLightFilter
