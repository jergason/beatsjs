# beatsjs

beatsjs is an api for creating beats in JavaScript with the Web Audio API.


## Usage

Let us make some beats.

```javascript
var Beats = require('beats');
var track = new Beats({bpm: 120});

```

# TODO

0. make sure there is only one beats track playing at the same time
0. expose hooks to when beats will change
0. triplets, swung notes, etc
0. Fix sound loading in firefox


bd| bd bd -- -- bd bd -- -- bd bd -- -- bd bd -- --
sn| -- -- sn -- -- -- sn -- -- -- sn -- -- -- sn --
hh| hh hh hh hh hh hh hh hh hh hh hh hh hh hh hh hh


bd| bd -- -- -- bd bd -- -- bd -- -- -- bd bd -- --
sn| -- -- sn -- -- -- sn -- -- -- sn -- -- -- sn --
hh| -- hh hh -- -- hh hh -- -- hh hh -- -- hh hh --


more todo: add descending lazer beams with setCurve on the parameters
