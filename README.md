# beatsjs

beatsjs is an api for creating beats in JavaScript with the Web Audio API.

This is super early days so the api is basically non-existent but w/e.


## Example

Right now there is a hacky exmple in index.html. Run
`browserify app.js -o js/build.js`, start a web server in the app dir (to load
the sound files), and open index.html.

Try pasting in one of these patterns:


    bd| bd -- -- -- -- -- -- -- | bd -- bd -- -- -- -- -- | bd -- -- -- -- -- -- -- | bd -- bd -- -- -- -- -- |
    sn| -- -- -- -- sn -- -- -- | -- -- -- -- sn -- -- -- | -- -- -- -- sn -- -- -- | -- -- -- -- sn -- -- -- |
    hh| -- -- hh hh -- -- -- -- | -- -- hh hh -- -- -- -- | -- -- hh hh -- -- -- -- | -- -- hh hh -- -- -- -- |


## TODO

0. expose hooks to when beats will change
0. enable progressively building up a track, i.e. playing a new track just
   adds to the old one, not replaces it
0. triplets, swung notes, etc
0. Fix sound loading in firefox

## Random Beats

    bd| bd bd -- -- bd bd -- -- bd bd -- -- bd bd -- --
    sn| -- -- sn -- -- -- sn -- -- -- sn -- -- -- sn --
    hh| hh hh hh hh hh hh hh hh hh hh hh hh hh hh hh hh


    bd| bd -- -- -- bd bd -- -- bd -- -- -- bd bd -- --
    sn| -- -- sn -- -- -- sn -- -- -- sn -- -- -- sn --
    hh| -- hh hh -- -- hh hh -- -- hh hh -- -- hh hh --


    bd| bd -- -- -- -- -- -- -- bd -- bd -- -- -- -- -- bd -- -- -- -- -- -- -- bd -- bd -- -- -- -- --
    sn| -- -- -- -- sn -- -- -- -- -- -- -- sn -- -- -- -- -- -- -- sn -- -- -- -- -- -- -- sn -- -- --
    hh| -- -- hh hh -- -- -- -- -- -- hh hh -- -- -- -- -- -- hh hh -- -- -- -- -- -- hh hh -- -- -- --

