function Scheduler(bpm, interval, ctx, instrumentBuffers) {
  this.interval = interval;
  this.bpm = bpm;
  this.ctx = ctx;
  // This is to kick off the ctx.currentTime counter. It appears it doesn't
  // start counting until you create a node with it.
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


function playTrackAtTime(track, startTime, context, noteInterval, instrumentBuffers) {
  // start playing immediately, schedule all the notes in the measure
  var timeForI = null;
  track.forEach(function(note, i) {
    timeForI = i * noteInterval;
    scheduleNotesForTime(track[i], startTime + timeForI, context, instrumentBuffers);
  });

  return timeForI;
}

Scheduler.prototype.startPlaying = function(track, startTime) {
  // if we are already playing, just change which track will play next and
  // bail out
  if (this.isPlaying) {
    if (track) {
      this.currentTrack = track;
    }
    return;
  }

  this.isPlaying = true;
  this.currentTrack = track;

  if (!startTime) {
    startTime = this.ctx.currentTime;
  }

  // kick out the jams
  this._loopingPlay(startTime);
};

/**
 * @private
 *
 * schedule this.currentTrack to be played in a loop.
 */
Scheduler.prototype._loopingPlay = function(startTime) {
  var lastScheduledNoteTime = playTrackAtTime(this.currentTrack, startTime, this.ctx, this.secondsPerInterval(), this.instrumentBuffers);
  var nextBeatTime = startTime + lastScheduledNoteTime + this.secondsPerInterval();
  // schedule next track of notes 100 ms before current track of notes stops playing
  var scheduleTimeout = (nextBeatTime - this.ctx.currentTime) * 1000 - 100;

  // loop to play the next track
  setTimeout(this._loopingPlay.bind(this, nextBeatTime), scheduleTimeout);
}

module.exports = Scheduler;
