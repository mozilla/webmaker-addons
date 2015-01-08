var webpage = require('webpage').create();
webpage.settings.javascriptEnabled = false;
webpage
  .open(phantom.args[0]) // loads a page
  .then(function(){ // executed after loading
    // store a screenshot of the page
    webpage.viewportSize = {width:640, height:480};
    webpage.scrollPosition = {top: 8, left: 8};
    webpage.render(phantom.args[1],
                   {onlyViewport:true});
    slimer.exit();
  });
