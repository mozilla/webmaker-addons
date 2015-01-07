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

  [http-server]: https://www.npmjs.org/package/http-server
