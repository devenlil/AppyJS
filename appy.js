function AppyJS(callback) {
  this.target = -1;

  AppyJS.loadJquery(function() {
    jQuery.getJSON("builds.json", function(b) {
      this.buildsObj = b;
      if (typeof callback == "function") callback();
    }.bind(this));
  }.bind(this));
}

AppyJS.prototype.setTargetByStage = function(stage) {
  // Get target build number by stage
  var target = this.buildsObj[stage];
  if (typeof target != "number") {
    throw new Error("Target stage ('" + stage + "') not found.");
  }
  this.target = target;
}

AppyJS.prototype.setTargetByBuild = function(buildNumber) {
  this.target = buildNumber;
}

// Starts Application
AppyJS.prototype.start = function() {
  // Search for build version
  for (var i = 0; i < this.buildsObj.builds.length; i++) {
    var build = this.buildsObj.builds[i];
    if (build.buildNumber != this.target) {
      continue;
    }
    if (!build.enabled) {
      throw new Error("Version (" + this.target + ") is disabled.");
    }
    var appPath = this.buildsObj.buildsPath + build.version + "/" + build.main;
    AppyJS.loadJS(appPath, function(success) {
      if (!success) {
        throw new Error("App failed to start.");
      }
    });
    return;
  }
  throw new Error("Target build (" + this.target + ") not found.")
}

AppyJS.loadJquery = function(callback) {
  // Check if jQuery is present, if not load it from Google CDN.
  if (typeof jQuery == "undefined") {
    AppyJS.loadJS("https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js",
      function(success) {
        if (!success) {
          throw new Error("Failed to load jquery from google cdn.");
        }
        if (typeof callback == "function") callback();
      }
    );
  } else {
    if (typeof callback == "function") callback();
  }
}

// Generic function used to load any script (.js)
AppyJS.loadJS = function(src, callback) {
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
