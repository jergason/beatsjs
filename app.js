var Beats = require('./beats');

var button = document.querySelector('.drop-the-beat');
var div = document.querySelector('.beats-input');

var beats = new Beats();
beats.onReady(function() {
  button.addEventListener('click', dropTheBeat);
});

function dropTheBeat(event) {
  console.log('i worked');

  var text = div.innerText;

  beats.notation(text);
  beats.startPlaying();
}

