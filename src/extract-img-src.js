define(function(require) {
  function test() {
    function expect(html, expectedURL) {
      var url = extractImgSrc(html);

      if (url === expectedURL)
        console.log("PASS on", html, ":", url);
      else
        console.error("FAIL on", html, ":", url, "!==", expectedURL);
    }

    expect(undefined, null);
    expect('<img src="http://blah">', 'http://blah');
    expect('<img><lol src="http://blah">', null);
    expect('blarg', null);
  }

  function extractImgSrc(html) {
    var match = (html || '').match(/\<img[^>]src="([^"]+)"/);
    if (!match) return null;
    return match[1];
  }

  //test();

  return extractImgSrc;
});
