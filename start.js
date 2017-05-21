(function() {

  var appy = new AppyJS(function() {
    appy.setTargetByStage("release");
    // To start application by build number:
    // appy.setTargetByBuild(1); [where 1= build number of target app]
    appy.start();
  });

})();
