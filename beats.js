var Scheduler = require('./scheduler');

function Beats() {
  var self = this;
  var bpm = 120;
  // how many beats a single unit represents
  // start out with eighth-notes
  var interval = 1;
  var AudioContext = window.AudioContext || window.webkitAudioContext;
  this.ctx = new AudioContext();


  this.readyFuncs = [];
  loadInstrumentBuffers(this.ctx, function(err, buffers) {
    if (err) {
      return console.error('err', err);
    }
    self.scheduler = new Scheduler(bpm, interval, self.ctx, buffers);
    self._setReady();
  });
}

Beats.prototype._setReady = function() {
  this.isReady = true;
  this.readyFuncs.forEach(function(ready) { ready() });
  this.readyFuncs = [];
}

Beats.prototype.onReady = function(cb) {
  if (this.isReady) {
    return process.nextTick(cb);
  }

  this.readyFuncs.push(cb);
}

function loadInstrumentBuffers(ctx, cb) {
  function makeLoadBuffer(name) {
    return function(cb) {
      console.log('starting loadBufferfor', name);
      var req = new XMLHttpRequest();
      req.responseType = 'arraybuffer';
      req.onload = function() {
        ctx.decodeAudioData(req.response, function(buffer) {
          cb(null, buffer);
        });
      };
      req.onerror = function(err) {
        console.log('an error happened', err);
        cb(err);
      };
      req.open('GET', '/sounds/' + name + '.wav');
      req.send();
    }
  }

  var obj = {
    bd: makeLoadBuffer('bd'),
    hh: makeLoadBuffer('hh'),
    sn: makeLoadBuffer('sn')
  }

  console.log('obj is', obj);

  asyncObject(obj, cb);
}

function asyncObject(obj, cb) {
  var keys = Object.keys(obj);
  var len = keys.length;
  var errCalled = false;
  var i = 0;
  var results = {};

  function makeDone(name) {
    return function done(err, res) {
      i++;
      console.log('i is', i, 'res is', res);
      if (err) {
        if (!errCalled) {
          errCalled = true;
          cb(err);
        }
        return;
      }

      results[name] = res;
      // we have called all the callbacks, woo!
      if (i == len-1) {
        cb(null, results);
      }
    }
  }

  keys.forEach(function(key) {
    obj[key](makeDone(key));
  });
}

/**
 * @private
 *
 * Parse out the instrument and a series of schedules
 **/
function parseInstrument(instrumentStr) {
  var chunks = instrumentStr.split('|');
  var instrument = chunks[0];
  var notes = chunks[1].trim().split(' ');
  console.log('notes is', notes);
  return notes.map(function(note) {
    // return undefined if it is a rest
    if (note == '--') {
      return;
    }
    return {note: note, instrument: instrument};
  });
}

function removeEmpty(line) {
  return !!line;
}

function buildTrack(notation) {
  var instrumentStrings = notation.split('\n').filter(removeEmpty)
  console.log('instrument strings is ', instrumentStrings);
  var instruments = instrumentStrings.map(parseInstrument);

  return instruments[0].map(function(note, i) {
    var notesOnBeat = []
    instruments.forEach(function(instrument) {
      if (instrument[i]) {
        notesOnBeat.push(instrument[i]);
      }
    });
    return notesOnBeat;
  });

}

/**
 * Parse the ascii drum beat into a schedule of notes to play
 **/
Beats.prototype.notation = function(notation) {
  var track = buildTrack(notation);
  this.track = track;
  return track;
}

Beats.prototype.startPlaying = function(track) {
  var self = this;

  if (!track) {
    track = this.track;
  }
  this.onReady(function() {
    self.scheduler.startPlaying(track);
  });
}


/*
 * What should the final data structure for a parsed beat look like?
 * Just a list of eighth notes, either empty for with an instrument to play?
 * When does it get turned in to stuff to actually schedule then?
 *
 * Scheduler takes the list of eighth notes, keeps track of a cursor into this
 * list, loops through each one and schedules the next eighth note to play?
 *
 *
 * So the list is an array of arrays. Each thing in the array is an eighth note
 * of sounds to play, which can either be empty or contain stuff to put in
 * there.
 */


module.exports = Beats;
