(function() {

  var targetStage = "development"; // target stage

  function init(buildsObj) {
    // Get target build
    var target = buildsObj[targetStage];
    if (typeof target != "number") {
      throw new Error("Target stage ('" + targetStage + "') not found.");
    }

    // Search for build version
    for (var i = 0; buildsObj.builds.length; i++) {
      var build = buildsObj.builds[i];
      if (build.buildNumber != target) {
        continue;
      }
      if (!build.enabled) {
        throw new Error("Version (" + target + ") is disabled.");
      }
      var appPath = buildsObj.buildsPath + build.version + "/" + build.main;
      startApp(appPath);
      break;
    }
  }

  function startApp(path) {
    loadJS(path, function(success) {
      if (!success) {
        throw new Error("App failed to start.");
      }
    });
  }

  // Generic function used to load any script (.js)
  function loadJS(src, callback) {
    var script = document.createElement("script");
    script.type = "text/javascript";

    // Create callback
    if (typeof callback == "function") {
      if (script.readyState) {
        script.onreadystatechange = function() {
          if (script.readyState == "loaded" || script.readyState == "complete") {
            script.onreadystatechange = null;
            if (script.status == 200) {
              callback(true);
            } else {
              callback(false);
            }
          }
        };
      } else {
        script.onload = function() {
          callback(true);
        };
        script.onerror = function() {
          callback(false);
        };
      }
    }

    // Set script path
    script.src = src;
    // Append script to page
    document.getElementsByTagName("head")[0].appendChild(script);
  }

  // Check if jQuery is present, if not load it from Google CDN.
  if (typeof jQuery == "undefined") {
    loadJS("https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js",
      function(success) {
        if (!success) {
          throw new Error("Failed to load jquery from google cdn.");
        }
        jQuery.getJSON("builds.json", init);
      }
    );
  } else {
    jQuery.getJSON("builds.json", init);
  }

})();
