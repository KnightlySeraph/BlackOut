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

float calculateLighting () {
  if (lightPos.x >= 0.0) {
    float dist = distance(gl_FragCoord.xy, lightPos);
    if(dist < (timedDistance)) { return 1.0; }
    else if (dist < (timedDistance * 2.0) ) { return (1.0 - (dist - timedDistance) / 50.0); }
  }
}

int overlapsLight (vec2 lightLoc) {
  //Collect the distances from each light
  float pointToPlayer = distance(lightLoc, lightPos );
  float lightDistance0 = distance(lightLoc, socket2Pos);
  float lightDistance1 = distance(lightLoc, socket3Pos);
  float lightDistance2 = distance(lightLoc, socket4Pos);
  float lightDistance3 = distance(lightLoc, socket5Pos);
  //Check the distances of every single possible light for the given range ~ 150.0
  if ((pointToPlayer > 0.0 && pointToPlayer <= 300.0) || (lightDistance0 > 0.0 && lightDistance0 <= 150.0) || (lightDistance1 > 0.0 && lightDistance1 <= 150.0) || (lightDistance2 > 0.0 && lightDistance2 <= 150.0) || (lightDistance3 > 0.0 && lightDistance3 <= 150.0)){
    return 1;
  }
  else {
    return 0;
  }
}

void main() {
  // Normal color
  vec4 baseColor = texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y));
  vec3 color1 = vec3(0.89, 0.94, 0.93);

  // Compare pixel to each light source
  // This Scale is, essentially, how dark the world is
  float scale = 0.0;
  

  //Point Light Calculations
  //Socket1 ~ Player Socket
  if (lightPos.x >= 0.0) {
    float dist = distance(gl_FragCoord.xy, lightPos);
    if(dist < (timedDistance)) { scale = 1.0; }
    else if (dist < (timedDistance * 2.0) ) { scale = 1.0 - (dist - timedDistance) / 50.0; }
  }
  //Socket2
  if (socket2 == 1) {
    float dist2 = distance(gl_FragCoord.xy, socket2Pos);
    if(overlapsLight(socket2Pos) != 1){
      if (socket2Pos.x >= 0.0) {
        if (dist2 < (socket2Decay)) {
          scale = 1.0;
        }
        else if (dist2 < (socket2Decay * 2.0)) {
          scale = 1.0 - (dist2 - 50.0) / 50.0;
        }
      }
    }
    else{
      if (socket2Pos.x >= 0.0) {
        if (dist2 < (socket2Decay)) {
          scale = 1.0;
        }
      }
    }   
  }
  //Socket3
  if (socket3 == 1) {
    float dist3 = distance(gl_FragCoord.xy, socket3Pos);
    if (overlapsLight(socket3Pos) != 1){
      if (socket3Pos.x >= 0.0) {
        if (dist3 < (socket3Decay)) {
          scale = 1.0;
        }
        else if (dist3 < (socket3Decay * 2.0)) {
          scale = 1.0 - (dist3 - 50.0) / 50.0;
        }
      }
    }
    else{
      if (dist3 < (socket3Decay)) {
          scale = 1.0;
      }
    }   
  }
  //Socket4
  if (socket4 == 1) {
    float dist4 = distance(gl_FragCoord.xy, socket4Pos);
    if(overlapsLight(socket4Pos) != 1){
      if (socket4Pos.x >= 0.0) {
        if (dist4 < (socket4Decay)) {
          scale = 1.0;
        }
        else if (dist4 < (socket4Decay * 2.0)) {
          scale = 1.0 - (dist4 - 50.0) / 50.0;
        }
      }
    }
    else{
      if (socket4Pos.x >= 0.0) {
        if (dist4 < (socket4Decay)) {
          scale = 1.0;
        }
      }
    }
  }
  //Socket5
  if (socket5 == 1) {
    float dist5 = distance(gl_FragCoord.xy, socket5Pos);
    if (overlapsLight(socket5Pos) != 1){
      if (socket5Pos.x >= 0.0) {
        if (dist5 < (socket5Decay)) {
          scale = 1.0;
        }
        else if (dist5 < (socket5Decay * 2.0)) {
          scale = 1.0 - (dist5 - 50.0) / 50.0;
        }
      }
    }
    else {
      if (socket5Pos.x >= 0.0) {
        if (dist5 < (socket5Decay)) {
          scale = 1.0;
        }
      }
    }
    
  }

  scale = clamp(scale, 0.0, 1.0);

  // Scale color by distance to light sources
  if (timedDistance > 50.0){
    gl_FragColor = vec4(scale*(baseColor.rgb), 1.0);
  }
  else if (!(socket2 == 1 || socket3 == 1 || socket4 == 1 || socket5 == 1)) {
    gl_FragColor = vec4(scale*(baseColor.rgb), 1.0);
  }
  else {
    gl_FragColor = vec4(scale*(baseColor.rgb), 1.0);
  }

}
