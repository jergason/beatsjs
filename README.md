# beatsjs

beatsjs is an api for creating beats in JavaScript with the Web Audio API.

This is super early days so the api is basically non-existent but w/e.


## Example

There is an example in the `/example` directory. To set it up, do this!

```bash
npm install
npm run-script build
npm install -g serve # web server
serve .
```

Go to
[http://localhost:3000/example/index.html](http://localhost:3000/example/index.html)
in your browser, and drop the beat.


Try pasting in one of these patterns:


    bd| bd -- -- -- -- -- -- -- | bd -- bd -- -- -- -- -- | bd -- -- -- -- -- -- -- | bd -- bd -- -- -- -- -- |
    sn| -- -- -- -- sn -- -- -- | -- -- -- -- sn -- -- -- | -- -- -- -- sn -- -- -- | -- -- -- -- sn -- -- -- |


## TODO

0. triplets, swung notes, etc

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

