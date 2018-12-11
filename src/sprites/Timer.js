// Contains functionality for timer based events

class Timer {
  constructor () {
    // Initialize three usable alarms
    this.alarm0 = false
    this.alarm1 = false
    this.alarm2 = false

    // Initialize timers
    this.timer0 = 0.0
    this.timer1 = 0.0
    this.timer2 = 0.0

    // Rate of decay
    this.rate = 0.017
  }

  /**
   * 
   * @param {int} alarm Select alarm to turn on
   * @param {float} time Set the time on the alarm
   */
  startAlarm(alarm, time) {
    if (alarm === 0) {
      this.alarm0 = true
      this.timer0 = time
    } else if (alarm === 1) {
      this.alarm1 = true
      this.timer1 = time
    } else if (alarm === 2) {
      this.alarm2 = true
      this.timer2 = time
    }
  }

  // If an object uses this class it must place this function inside update
  TimerDriver () {
    // Alarm 0 driver
    if (this.alarm0) {
      if (this.timer0 > 0.0) {
        this.timer0 -= this.rate
      } else {
        this.alarm0 = false
        this.timer0 = 0.0
      }
    }

    // Alarm1 driver
    if (this.alarm1) {
      if (this.timer1 > 0.0) {
        this.timer1 -= this.rate
      } else {
        this.alarm1 = false
        this.timer1 = 0.0
      }
    }

    // Arlarm 2 driver
    if (this.alarm2) {
      if (this.timer2 > 0.0) {
        this.timer2 -= this.rate
      } else {
        this.alarm2 = false
        this.timer2 = 0.0
      }
    }
  }
}

export default Timer
