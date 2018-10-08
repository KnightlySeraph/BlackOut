/**
 * utils.js: Simple, one-off functions that help reduce code in places
 * throughout your game. Put short, reusable code snippits in here.
 */
import Phaser from 'phaser'
/**
 * Set the anchor of all passed in objects to be (0.5, 0.5) so they
 * are drawn around their own logical center.
 * @param {array} objects An array of PIXI objects to be centered.
 */
export const centerGameObjects = (objects) => {
  objects.forEach(function (object) {
    object.anchor.setTo(0.5)
  })
}

/**
 * Generate an array of sequential integers spanning the range [first last]
 * (where first and last are included).  This is VERY handy for defining
 * animations that occur sequentially in your spritesheets.
 * @param {number} first The first number in the returned sequence.
 * @param {number} last The last number in the returned sequence.
 * @return {array} An array of integers spanning the range [first last]
 */
export const sequentialNumArray = (first, last) => {
  let newArray = []
  for (var i = first; i <= last; i++) {
    newArray.push(i)
  }
  return newArray
}

/**
 * 
 * @param {*} locationX The X Location of where to place the light gradient
 * @param {*} locationY The Y Location of where to place the light gradiet
 * @param {*} light1 The color of the inner light
 * @param {*} light2 The color of the outer light
 * @param {*} intensity The intensity of the light
 * @param {*} duration How long the light lasts
 */
export function createLight (locationX, locationY, light1, light2, intensity, duration) {
  this.lightBmd = new Phaser.BitmapData(locationX, locationY, 0.5, 0.5)
}
