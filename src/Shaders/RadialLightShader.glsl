precision mediump float;

// Phaser Filter built-in variables
varying vec2 vTextureCoord;
varying vec4 vColor;

// Socket Booleans ~ Reminder: Socket1 is the player socket and it cannot be removed or
uniform bool socket2;
uniform bool socket3;
uniform bool socket4;
uniform bool socket5;
// Light Locations
// - Must be in screen space in units of pixels
uniform vec2 lightPos;
uniform vec2 socket2Pos;
uniform vec2 socket3Pos;
uniform vec2 socket4Pos;
uniform vec2 socket5Pos;

// Variable Distance
uniform float timedDistance;

// Phaser Filter built-in uniforms
uniform vec2 resolution;
uniform float time;
uniform vec2 mouse;
uniform sampler2D uSampler;

float calculateLighting () {
  if (lightPos.x >= 0.0) {
    float dist = distance(gl_FragCoord.xy, lightPos);
    if(dist < (timedDistance)) { return 1.0; }
    else if (dist < (timedDistance * 2.0) ) { return (1.0 - (dist - timedDistance) / 50.0); }
  }
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
  if (lightPos.x >= 0.0) {
    float dist = distance(gl_FragCoord.xy, lightPos);
    if(dist < (timedDistance)) { scale = 1.0; }
    else if (dist < (timedDistance * 2.0) ) { scale = 1.0 - (dist - timedDistance) / 50.0; }
  }
  //Socket2
  if (socket2) {
    float dist1 = distance(gl_FragCoord.xy, socket2Pos);
    if (socket2Pos.x >= 0.0) {
      if (dist1 < (50.0)) {
        scale = 1.0;
      }
      else if (dist1 < (100.0)) {
        scale = 1.0 - (dist1 - 50.0) / 50.0;
      }
    }
  }

  // Scale color by distance to light sources
  if (timedDistance > 50.0){
    gl_FragColor = vec4(scale*(baseColor.rgb), 1.0);
  }
  else {
    gl_FragColor = vec4(scale*(baseColor.rgb * color1), 1.0);
  }

}

// void main() {
//   // Normal color
//   vec4 baseColor = texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y));
//   vec3 color1 = vec3(0, 0, 1);

//   // Compare pixel to each light source
//   float scale = 0.1;
//   if (lightPos.x >= 0.0) {
//     float dist = distance(gl_FragCoord.xy, lightPos);
//     if(dist < timedDistance) { scale = 1.0; }
//     else if (dist < (timedDistance * 2.0)) { scale = 1.0 - (dist - 50.0) / 50.0; }
//   }

//   // Scale color by distance to light sources
//   gl_FragColor = vec4(scale*(baseColor.rgb * color1), 1.0);
// }
