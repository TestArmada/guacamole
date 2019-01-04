/* eslint no-unused-vars: 0, no-undef: 0 */
"use strict";
const Browsers = require("../src/browsers");
const Q = require("q");
const fs = require("fs");
const chai = require("chai");
const path = require("path");

const expect = chai.expect;

const cachedBrowsers = JSON.parse(
  fs.readFileSync(path.resolve("./test_support/cached_sauce_api_result.json"), "utf8"));

describe("normalizer", () => {

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

  it("normalizes Chrome42 on Windows correctly", () => {
    const id = "chrome_42_Windows_2012_R2_Desktop";
    const result = Browsers.get({ id });
    expect(result).to.have.length(1);

    const chrome43 = result[0];
    expect(chrome43).to.have.property("browserName", "chrome");
    expect(chrome43).to.have.property("platform", "Windows 2012 R2");
    expect(chrome43).to.have.property("version", "42");
    expect(chrome43).to.have.property("browserName", "chrome");
  });

  it("normalizes latest Chrome version on Windows correctly", () => {
    const id = "chrome_latest_Windows_2012_R2_Desktop";
    const result = Browsers.get({ id });
    expect(result).to.have.length(1);

    const chrome54 = result[0];
    expect(chrome54).to.have.property("browserName", "chrome");
    expect(chrome54).to.have.property("platform", "Windows 2012 R2");
    expect(chrome54).to.have.property("version", "54");
    expect(chrome54).to.have.property("browserName", "chrome");
  });

  it("sets resolution correctly", () => {
    const result = Browsers.get({
      id: "chrome_43_Windows_2012_R2_Desktop",
      screenResolution: "1024x768"
    });
    expect(result).to.have.length(1);

    const chrome43 = result[0];
    expect(chrome43).to.have.property("screenResolution", "1024x768");
  });

  it("sets orientation correctly", () => {
    const id = "ipad_8_4_iOS_iPad_Simulator";
    const result = Browsers.get({
      id,
      deviceOrientation: "landscape"
    });
    expect(result).to.have.length(1);

    const ipad = result[0];
    expect(ipad).to.have.property("deviceOrientation", "landscape");
  });

  it("handles and logs a non-array response", () => {
    const response = null;
    expect(() => Browsers._normalize(response)).to.throw(`Invalid Response: ${response}`);
  });

  it("handles and logs a non-array, object response", () => {
    const response = { error: "something went wrong" };
    const expected = `Invalid Response: ${JSON.stringify(response)}`;
    expect(() => Browsers._normalize(response)).to.throw(expected);
  });

});
