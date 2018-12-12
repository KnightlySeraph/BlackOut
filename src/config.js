/**
 * config.js: Global configuration details meant to be used in files throughout
 * your game. Values included here should be ones that help you tweek your game
 * or avoid writing constants more than once.
 * 
 * THESE VALUES SHOULD BE TREATED AS CONSTANT/READ ONLY!!
 * If you need to change their values during run-time then they don't belong here.
 */

export default {
  gameWidth: 1920, // The width of the game viewport in the browser
  gameHeight: 938, // The height of the game viewport in the browser // taskbar not hidden value: 938
  localStorageName: 'stoutGDD325', // Prefix for cookie & session storage
  
  // List of webfonts you want to load
  webfonts: ['Libre Franklin'],

  // *** Everything below this is specific to the demo code.
  // *** You should probably REMOVE it or adjust the values.
  // *** In fact, some of these are quick hacks and not recommended!!

  // Sound and music settings
  MUSIC_VOLUME: 0.3,
  WALKING_VOLUME: 0.5,
  SFX_VOLUME: 1.0,

  // Minimum time to display the splash screen
  MIN_SPLASH_SECONDS: 2,

  // Time before playing the idle animation
  IDLE_COUNTDOWN: 200,

  // Values for tweeking the player character behaviors
  PLAYER_SCALE: 1,
  PLAYER_MASS: 5,
  JUMP_INITIAL: -400,
  JUMP_TIME: 0.4,
  GRAVITY_CONSTANT: 1000,

  // Constant IDs for platforms and elevators
  PLATFORM_1: 1,
  PLATFORM_2: 2,
  PLATFORM_3: 3,
  PLATFORM_4: 4,

  ELEVATOR_1: 5,

  WALL_1: 6,
  WALL_2: 7,
  WALL_3: 8,

  JUMPER_FLOOR1: 9,
  JUMMPER_1: 10,
  JUMMPER_2: 11,
  JUMMPER_3: 12,

  LEVER6_LVL1: 13,
  LEVER5_LVL1: 14,
  LEVER4_LVL1: 15,

  LEVER1_LVL2: 16,
  LEVER2_LVL2: 17,
  LEVER3_LVL2: 18,
  LEVER4_LVL2: 19,
  LEVER5_LVL2: 20,
  LEVER6_LVL2: 21,
  LEVER7_LVL2: 22,

  MOVER_LVL2: 23,
  JUMPER_FLOOR2: 24,
  LVL2_WALL: 25,

  LEVER1_LVL3: 26,
  LEVER2_LVL3: 27,
  LEVER3_LVL3: 28,
  LEVER4_LVL3: 29,
  LEVER5_LVL3: 30,
  LEVER6_LVL3: 31,

  WALL1_LVL3: 32,
  WALL2_LVL3: 33,
  WALL3_LVL3: 34,

  JUMPER1_LVL3: 35,
  JUMPER2_LVL3: 36,
  JUMPER3_LVL3: 37,
  JUMPER4_LVL3: 38,
  JUMPER5_LVL3: 39,

  MOVER1_LVL3: 40,
  MOVER2_LVL3: 41,

  PLATFORM_5: 42,

  LAST_WALL: 43
}
