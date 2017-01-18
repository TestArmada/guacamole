/* eslint no-magic-numbers: 0, no-console: 0 */
"use strict";
const _ = require("lodash");
const Table = require("cli-table");
const clc = require("cli-color");
const SauceBrowsers = require("./browsers");

module.exports = (callback) => {
  console.log("Available Sauce Browsers:");
  const browsers = SauceBrowsers.filter(() => true);

  const families = _.groupBy(browsers, (browser) => browser.family);

  const maxFamWidth = _.max(Object.keys(families), (f) => f.length).length + 5;

  const maxCLIWidth = _.max(_.map(_.map(browsers, (b) => b.id), (b) => b.length)) + 5;

  const maxBrowserWidth = _.max(_.map(_.map(browsers,
    (b) => b.desiredCapabilities.browserName || "Native app"), (b) => b.length)) + 5;

  const maxVersionWidth = _.max(browsers.map(
    (b) => b.desiredCapabilities.version || b.desiredCapabilities.platformVersion
  ), (b) => b.toString().length).length + 5;

  const maxOSWidth = _.max(_.map(_.map(browsers,
    (b) => b.desiredCapabilities.platform || b.desiredCapabilities.platformName),
    (b) => b.length)) + 5;

  const maxDeviceWidth = _.max(_.map(_.map(browsers,
    (b) => b.desiredCapabilities.deviceName || "Desktop"),
    (b) => b.length)) + 5;

  const table = new Table({
    head: ["Family", "Alias", "Browser/Env", "Version", "OS", "Device"],
    colWidths: [maxFamWidth, maxCLIWidth, maxBrowserWidth,
      maxVersionWidth, maxOSWidth, maxDeviceWidth]
  });

  let count = 1;

  Object.keys(families).sort().forEach((family) => {
    table.push([clc.red(family)]);
    families[family].forEach((b) => {
      table.push([
        clc.blackBright(`${count}.`),
        b.id,
        b.desiredCapabilities.browserName || "Native app",
        b.desiredCapabilities.version || b.desiredCapabilities.platformVersion,
        b.desiredCapabilities.platform || b.desiredCapabilities.platformName,
        b.desiredCapabilities.deviceName ?
          clc.cyanBright(b.desiredCapabilities.deviceName) : "Desktop"
      ]);
      count++;
    });
  });

  callback(table);
};
