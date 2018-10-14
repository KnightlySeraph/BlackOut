precision mediump float;
uniform float darkness;
uniform float playerX;
uniform float playerY;
uniform float playerHeight;
uniform float playerWidth;
varying vec2 vTextureCoord;
vec4 borders;
uniform sampler2D uSampler;
void main(void){
  float ambientStrength = 0.1;
  //Create the Color for the ambience
  vec3 amColor = vec3(0.03, 0.38, 0.96);
  //Create the Color Vector for the ambient Lighting with the provided intensity
  vec3 ambient = ambientStrength * amColor;
  //The Color of the object -- the world
  vec3 objColor = vec3(0.5,0.5,0.5);
  borders = vec4(
    playerX - (0.5*playerWidth),
    playerX + (0.5*playerWidth),
    playerY + (0.5*playerHeight),
    playerY - (0.5*playerHeight));
  vec4 notDark = texture2D(uSampler, vec2(playerX, playerY));
  vec4 dark = texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y)) * darkness;
  vec4 normal = texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y));
  //gl_FragColor = vec4(1,1,1,1);
  //Below if Statement creates an area that accepts gl_FragColor for specific bounds
  /*
  if (vTextureCoord.x < borders.y || vTextureCoord.x > borders.x || vTextureCoord.y < borders.z || vTextureCoord.y > borders.w ) {
      //Create the RGB color Blue
      gl_FragColor = vec4(0.03, 0.38, 0.96, 1);
      //gl_FragColor = normal;
  }*/
  
  gl_FragColor = (vec4(0.27, 0.31, 0.38, 1) + dark);
  //vec3 result = ambient * objColor;
  //gl_FragColor = vec4(result, 0.5);
  
}
