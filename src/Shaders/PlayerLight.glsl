//Purpose: Create a point light at the location of the player
//References to the location of the player
precision mediump float;

uniform float locationX;
uniform float locationy;
uniform sampler2D uSampler;
varying vec2 vTextureCoord;

void main (){
  vec4 pointLightColor = vec4(0.03, 0.38, 0.96, 1);
  vec4 transparency = texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y));
  gl_FragColor = pointLightColor * transparency;
}
