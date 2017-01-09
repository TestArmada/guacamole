/* eslint no-unused-vars: 0, no-undef: 0, no-magic-numbers: 0 */
"use strict";
const Browsers = require("../src/browsers");
const Q = require("q");
const fs = require("fs");
const chai = require("chai");
const path = require("path");

const expect = chai.expect;

const cachedBrowsers = JSON.parse(
  fs.readFileSync(path.resolve("./test_support/cached_sauce_api_result.json"), "utf8"));

describe("Windows version translations", () => {

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

  it("Finds Windows XP correctly", () => {
    const result = Browsers.get({ platform: "Windows XP" });
    expect(result).to.have.length(68);
  });

  it("Finds Windows 7 correctly", () => {
    const result = Browsers.get({ platform: "Windows 7" });
    expect(result).to.have.length(70);
  });

  it("Finds Windows 8 correctly", () => {
    const result = Browsers.get({ platform: "Windows 8" });
    expect(result).to.have.length(64);
  });

  it("Finds Windows 8.1 correctly", () => {
    const result = Browsers.get({ platform: "Windows 8.1" });
    expect(result).to.have.length(64);
  });

  it("Finds Windows XP browser ids correctly", () => {
    const id = "chrome_43_Windows_XP_Desktop";
    const result = Browsers.get({ id });
    expect(result).to.have.length(1);
  });

  it("Finds Windows 7 browser ids correctly", () => {
    const id = "chrome_43_Windows_7_Desktop";
    const result = Browsers.get({ id });
    expect(result).to.have.length(1);
  });

  it("Finds Windows 8 browser ids correctly", () => {
    const id = "chrome_43_Windows_8_Desktop";
    const result = Browsers.get({ id });
    expect(result).to.have.length(1);
  });

  it("Finds Windows 8.1 browser ids correctly", () => {
    const id = "chrome_43_Windows_8_1_Desktop";
    const result = Browsers.get({ id });
    expect(result).to.have.length(1);
  });
});
