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
  });


});