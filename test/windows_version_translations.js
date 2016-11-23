var Browsers = require("../src/browsers");
var Q = require("q");
var fs = require("fs");
var chai = require("chai");
var path = require("path");

var expect = chai.expect;

var cachedBrowsers = JSON.parse(fs.readFileSync(path.resolve("./test_support/cached_sauce_api_result.json"), "utf8"));

describe("Windows version translations", function () {

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

  it("Finds Windows XP correctly", function () {
    var result = Browsers.get({ platform: "Windows XP" });
    expect(result).to.have.length(71);
  });

  it("Finds Windows 7 correctly", function () {
    var result = Browsers.get({ platform: "Windows 7" });
    expect(result).to.have.length(86);
  });

  it("Finds Windows 8 correctly", function () {
    var result = Browsers.get({ platform: "Windows 8" });
    expect(result).to.have.length(80);
  });

  it("Finds Windows 8.1 correctly", function () {
    var result = Browsers.get({ platform: "Windows 8.1" });
    expect(result).to.have.length(80);
  });

  it("Finds Windows XP browser ids correctly", function () {
    var id = "chrome_43_Windows_XP_Desktop";
    var result = Browsers.get({ id: id });
    expect(result).to.have.length(1);
  });

  it("Finds Windows 7 browser ids correctly", function () {
    var id = "chrome_43_Windows_7_Desktop";
    var result = Browsers.get({ id: id });
    expect(result).to.have.length(1);
  });

  it("Finds Windows 8 browser ids correctly", function () {
    var id = "chrome_43_Windows_8_Desktop";
    var result = Browsers.get({ id: id });
    expect(result).to.have.length(1);
  });

  it("Finds Windows 8.1 browser ids correctly", function () {
    var id = "chrome_43_Windows_8_1_Desktop";
    var result = Browsers.get({ id: id });
    expect(result).to.have.length(1);
  });


});