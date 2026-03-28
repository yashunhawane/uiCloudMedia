const { withAndroidManifest } = require("expo/config-plugins");

module.exports = function withAndroidCleartextTraffic(config) {
  return withAndroidManifest(config, (config) => {
    const androidManifest = config.modResults;
    const mainApplication = androidManifest?.manifest?.application?.[0];

    if (mainApplication?.$) {
      mainApplication.$["android:usesCleartextTraffic"] = "true";
    }

    return config;
  });
};
