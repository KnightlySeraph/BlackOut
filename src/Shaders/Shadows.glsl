precision mediump float;

//Used for Gradient
uniform float screenWidth;
uniform float screenHeight;

//Used for frame of the game
varying vec2 vTextureCoord;
uniform sampler2D frame;

void main () {
  vec2 resolution = vec2(screenHeight, screenWidth);
  vec2 xy = gl_FragCoord.xy;
  xy.x = xy.x / resolution.x;
  xy.y = xy.y / resolution.y;
  //Calculate the 2dTexture of our game frame
  vec4 gameFrame = texture2D(frame, vec2(vTextureCoord.x, vTextureCoord.y));
  vec4 grdBlueBlack = vec4(0.0, 0.0, 0.0, 1.0);
  grdBlueBlack.b = xy.x;
  
  gl_FragColor = gameFrame + grdBlueBlack;
}
