function Scheduler(bpm, interval, ctx, instrumentBuffers) {
  this.interval = interval;
  this.bpm = bpm;
  this.ctx = ctx;
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

// TODO: loop it, loop it good
Scheduler.prototype.startPlaying = function(track) {
  this.currentTrack = track;
  var self = this;

  // start playing immediately, schedule all the notes in the measure
  track.forEach(function(note, i) {

    console.log('note is', note, 'i is', i);
    var timeForI = i * self.secondsPerInterval();
    scheduleNotesForTime(track[i],
                         self.ctx.currentTime + timeForI,
                         self.ctx,
                         self.instrumentBuffers);
  });
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
