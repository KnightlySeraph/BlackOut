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
    this.uniforms.socket2Decay = { type: '1f', value: 75 }
    this.uniforms.socket3Decay = { type: '1f', value: 75 }
    this.uniforms.socket4Decay = { type: '1f', value: 75 }
    this.uniforms.socket5Decay = { type: '1f', value: 75 }
    
    // Socket on/off uniforms
    this.uniforms.socket2 = { type: '1i', value: 0 }
    this.uniforms.socket3 = { type: '1i', value: 0 }
    this.uniforms.socket4 = { type: '1i', value: 0 }
    this.uniforms.socket5 = { type: '1i', value: 0 }

    // Setup the glsl fragment shader source
    this.fragmentSrc = RadialLightShader

    // Vars used by the iterate function declared at bottom of class
    this.timer = 150
    this.blink = 0
    this.lightSize = 0
    this.camera = { x: 0, y: 0 }

    // Rates of decrease, used by the iterate function
    this.rateDecay2 = 0.1
    this.rateDecay3 = 0.1
    this.rateDecay4 = 0.1
    this.rateDecay5 = 0.1

  }

  // Create a timer
 

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

  get timedDistance () {
    return this.uniforms.timedDistance.value
  }

  // Gets for the positions of the lights
  GetSocket2Pos () {
    return {
      x: this.socket2Pos.value[0],
      y: this.socket2Pos.value[1]
    }
  }

  GetSocket3Pos () {
    return {
      x: this.socket3Pos.value[0],
      y: this.socket3Pos.value[1]
    }
  }

  GetSocket4Pos () {
    return {
      x: this.socket4Pos.value[0],
      y: this.socket4Pos.value[1]
    }
  }

  GetSocket5Pos () {
    return {
      x: this.socket5Pos.value[0],
      y: this.socket5Pos.value[1]
    }
  }

  // Get and Set functions for this.timer since it neads to read and write between level clases and this class
  SetTimer (value) {
    this.timer = value
  }
  GetTimer () {
    return this.timer
  }

  // Function used to add the camera to the class
  SetCam (camera) {
    this.camera = camera
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
      console.log('Just set this.socket2 to be one')
      this.moveSocket2 = (locX, locY)
      this.socket2Decay = intensity
      this.rateDecay2 = duration
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

  // This function is used to keep the lights situated in world space
  toWorld (camera, posX, posY) {
    return {
      x: posX - this.camera.x,
      y: posY + this.camera.y
    }
  }

  iterate () {
    // Dim the player lights
    if (this.timer > 0.0) {
      this.timer -= 0.1 // decrease the timer over time
    }

    // change var light size based off of timer
    if (this.timer <= 0.0) {
      this.lightSize = 0
    } else if (this.timer <= 50.0) {
      this.lightSize = 1
    } else if (this.timer <= 75.0) {
      this.lightSize = 2
    } else if (this.timer <= 100.0) {
      this.lightSize = 3
    } else if (this.timer <= 125.0) {
      this.lightSize = 4
    } else {
      this.lightSize = 5
    }
    
    // Update the light around the player
    if (this.lightSize === 5) {
      this.timedDistance = 150.0
    } else if (this.lightSize === 4) {
      this.timedDistance = 125.0
    } else if (this.lightSize === 3) {
      this.timedDistance = 100.0
    } else if (this.lightSize === 2) {
      this.timedDistance = 75.0
    } else if (this.lightSize === 1) {
      this.timedDistance = 50.0
    } else {
      this.timedDistance = 0.0
    }

    // The following will decrement the other lights within the system
    // Check if socket 2 is on
    if (this.socket2 === 1) {
      // Make sure this.socket2Decay does not fall below zero
      if (this.socket2Decay > 0.0) {
        // Decrease this.socket2Decay by the designated rateDecay
        this.socket2Decay -= this.rateDecay2
      }
      // Kill light
      if (this.socket2Decay < 30.0) {
        this.socket2Decay = 0.0
        this.socket2 = 0
      }
    }
    // Check if socket 3 is on
    if (this.socket3 === 1) {
      // Make sure this.socket3Decay does not fall below zero
      if (this.socket3Decay > 0.0) {
        // Decrease this.socket3Decay by the designated rateDecay
        this.socket3Decay -= this.rateDecay3
      }
      // Kill light
      if (this.socket3Decay < 30.0) {
        this.socket3Decay = 0.0
        this.socket3 = 0
      }
    }
    // Check if socket 4 is on
    if (this.socket4 === 1) {
      // Make sure this.socket4Decay does not fall below zero
      if (this.socket4Decay > 0.0) {
        // Decrease this.socket4Decay by the designated rateDecay
        this.socket4Decay -= this.rateDecay4
      }
      // Kill light
      if (this.socket4Decay < 30.0) {
        this.socket4Decay = 0.0
        this.socket4 = 0
      }
    }
    // Check if socket 5 is on
    if (this.socket5 === 1) {
      // Make sure this.socket5Decay does not fall below zero
      if (this.socket5Decay > 0.0) {
        // Decrease this.socket5Decay by the designated rateDecay
        this.socket5Decay -= this.rateDecay5
        // Kill light
        if (this.socket5Decay < 30.0) {
          this.socket5Decay = 0.0
          this.socket5 = 0
        }
      }
    }

    // Keep the active lights situated in world space
    // check if Socket 2 is on
    if (this.socket2 === 1) {
      // call the to world function defined above
      // this.socket2Pos = this.toWorld(this.camera, this.GetSocket2Pos.x, this.GetSocket2Pos.y)
    }
  }
}

export default RadialLightFilter
