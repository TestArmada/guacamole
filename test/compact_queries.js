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

describe("Compact Querying", () => {

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

  it("Finds a bunch of browsers from a compact query", () => {
    const query = [
      {
        "browserName": "internet explorer",
        "versions": ["9", "10", "11"]  // should find one of each, ignoring platform
      },
      {
        "browserName": "chrome" // should find one, highest version since no versions asked for
      },
      {
        "browserName": "firefox" // should find one, highest version since no versions asked for
      },
      {
        "browserName": "safari", // one safari that fulfills 7
        "versions": ["7"]
      }
    ];

    Browsers.get(query);
  });


});
