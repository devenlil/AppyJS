# AppyJS
AppyJS is a javascript application launcher that allows you to manage multiple versions of your javascript application and makes it easy to work on a development version alongside a production version.

## Setup
1. Place each of the different versions of your app in their own folder, and place all of these folders together in a folder.
2. In the AppyJS `builds.json` file...
  - Change `buildsPath` to point to your folder containing all the different versions of your app.
  - Add all your different app versions in the `builds` array using the format shown in the sample `builds.json`.
    - Make sure to increment `buildNumber` for each version!
  - Change `release` and `development` values to the build number of the version you wish to use for the corresponding stage.
    - You may also add your own development stages here.
3. Load the `appy.js` script.

## How to use?
1. Execute js code to start application
```javascript
var appy = new AppyJS(function() {
  // Set target application stage
  appy.setTargetByStage("release");
  // To set target application by build number:
  // appy.setTargetByBuild(1); [where 1= build number of target app]

  // Start application
  appy.start();
});
```
