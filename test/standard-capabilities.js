var Browsers = require("../src/browsers");
var Q = require("q");
var fs = require("fs");
var chai = require("chai");
var path = require("path");

var expect = chai.expect;

var cachedBrowsers = JSON.parse(fs.readFileSync(path.resolve("./test_support/cached_sauce_api_result.json"), "utf8"));

describe("Standard", function() {
  beforeEach(function(done) {
    // Stub fetch with a cached Sauce API result
    Browsers._fetch = function() {
      var deferred = Q.defer();
      deferred.resolve(cachedBrowsers);
      return deferred.promise;
    };

    Browsers.initialize().then(function() {
      done();
    });
  });

  it("standardize capabilities of a browser", function() {
    var id = "firefox_41_OS_X_10_10_Desktop";
    var result = Browsers.get({
      id: id
    });
    expect(result).to.have.length(1);

    var target = result[0];
    expect(target).to.have.property("browserName", "firefox");
    expect(target).to.have.property("platform", "OS X 10.10");
    expect(target).to.have.property("version", "41");
  });

  it("standardize capabilities of iOS simulator using selenium", function() {
    var id = "iphone_9_0_iOS_iPhone_Simulator";
    var result = Browsers.get({
      id: id,
      deviceOrientation: "landscape"
    });
    expect(result).to.have.length(1);

    var target = result[0];
    expect(target).to.have.property("browserName", "iphone");
    expect(target).to.have.property("platform", "OS X 10.10");
    expect(target).to.have.property("version", "9.0");
    expect(target).to.have.property("deviceName", "iPhone Simulator");
    expect(target).to.have.property("deviceOrientation", "landscape");
  });

  it("standardize capabilities of iOS simulator using appium", function() {
    var id = "iPad_Simulator_iOS_8_4_OS_X_10_10";
    var result = Browsers.get({
      id: id
    });
    expect(result).to.have.length(1);

    var target = result[0];
    expect(target).to.have.property("browserName", "Safari");
    expect(target).to.have.property("platformName", "iOS");
    expect(target).to.have.property("platformVersion", "8.4");
    expect(target).to.have.property("deviceName", "iPad Simulator");
    expect(target).to.have.property("appium-version");
  });

  it("standardize capabilities of android emulator using selenium", function() {
    var id = "android_4_1_Linux_Samsung_Galaxy_S3_Emulator";
    var result = Browsers.get({
      id: id
    });
    expect(result).to.have.length(1);

    var target = result[0];
    expect(target).to.have.property("browserName", "android");
    expect(target).to.have.property("platform", "Linux");
    expect(target).to.have.property("version", "4.1");
    expect(target).to.have.property("deviceName", "Samsung Galaxy S3 Emulator");
  });

  it.skip("standardize capabilities of android emulator using appium", function() {
    // TODO: android with appium is tricky, we need to think about how to test 
  });

});
