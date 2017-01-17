/* eslint filenames/filenames: 0, no-unused-vars: 0, no-undef: 0 */
"use strict";
const Browsers = require("../src/browsers");
const Q = require("q");
const fs = require("fs");
const chai = require("chai");
const path = require("path");

const expect = chai.expect;

const cachedBrowsers = JSON.parse(fs.readFileSync(
  path.resolve("./test_support/cached_sauce_api_result.json"), "utf8"));

describe("Appium Devices", () => {

  beforeEach((done) => {
    // Stub fetch with a cached Sauce API result
    Browsers._fetch = () => {
      const deferred = Q.defer();
      deferred.resolve(cachedBrowsers);
      return deferred.promise;
    };

    Browsers.initialize().then(() => {
      done();
    });
  });


  it("Finds an iPhone with iOS 8.2 Correctly (with multiple host OSes)", () => {
    const result = Browsers.get({
      "platformName": "iOS",
      "platformVersion": "8.2",
      "deviceName": "iPhone Simulator"
    });
    expect(result).to.have.length(1);
  });

  it("Finds a Google Nexus 7", () => {
    const result = Browsers.get({
      "platformName": "Android",
      "platformVersion": "4.4",
      "deviceName": "Google Nexus 7 HD Emulator"
    });
    expect(result).to.have.length(1);
  });

  it("Adds an additional unlisted device from a file", () => {
    Browsers.addNormalizedBrowsersFromFile(path.resolve("./test_support/device_additions.json"));
    const result = Browsers.get({
      "id": "iphone6_device"
    });
    expect(result).to.have.length(1);
  });

});
