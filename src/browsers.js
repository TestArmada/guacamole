var Q = require("q");
var _ = require("lodash");
var request = require("request");
var browsers = [];

var SauceBrowsers = {

  // NOTE: The URL https://saucelabs.com/rest/v1/info/platforms/webdriver has this
  // information, but not the available resolutions. That's why we go to the endpoint 
  // with the much larger set of options (+ automation backends) and then filter down.
  SAUCE_URL: "https://saucelabs.com/rest/v1/info/platforms/all?resolutions=true",
  _haveCachedSauceBrowsers: false,

  filter: function (fn) {
    return browsers.filter(fn);
  },

  // Return a browser by id if it exists in our browser list. Optionally return that
  // browser only if a resolution is supported by that browser environment
  get: function (id, resolution, orientation) {
    var browser;

    if (!_.isString(id)) return;

    id = id.trim();

    browsers.forEach(function (b) {
      if (b.id === id) {
        // If we've requested a display size, verify it exists
        if (resolution) {
          if (b.resolutions && b.resolutions.indexOf(resolution) > -1) {
            browser = b;
          }
        } else {
          browser = b;
        }
      }
    });

    var result;

    if (browser) {
      result = _.extend({}, browser);

      // Orientation isn't a built-in property of browsers in sauce, it's just an
      // additional setting after the fact.
      if (orientation) {
        result.deviceOrientation = orientation;
      }

      if (resolution) {
        result.deviceResolution = resolution;
      }
    }

    return result;
  },

  _normalize: function (data) {
    var result = data
      .filter(function (browser) {
        return browser.automation_backend === "webdriver";
      })
      .map(function (browser) {
        var name = browser.api_name;

        if (name === "internet explorer") {
          name = "IE";
        }

        var family;
        if (name === "IE") {
          family = "IE";
        } else if (name.indexOf("android") === 0) {
          family = "Webkit Android";
        } else if (name.indexOf("firefox") === 0) {
          family = "Firefox (Gecko)";
        } else if (name.indexOf("ipad") === 0) {
          family = "Webkit iPad";
        } else if (name.indexOf("iphone") === 0) {
          family = "Webkit iPhone";
        } else if (name.indexOf("opera") === 0) {
          family = "Opera";
        } else if (name.indexOf("safari") === 0) {
          family = "Webkit Safari";
        } else if (name.indexOf("chrome") === 0) {
          family = "Chrome";
        } else {
          family = "Other";
        }

        var clean = function (str) { return str.split(" ").join("_").split(".").join("_"); };

        var deviceName = (browser.device ? browser.device : "Desktop");
        var osName = browser.os;

        // For a real device, don't translate to a simulator devicename
        if (deviceName.toLowerCase().indexOf("device") === -1) {
          if (deviceName.toLowerCase() == "ipad") {
            deviceName = "iPad Simulator";
            osName = "iOS";
          }

          if(deviceName.toLowerCase() == "iphone") {
            deviceName = "iPhone Simulator";
            osName = "iOS";
          }

          if(deviceName.toLowerCase() == "android") {
            deviceName = "Android Simulator";
          }
        }

        if (osName.indexOf("Mac") === 0) {
          osName = osName.replace("Mac", "OS X");
        }

        var result = {
          // name , version, OS, device
          id: (
            clean(name)
            + "_" + clean(browser.short_version)
            + "_" + clean(osName)
            + "_" + clean(deviceName)
          ),
          browserName: browser.api_name,
          version: browser.short_version,
          platform: osName,
          family: family,
          resolutions: browser.resolutions
        };

        if (deviceName.toLowerCase().indexOf("android") > -1) {
          result.platformVersion = browser.short_version || browser.version;
          result.platformName = osName;
        }

        // Note: we only set the device property if we have a non-desktop device. This is because
        // SauceLabs doesn't actually have a "Desktop" device, we're just making one up for UX.
        if (deviceName !== "Desktop") {
          // this is a mobile device as opposed to a desktop browser.
          result.deviceName = deviceName;
        }

        return result;
      });

    return _.sortBy(result, function (browser) { return browser.id; });
  },

  // Fetch a raw list of browsers from the Sauce API
  _fetch: function () {
    var deferred = Q.defer();

    request(this.SAUCE_URL, function (err, data) {
      if (err) {
        deferred.reject(err);
      } else {
        try {
          data = JSON.parse(data.body);
        } catch (e) {
          deferred.reject(e);
          return;
        }
        deferred.resolve(data);
      }
    });

    return deferred.promise;
  },

  // Return a promise that we'll build a list of supported browsers
  initialize: function () {
    var deferred = Q.defer();
    var self = this;

    if (this._haveCachedSauceBrowsers) {
      deferred.resolve();
      return deferred.promise;
    }

    this._fetch()
      .then(function (data) {
        self._haveCachedSauceBrowsers = true;
        browsers = self._normalize(data);

        deferred.resolve();
      })
      .catch(function (err) {
        deferred.reject(err);
      });

    return deferred.promise;
  }
};

SauceBrowsers._normalize = SauceBrowsers._normalize.bind(SauceBrowsers);

module.exports = SauceBrowsers;