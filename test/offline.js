/* eslint no-unused-consts: 0, no-undef: 0 */
"use strict";
const Browsers = require("../src/browsers");
const chai = require("chai");
const path = require("path");

const expect = chai.expect;

describe("offline support", () => {

  beforeEach(() => {
    Browsers.useShrinkwrap(path.resolve("./test_support/cached_sauce_api_result.json"));
  });

  it("inflates a browser from a local shrinkwrap properly", () => {
    const id = "chrome_43_Windows_2012_R2_Desktop";
    const result = Browsers.get({ id });
    expect(result).to.have.length(1);

    const chrome43 = result[0];
    expect(chrome43).to.have.property("browserName", "chrome");
    expect(chrome43).to.have.property("platform", "Windows 2012 R2");
    expect(chrome43).to.have.property("version", "43");
    expect(chrome43).to.have.property("browserName", "chrome");
  });

});
