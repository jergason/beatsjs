var buildTrack = require('./lib/buildTrack');

function nop() {}

/**
 * @param ctx AudioContext - used for playing notes
 * @param instrumentBuffers Object - mappings from strings to AudioBuffers that
*    will get played as notes.
 * @param opts Object - options object.
 *   bpm: beats per minute. default: 120
 *   interval: what note each note in the track represents. default: 1/8
 *     (so an eight-note)
 *   beatEmitter: callback called every time a track is scheduled with the
 *     times in seconds that each note will be played
 */
function Beats(ctx, instrumentBuffers, opts) {
  this.ctx = ctx;
  this.instrumentBuffers = instrumentBuffers;

  opts = opts || {};
  this.interval = opts.interval || 1/8;
  this.bpm = opts.bpm || 120;
  this.beatEmitter = opts.beatEmitter || nop;


  // This is to kick off the ctx.currentTime counter. It appears it doesn't
  // start counting until you create a node with it.
  var dummyNode = ctx.createOscillator();
}

Beats.prototype.secondsPerBeat = function() {
  return 60 / this.bpm;
}

Beats.prototype.secondsPerNote = function() {
  // 1/8 note is actually 1/2 of a beat, so multiply by 4 to go from musical
  // notiation to fractions of a beat
  return this.secondsPerBeat() * this.interval * 4;
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
  var beatTimes = track.map(function(note, i) {
    timeForI = i * noteInterval;
    scheduleNotesForTime(track[i], startTime + timeForI, context, instrumentBuffers);
    return startTime + timeForI;
  });

  return {lastNoteTime: timeForI, beatTimes: beatTimes};
}

Beats.prototype.startPlaying = function(track, startTime) {
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

Beats.prototype.stop = function() {
  this.isPlaying = false;
}

Beats.prototype._shouldStop = function() {
  return !this.isPlaying
}

/**
 * @private
 *
 * schedule this.currentTrack to be played in a loop.
 */
Beats.prototype._loopingPlay = function(startTime) {
  if (this._shouldStop()) {
    return;
  }
  var res = playTrackAtTime(this.currentTrack, startTime, this.ctx, this.secondsPerNote(), this.instrumentBuffers);

  // notify people who care about beat times
  this.beatEmitter(res.beatTimes);

  var nextBeatTime = startTime + res.lastNoteTime + this.secondsPerNote();
  // schedule next track of notes 100 ms before current track of notes stops playing
  var scheduleTimeout = (nextBeatTime - startTime) * 1000 - 100;

  // loop to play the next track
  setTimeout(this._loopingPlay.bind(this, nextBeatTime), scheduleTimeout);
}

/**
 * Parse the ascii drum beat into a schedule of notes to play.
 **/
Beats.prototype.notation = function(notation) {
  var track = buildTrack(notation);
  this.currentTrack = track;
  return track;
}

module.exports = Beats;
