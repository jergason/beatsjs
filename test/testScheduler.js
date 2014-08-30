var assert = require('assert');
var sinon = require('sinon');

var Scheduler = require('../');

function mockSchedulerDeps() {
  var startTimes = [];
  var instrumentBuffers = {};
  var fakeContext = {
    currentTime: 0,
    createOscillator: function() { return {} },
    createBufferSource: function() {
      return {
        connect: function(){},
        start: function(time){ startTimes.push(time);}
      };
    }
  };

  return {
    startTimes: startTimes,
    instrumentBuffers: instrumentBuffers,
    context: fakeContext
  };
}

describe('Scheduler', function() {
  describe('beatEmitter', function(done) {
    it('gets called whenever the next beat is scheduled with the times notes can be scheduled for', function(done) {
      var mock = mockSchedulerDeps();
      var emittedBeatTimes = [];
      function beatEmitter(beats) {
        emittedBeatTimes = emittedBeatTimes.concat(beats);
      }
      var clock = sinon.useFakeTimers();

      schedule = new Scheduler(mock.context, mock.instrumentBuffers, {beatEmitter: beatEmitter});
      var track = [[{}], [{}], [{}], [{}]];
      schedule.startPlaying(track);

      setTimeout(function() {
        assert.equal(emittedBeatTimes.length, 12);
        assert.equal(emittedBeatTimes[0], 0);
        assert.equal(emittedBeatTimes[1], 0.25);
        assert.equal(emittedBeatTimes[4], 1);
        assert.equal(emittedBeatTimes[5], 1.25);
        done();
      }, 2000);
      clock.tick(2000);
      clock.restore();
    });
  });

  describe('.startPlaying', function() {
    it('starts playing a track when nothing is playing already', function() {
      var mock = mockSchedulerDeps();
      var scheduler = new Scheduler(mock.context, mock.instrumentBuffers);
      var track = [[{}], [], [], [{}]];

      scheduler.startPlaying(track);
      assert.equal(mock.startTimes.length, 2, 'Two notes should be scheduled.');
      assert.equal(mock.startTimes[0], 0, 'First note should start at zero');
      assert.equal(mock.startTimes[1], 0.75, 'Second note should start 0.75 seconds after');
    });

    it('schedules the new track to be played after the current one is done playing if a track is already playing', function(done) {
      var clock = sinon.useFakeTimers();
      var mock = mockSchedulerDeps();
      var scheduler = new Scheduler(mock.context, mock.instrumentBuffers);
      var track = [[{}], [], [], [{}]];
      scheduler.startPlaying(track);

      var secondTrack = [[], [], [{}], [{}]];
      scheduler.startPlaying(secondTrack);
      // wait until the next track should be scheduled to make sure
      // it schedules the new track
      setTimeout(function() {
        assert.equal(mock.startTimes.length, 4);
        assert.equal(mock.startTimes[2], 1.5);
        assert.equal(mock.startTimes[3], 1.75);

        done();
      }, 905);
      clock.tick(1000);
      clock.restore();
    });
  });

  describe('.stop', function() {
    it('plays a single track once when called immediately after startPlaying', function(done) {
      var clock = sinon.useFakeTimers();
      var mock = mockSchedulerDeps();
      var scheduler = new Scheduler(mock.context, mock.instrumentBuffers);
      var track = [[{}], [], [], [{}]];
      scheduler.startPlaying(track);
      scheduler.stop()
      // wait until the next track should be scheduled to make sure
      // it schedules the new track
      setTimeout(function() {
        assert.equal(mock.startTimes.length, 2);
        done();
      }, 12000);
      clock.tick(13000);
      clock.restore();
    });
  });
});
