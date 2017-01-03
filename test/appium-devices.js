/* eslint filenames/filenames: 0, no-unused-vars: 0, no-undef: 0 */
"use strict";
var Browsers = require("../src/browsers");
var Q = require("q");
var fs = require("fs");
var chai = require("chai");
var path = require("path");

var expect = chai.expect;

var cachedBrowsers = JSON.parse(fs.readFileSync(
  path.resolve("./test_support/cached_sauce_api_result.json"), "utf8"));

describe("Appium Devices", function () {

  beforeEach(function (done) {
    // Stub fetch with a cached Sauce API result
    Browsers._fetch = function () {
      var deferred = Q.defer();
      deferred.resolve(cachedBrowsers);
      return deferred.promise;
    };

    Browsers.initialize().then(function () {
      done();
    });
  });

  it("Finds an iPhone with iOS 8.2 Correctly (with multiple host OSes)", function () {
    var result = Browsers.get({
      "platform": "iOS",
      "platformVersion": "8.2",
      "deviceName": "iPhone Simulator"
    });
    expect(result).to.have.length(1);
  });

  it("Finds a Google Nexus 7", function () {
    var result = Browsers.get({
      "platform": "Android",
      "platformVersion": "4.4",
      "deviceName": "Google Nexus 7 HD Emulator"
    });
    expect(result).to.have.length(1);
  });

  it("Adds an additional unlisted device from a file", function () {
    Browsers.addNormalizedBrowsersFromFile(path.resolve("./test_support/device_additions.json"));
    var result = Browsers.get({
      "id": "iphone6_device"
    });
    expect(result).to.have.length(1);
  });

});
