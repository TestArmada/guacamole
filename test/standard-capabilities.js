/* eslint filenames/filenames: 0, no-unused-var: 0, no-undef: 0 */
"use strict";
const Browsers = require("../src/browsers");
const Q = require("q");
const fs = require("fs");
const chai = require("chai");
const path = require("path");

const expect = chai.expect;

const cachedBrowsers = JSON.parse(
  fs.readFileSync(path.resolve("./test_support/cached_sauce_api_result.json"), "utf8"));

describe("Standard", () => {
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

  it("standardize capabilities of a browser", () => {
    const id = "firefox_41_OS_X_10_10_Desktop";
    const result = Browsers.get({
      id
    });
    expect(result).to.have.length(1);

    const target = result[0];
    expect(target).to.have.property("browserName", "firefox");
    expect(target).to.have.property("platform", "OS X 10.10");
    expect(target).to.have.property("version", "41");
  });

  it("standardize saucelabs capabilities of iOS simulator using selenium", () => {
    const id = "iphone_9_0_iOS_iPhone_Simulator";
    const result = Browsers.get({
      id,
      deviceOrientation: "landscape"
    }, true);
    expect(result).to.have.length(1);

    const target = result[0];
    expect(target.desiredCapabilities).to.have.property("browserName", "iphone");
    expect(target.desiredCapabilities).to.have.property("platform", "OS X 10.10");
    expect(target.desiredCapabilities).to.have.property("version", "9.0");
    expect(target.desiredCapabilities).to.have.property("deviceName", "iPhone Simulator");
    expect(target.desiredCapabilities).to.have.property("deviceOrientation", "landscape");
  });

  it("standardize saucelabs capabilities of iOS simulator using appium", () => {
    const id = "iPad_Simulator_iOS_8_4_OS_X_10_10";
    const result = Browsers.get({
      id
    }, true);
    expect(result).to.have.length(1);

    const target = result[0];
    expect(target.desiredCapabilities).to.have.property("browserName", "Safari");
    expect(target.desiredCapabilities).to.have.property("platformName", "iOS");
    expect(target.desiredCapabilities).to.have.property("platformVersion", "8.4");
    expect(target.desiredCapabilities).to.have.property("deviceName", "iPad Simulator");
    expect(target.desiredCapabilities).to.have.property("appium-version");
  });

  it("standardize saucelabs capabilities of android emulator using selenium", () => {
    const id = "android_4_4_Android_Samsung_Galaxy_S3_Emulator";
    const result = Browsers.get({
      id: id
    }, true);
    expect(result).to.have.length(1);

    const target = result[0];
    expect(target.desiredCapabilities).to.have.property("browserName", "android");
    expect(target.desiredCapabilities).to.have.property("platform", "Linux");
    expect(target.desiredCapabilities).to.have.property("version", "4.4");
    expect(target.desiredCapabilities).to.have.property("deviceName", "Samsung Galaxy S3 Emulator");
  });

  it.skip("standardize saucelabs capabilities of android emulator using appium", () => {
    // TODO: android with appium is tricky, we need to think about how to test
  });

});
