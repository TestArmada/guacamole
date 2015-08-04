var Browsers = require("../src/browsers");
var Q = require("q");
var fs = require("fs");
var chai = require("chai");
var path = require("path");

var expect = chai.expect;

var cachedBrowsers = JSON.parse(fs.readFileSync(path.resolve("./test_support/cached_sauce_api_result.json"), "utf8"));

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
    var result = Browsers.get({ platform: "iOS", "version": "8.2", "deviceName": "iPhone Simulator" });
    expect(result).to.have.length(2);
  });

  it("Finds a Google Nexus 7", function () {
    var result = Browsers.get({ platform: "Android", "version": "4.4", "deviceName": "Google Nexus 7 HD Emulator" });
    expect(result).to.have.length(1);
  });

});