import { App, AppOptions, ViewConfig } from "dwv";

// create the dwv app
const app = new App();

// initialise
const viewConfig0 = new ViewConfig("layerGroup0");
const viewConfigs = { "*": [viewConfig0] };
const options = new AppOptions(viewConfigs);
app.init(options);

// load dicom data
app.loadURLs([
  "https://raw.githubusercontent.com/ivmartel/dwv/master/tests/data/bbmri-53323851.dcm",
]);
