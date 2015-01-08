This is a simple web service that lets you take screenshots
of static, user-created webpages.

It uses SlimerJS instead of PhantomJS because the latter uses
a very old version of Webkit that doesn't support Google Fonts
(which use WOFF fonts), among other things, rendering the
fidelity of the screenshots quite poor. SlimerJS, on the other
hand, uses a relatively recent version of Gecko.

However, because SlimerJS isn't truly headless, and is a bit
less mature than PhantomJS, there's a bit of setup involved.

The following instructions assume you have a terminal window
open, with the current directory set to the location of this
README file.

1. Run `npm install`.
2. Download and install [SlimerJS][]. Note that on Linux, you
   may need to install some additional libraries; see the
   SlimerJS website for more details.
3. Either ensure that `slimerjs` is on your path, or set the
   `SLIMERJS` environment variable to point to the `slimerjs`
   script.
4. If you're on a Linux server without X, you may need to
   setup Xvfb; see below for more details.

At this point you can try running the following:

```
node render.js "<h1>hello</h1>" > hello.png
```

Hopefully, `hello.png` now contains a screenshot of the word
"hello" in a large, bold font.

If that works, run `node app.js` to start the server. You can
set a custom port via the `PORT` environment variable, but it
defaults to 3000. Assuming you're using that port, visit the
following URL in your browser:

```
http://localhost:3000/shot?html=%3Ch1%3Ehello%3C%2Fh1%3E
```

You should see the same "hello" text you saw in the earlier
image you generated. Awesome!

## Xvfb Setup

If you need to run this service on a Linux server that doesn't
have an X server, you'll have to use Xvfb. On Ubuntu, this can
be done via `sudo apt-get install xvfb`. You'll then want to use
an [xvfb init script][] to make it easy to start xvfb. Once
you start it, set the `DISPLAY` environment variable appropriately,
e.g. `export DISPLAY=:1`.

<!-- Links -->

  [SlimerJS]: http://slimerjs.org/
  [xvfb init script]: https://gist.github.com/jterrace/2911875
