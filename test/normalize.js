var Browsers = require("../src/browsers.js");
var Q = require("q");
var fs = require("fs");
var chai = require("chai");
var path = require("path");

var expect = chai.expect;

var cachedBrowsers = JSON.parse(fs.readFileSync(path.resolve("./test_support/cached_sauce_api_result.json"), "utf8"));

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

  it("normalizes Chrome43 on Windows correctly", function () {
    var id = "chrome_43_Windows_2012_R2_Desktop";
    var chrome43 = Browsers.get(id);

    expect(chrome43).to.have.property("id", "chrome_43_Windows_2012_R2_Desktop");
    expect(chrome43).to.have.property("platform", "Windows 2012 R2");
    expect(chrome43).to.have.property("family", "Chrome");
    expect(chrome43).to.have.property("version", "43");
    expect(chrome43).to.have.property("browserName", "chrome");
  });

  it("sets resolution correctly", function () {
    var chrome43 = Browsers.get("chrome_43_Windows_2012_R2_Desktop", "1024x768");
    expect(chrome43).to.have.property("displayResolution", "1024x768");
  });

  it("sets orientation correctly", function () {
    var id = "ipad_8_0_iOS_iPad_Simulator";
    var ipad = Browsers.get(id, undefined, "landscape");
    expect(ipad).to.have.property("displayOrientation", "landscape");
  });

});