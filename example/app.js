var Beats = require('../');

var context = new AudioContext();
function loadBuffer(context, path , cb) {
  var request = new XMLHttpRequest();
  request.open('GET', path, true);
  request.responseType = 'arraybuffer';

  request.onload = function() {
    context.decodeAudioData(request.response, function(theBuffer) {
      cb(null, theBuffer);
    }, function(err) {
      cb(err);
    });
  }
  request.send();
}

loadBuffer(context, '/example/sounds/bd.wav', function(err, baseDrum) {
  loadBuffer(context, '/example/sounds/sn.wav', function(err, snare) {
    var beats = new Beats(context, {bd: baseDrum, sn: snare});
    console.log('got the beats woo woo', beats);
    var button = document.querySelector('.drop-the-beat');
    var div = document.querySelector('.beats-input');
    function dropTheBeat(event) {
      var text = div.textContent;
      console.log('text is', text);
      var track = beats.notation(text);
      beats.startPlaying(track);
    }

    button.addEventListener('click', dropTheBeat);
  });
});
