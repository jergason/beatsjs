var assert = require('assert');
var sinon = require('sinon');

var Scheduler = require('../lib/scheduler');

describe('Scheduler', function() {
  describe('.startPlaying', function() {
    it('starts playing a track when nothing is playing already', function() {
      var startTimes = [];
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
      var instrumentBuffers = {};
      var scheduler = new Scheduler(120, 0.5, fakeContext, instrumentBuffers);
      var track = [[{}], [], [], [{}]];

      scheduler.startPlaying(track);
      assert.equal(startTimes.length, 2, 'Two notes should be scheduled.');
      assert.equal(startTimes[0], 0, 'First note should start at zero');
      assert.equal(startTimes[1], 0.75, 'Second note should start 0.75 seconds after');
    });

    it('schedules the new track to be played after the current one is done playing if a track is already playing', function(done) {
      var clock = sinon.useFakeTimers();
      var startTimes = [];
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
      var instrumentBuffers = {};
      var scheduler = new Scheduler(120, 0.5, fakeContext, instrumentBuffers);
      var track = [[{}], [], [], [{}]];
      scheduler.startPlaying(track);

      var secondTrack = [[], [], [{}], [{}]];
      scheduler.startPlaying(secondTrack);
      // wait until the next track should be scheduled to make sure
      // it schedules the new track
      setTimeout(function() {
        assert.equal(startTimes.length, 4);
        assert.equal(startTimes[2], 1.5);
        assert.equal(startTimes[3], 1.75);

        done();
      }, 905);
      clock.tick(1000);
      clock.restore();
    });
  });
});
