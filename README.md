webmaker-addons
===============

Prototypes for add-ons that serve as a gateway from browser to Webmaker.

## Quick Start

Working on the project just requires a web server that serves
static files from the root of the repository. If you don't have
one, try `python -m SimpleHTTPServer`, or if you like node use
[http-server][].

If you want to develop offline, add `?bin=offline` to the end of
your URL. This will prevent the app from syncing with Firebase.
That said, some things that require a network connection, like
Google Fonts, won't work.

## Configuration

A number of configuration defaults are contained in
`require-config.js`. If you want to change these, make a file
alongside it called `require-config.local.js`. Any changes you make
to configuration variables/objects in this file will take effect
before the app initializes.

  [http-server]: https://www.npmjs.org/package/http-server
