var Browsers = require("../src/browsers");
var Q = require("q");
var fs = require("fs");
var chai = require("chai");
var path = require("path");

var expect = chai.expect;

var cachedBrowsers = JSON.parse(fs.readFileSync(path.resolve("./test_support/cached_sauce_api_result.json"), "utf8"));

describe("Compact Querying", function () {

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

  it("Finds a bunch of browsers from a compact query", function () {
    var query = [
      {
        "browserName": "internet explorer",
        "versions": ["9", "10", "11"]         // should find one of each, ignoring platform
      },
      {
        "browserName": "chrome"               // should find one, highest version since no versions asked for
      },
      {
        "browserName": "firefox"              // should find one, highest version since no versions asked for
      },
      {
        "browserName": "safari",              // one safari that fulfills 7
        "versions": ["7"]
      }
    ];

    Browsers.get(query);
  });


});