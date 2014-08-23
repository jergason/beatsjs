var Beats = require('./beats');

var button = document.querySelector('.drop-the-beat');
var div = document.querySelector('.beats-input');

var beats = new Beats();
beats.onReady(function() {
  button.addEventListener('click', dropTheBeat);
});

var wob = document.querySelector('.wob');
wob.addEventListener('click', function() {
  beats.onReady(function() {
    kickOutTheJams(beats.ctx);
  });
});

function dropTheBeat(event) {
  console.log('i worked');

  var text = div.innerText;

  beats.notation(text);
  beats.startPlaying();
}

function getSynth(pitch, ctx) {
  var nodes = {};
  nodes.source = ctx.createOscillator();
  nodes.source.type = 3;
  nodes.filter = ctx.createBiquadFilter();
  nodes.volume = ctx.createGain();
  nodes.filter.type = 2; //0 is a low pass filter
  nodes.volume.gain.value = 5;
  var i = 0;
  setInterval(function() {
    i += ((Math.PI * 2) / 30);
    nodes.filter.frequency = (((Math.sin(i) / 2) + 1) * 400);
  }, 32);
  nodes.source.connect(nodes.filter);
  nodes.filter.connect(nodes.volume);

  nodes.volume.connect(ctx.destination);

  //pitch val
  nodes.source.frequency.value = pitch;
  //frequency val
  nodes.filter.frequency.value = 100;
  nodes.source.start(0);
  return nodes
}

window.s1 = getSynth(42.70, beats.ctx);
window.s2 = getSynth(43, beats.ctx);

// TODO: how to sync to a bpm
function kickOutTheJams(context) {
  var gain = context.createGain();
  var finalGain = context.createGain();
  var wob = context.createOscillator();
  var src = context.createOscillator();


  // TODO: can you not schedule multiple parameters at the same time?
  src.frequency.value = 60;
  src.type = 'sawtooth';
  src.connect(gain);


  // activate the wob
  var filter = oscillateFilter(context, gain);

  filter.connect(finalGain);
  src.start(0);

  finalGain.gain.value = 0.5;
  finalGain.connect(context.destination);

  wob.frequency.value = 3;
  wob.connect(gain.gain);
  wob.start(0);
}

//setTimeout(function() {
  //kickOutTheJams(beats.ctx);
//}, 3 *  1000);

function oscillateFilter(ctx, src) {
  var filterSweep = ctx.createOscillator();
  filterSweep.frequency.value = 3;
  filterSweep.start(0);

  var filterGain = ctx.createGain();

  // control the range of frequencies we sweep through
  filterGain.gain.value = 1000;
  filterSweep.connect(filterGain);

  var filter = ctx.createBiquadFilter();
  filterGain.connect(filter.frequency);
  src.connect(filter);

  return filter;
}
