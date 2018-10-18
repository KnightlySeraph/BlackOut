precision mediump float;

// Phaser Filter built-in variables
varying vec2 vTextureCoord;
varying vec4 vColor;

// Light Locations
// - Must be in screen space in units of pixels
uniform vec2 lightPos;

// Phaser Filter built-in uniforms
uniform vec2 resolution;
uniform float time;
uniform vec2 mouse;
uniform sampler2D uSampler;

void main() {
  // Normal color
  vec4 baseColor = texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y));

  // Compare pixel to each light source
  float scale = 0.1;
  if (lightPos.x >= 0.0) {
    float dist = distance(gl_FragCoord.xy, lightPos);
    if(dist < 50.0) { scale = 1.0; }
    else if (dist < 100.0) { scale = 1.0 - (dist - 50.0) / 50.0; }
  }

  // Scale color by distance to light sources
  gl_FragColor = vec4(scale*baseColor.rgb, 1.0);
}
