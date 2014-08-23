var assert = require('assert');
var buildTrack = require('../lib/buildTrack');

describe('buildTrack', function() {
  it('parses tracks with measures separated by | correctly', function() {
    var track = 'bd| bd -- -- -- -- -- -- -- | bd -- bd -- -- -- -- -- | bd -- -- -- -- -- -- -- | bd -- bd -- -- -- -- -- |';
    var builtTrack = buildTrack(track);
    assert.equal(builtTrack.length, 32);
  });

  it('parses tracks without separating | correctly', function() {
    var track = 'bd| bd -- -- -- -- -- -- -- bd -- bd -- -- -- -- -- bd -- -- -- -- -- -- -- bd -- bd -- -- -- -- --';
    var builtTrack = buildTrack(track);
    assert.equal(builtTrack.length, 32);
  });
});
