function Scheduler(bpm, interval, ctx, instrumentBuffers) {
  this.interval = interval;
  this.bpm = bpm;
  this.ctx = ctx;
  var dummyNode = ctx.createOscillator();
  this.instrumentBuffers = instrumentBuffers;
}

Scheduler.prototype.secondsPerBeat = function() {
  return 60 / this.bpm;
}

Scheduler.prototype.secondsPerInterval = function() {
  return this.secondsPerBeat() * this.interval;
}

function scheduleNotesForTime(notes, time, ctx, instruments) {
  notes.forEach(function(n) {
    var node = ctx.createBufferSource();
    node.buffer = instruments[n.instrument];
    node.connect(ctx.destination);
    node.start(time);
  });
}

// TODO: why is is all playing at the same time? ;_;
Scheduler.prototype.startPlaying = function(track, startTime) {
  console.log('currentTime', this.ctx.currentTime, 'startTime', startTime);
  this.currentTrack = track;
  var self = this;
  var timeForI;

  if (!startTime) {
    startTime = this.ctx.currentTime;
  }

  // start playing immediately, schedule all the notes in the measure
  track.forEach(function(note, i) {

    timeForI = i * self.secondsPerInterval();
    console.log('timefori is', startTime + timeForI);
    scheduleNotesForTime(track[i],
                         startTime + timeForI,
                         self.ctx,
                         self.instrumentBuffers);
  });

  console.log('now is', this.ctx.currentTime,
              'should call next at ', this.ctx.currentTime + timeForI + this.secondsPerInterval());

  setTimeout(function() {
    self.startPlaying(track, startTime + timeForI + self.secondsPerInterval());
  }, (timeForI + this.secondsPerInterval()) * 1000 - 100);
};


/**
 * What am I doing?
 *
 * Scheduler's job is to keep a running interval to schedule the next notes.
 * 1. start a setInterval
 * 2. every time the interval fires, look at what the web audio current time
 *    is. Schedule the next tick of notes. Have overlap? How to avoid
 *    double-scheduling then? Keep track of what notes have already
 *    been scheduled?
 *
 *    Scheduling the notes == creating bufferNodes from them, setting
 *    .start to the calculated time.
 *
 *    Where do the buffers come from? Buffers shouldn't live in the scheduler.
 *    Also where is the map from the notes to the types of buffers they are?
 * should be in the track array
 *
 **/

module.exports = Scheduler;
