/* eslint no-unused-vars: 0, no-undef: 0 */
"use strict";
var Browsers = require("../src/browsers");
var Q = require("q");
var fs = require("fs");
var chai = require("chai");
var path = require("path");

var expect = chai.expect;

var cachedBrowsers = JSON.parse(
  fs.readFileSync(path.resolve("./test_support/cached_sauce_api_result.json"), "utf8"));

describe("normalizer", function () {

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

  it("normalizes Chrome42 on Windows correctly", function () {
    var id = "chrome_42_Windows_2012_R2_Desktop";
    var result = Browsers.get({ id: id });
    expect(result).to.have.length(1);

    var chrome43 = result[0];
    expect(chrome43).to.have.property("browserName", "chrome");
    expect(chrome43).to.have.property("platform", "Windows 2012 R2");
    expect(chrome43).to.have.property("version", "42");
    expect(chrome43).to.have.property("browserName", "chrome");
  });

  it("normalizes latest Chrome version on Windows correctly", function () {
    var id = "chrome_latest_Windows_2012_R2_Desktop";
    var result = Browsers.get({ id: id });
    expect(result).to.have.length(1);

    var chrome = result[0];
    expect(chrome).to.have.property("browserName", "chrome");
    expect(chrome).to.have.property("platform", "Windows 2012 R2");
    expect(chrome).to.have.property("version", "54");
    expect(chrome).to.have.property("browserName", "chrome");
  });

  it("sets resolution correctly", function () {
    var result = Browsers.get({
      id: "chrome_43_Windows_2012_R2_Desktop",
      screenResolution: "1024x768"
    });
    expect(result).to.have.length(1);

    var chrome43 = result[0];
    expect(chrome43).to.have.property("screenResolution", "1024x768");
  });

  it("sets orientation correctly", function () {
    var id = "ipad_8_4_iOS_iPad_Simulator";
    var result = Browsers.get({
      id: id,
      deviceOrientation: "landscape"
    });
    expect(result).to.have.length(1);

    var ipad = result[0];
    expect(ipad).to.have.property("deviceOrientation", "landscape");
  });

});
