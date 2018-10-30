precision mediump float;

// Phaser Filter built-in variables
varying vec2 vTextureCoord;
varying vec4 vColor;

// Socket Booleans ~ Reminder: Socket1 is the player socket and it cannot be removed or
uniform int socket2;
uniform int socket3;
uniform int socket4;
uniform int socket5;

// Light Locations
// - Must be in screen space in units of pixels
uniform vec2 lightPos;
uniform vec2 socket2Pos;
uniform vec2 socket3Pos;
uniform vec2 socket4Pos;
uniform vec2 socket5Pos;

// Variable Distance
uniform float timedDistance;

//Socket Timers
uniform float socket2Decay;
uniform float socket3Decay;
uniform float socket4Decay;
uniform float socket5Decay;

// Phaser Filter built-in uniforms
uniform vec2 resolution;
uniform float time;
uniform vec2 mouse;
uniform sampler2D uSampler;

float lightSourceCheck(int socketEnabled, vec2 socketPosition) {
  float scale = 0.0;
  if (socketEnabled == 1) {
    float dist = distance(gl_FragCoord.xy, socketPosition);
    if (socketPosition.x >= 0.0) {
      if (dist < (50.0)) { scale = 1.0; }
      else if (dist < (100.0)) { scale = 1.0 - (dist - 50.0) / 50.0; }
    }
  }

  return scale;
}

void main() {
  // Normal color
  vec4 baseColor = texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y));
  vec3 color1 = vec3(1, 0, 0);

  // Compare pixel to each light source
  // This Scale is, essentially, how dark the world is
  float scale = 0.1;

  //Point Light Calculations
  //Socket1 ~ Player Socket
  scale = scale + lightSourceCheck(1, lightPos);
  scale = scale + lightSourceCheck(socket2, socket2Pos);
  scale = clamp(scale, 0.0, 1.0);

  // Scale color by distance to light sources
  gl_FragColor = vec4(scale*(baseColor.rgb), 1.0);

  // if (timedDistance > 50.0){
  //   gl_FragColor = vec4(scale*(baseColor.rgb), 1.0);
  // }  
  // else if (!(socket2 == 1 || socket3 == 1 || socket4 == 1 || socket5 == 1)) {
  //   gl_FragColor = vec4(scale*(baseColor.rgb * color1), 1.0);
  // }
  // else {
  //   gl_FragColor = vec4(scale*(baseColor.rgb), 1.0);
  // }
}
