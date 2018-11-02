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

  // Gets for all uniforms
  // Gets for socket toggles
  get socket2 () {
    return this.uniforms.socket2.value
  }

  get socket3 () {
    return this.uniforms.socket3.value
  }

  get socket4 () {
    return this.uniforms.socket4.value
  }

  get socket5 () {
    return this.uniforms.socket5.value
  }

  // Gets for the decays
  get socket2Decay () {
    return this.uniforms.socket2Decay.value
  }

  get socket3Decay () {
    return this.uniforms.socket3Decay.value
  }

  get socket4Decay () {
    return this.uniforms.socket4Decay.value
  }

  get socket5Decay () {
    return this.uniforms.socket5Decay.value
  }
  /**
   * 
   * @param {number} locX X position of the point light, float expected
   * @param {number} locY Y position of the point light, float expected
   * @param {number} intensity Size of light, float expected
   * @param {number} duration Duration of the light, float expected
   */
  createLight (locX, locY, intensity, duration) {
  // Potential Socket will be used to keep track of which socket that is being set
    this.potentialSocket = -1
    // Check sockets
    if (this.socket2 !== 1) {
      console.log('Socket 2 open, using socket 2')
      this.potentialSocket = 2
    } else if (this.socket3 !== 1) {
      console.log('Socket 3 open, using socket 3')
      this.potentialSocket = 3
    } else if (this.socket4 !== 1) {
      console.log('Socket 4 open, using socket 4')
      this.potentialSocket = 4
    } else if (this.socket5 !== 1) {
      console.log('Socket 5 Open, using socket 5')
      this.potentialSocket = 5
    } else {
      console.log('All sockets failed')
    }

    // Set the selected socket up
    if (this.potentialSocket === -1) {
      console.log('ERROR: Out of sockets, Failed to create point light, try freeing sockets')
    } else if (this.potentialSocket === 2) {
      this.socket2 = 1
      this.moveSocket2 = (locX, locY)
    } else if (this.potentialSocket === 3) {
      this.socket3 = 1
      this.moveSocket3 = (locX, locY)
    } else if (this.potentialSocket === 4) {
      this.socket4 = 1
      this.moveSocket4 = (locX, locY)
    } else if (this.potentialSocket === 5) {
      this.socket5 = 1
      this.moveSocket5 = (locX, locY)
    } else {
      console.log('ERROR: Potential Socket out of range, potential socket must be -1, 2, 3, 4, or 5 other values not excepted')
    }
  }
}

export default RadialLightFilter
