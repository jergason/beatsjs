function parseInstrument(instrumentStr) {
  var chunks = instrumentStr.split('|');
  var instrument = chunks[0];
  var notes = chunks.slice(1).join(' ').trim().split(/\s+/);
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

module.exports = buildTrack;
