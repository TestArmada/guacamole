var Browsers = require("../src/browsers");
var Q = require("q");
var fs = require("fs");
var chai = require("chai");
var path = require("path");

var expect = chai.expect;

describe("offline support", function () {

  beforeEach(function () {
    Browsers.useShrinkwrap(path.resolve("./test_support/cached_sauce_api_result.json"));
  });

  it("inflates a browser from a local shrinkwrap properly", function () {
    var id = "chrome_43_Windows_2012_R2_Desktop";
    var result = Browsers.get({ id: id });
    expect(result).to.have.length(1);

    var chrome43 = result[0];
    expect(chrome43).to.have.property("browserName", "chrome");
    expect(chrome43).to.have.property("platform", "Windows 2012 R2");
    expect(chrome43).to.have.property("version", "43");
    expect(chrome43).to.have.property("browserName", "chrome");
  });

});