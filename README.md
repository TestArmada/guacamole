# guacamole

`guacamole` is a wrapper for the SauceLabs browser API.

### Features:
  - Standardized browser identification with machine and human-readable browser identifiers.
  - Generate Sauce `desiredCapabilities` objects from a browser id, with screen resolution and device orientation support.
  - Built-in command-line interface for listing browsers and generating `desiredCapabilities` objects.
  - Normalize strings from the SauceLabs browser list API to values that `desiredCapabilities` actually consumes.

### Installation

Install `guacamole`:

```console
$ npm install --save guacamole
```

### Programmatic Usage

Fetch a specific browser by id with `get()`

```javascript
var guacamole = require("guacamole");

guacamole.initialize()
  .then(function () {

    // Fetch a specific Firefox by id
    console.log(guacamole.get({
      id: "firefox_38_OS_X_10_9_Desktop"
    }));
    // Yields: [{ browserName: 'firefox', version: '38', platform: 'OS X 10.9' }]

    // Fetch a specific Firefox by id, with a set screen resolution
    console.log(guacamole.get({
      id: "firefox_38_OS_X_10_9_Desktop",
      screenResolution: "1024x768"
    }));
    // Yields: { browserName: 'firefox', version: '38', platform: 'OS X 10.9', screenResolution: '1024x768' }

    // Fetch a list of available Chrome 43 variants:
    guacamole.get({ version: "43" });

    // Yields:
    /*
    [ { browserName: 'chrome',
        version: '43',
        platform: 'Linux' },
      { browserName: 'chrome',
        version: '43',
        platform: 'OS X 10.10' },
      { browserName: 'chrome',
        version: '43',
        platform: 'OS X 10.6' },
      { browserName: 'chrome',
        version: '43',
        platform: 'OS X 10.8' },
      { browserName: 'chrome',
        version: '43',
        platform: 'OS X 10.9' },
      { browserName: 'chrome',
        version: '43',
        platform: 'Windows 2003' },
      { browserName: 'chrome',
        version: '43',
        platform: 'Windows 2008' },
      { browserName: 'chrome',
        version: '43',
        platform: 'Windows 2012' },
      { browserName: 'chrome',
        version: '43',
        platform: 'Windows 2012 R2' } ]
    */
  })
  .catch(function (error) {
    console.error("Could not load browser details from Sauce API:", error);
  });
```

### Command Line Usage

List all available browsers on the command line with `./node_modules/.bin/guacamole`:

```console
$ ./node_modules/.bin/guacamole
Available Sauce Browsers:
┌────────────────────┬─────────────────────────────────────────┬──────────────────────┬─────────┬────────────────────┬──────────────────────┐
│ Family             │ Alias                                   │ Browser              │ Version │ OS                 │ Device               │
├────────────────────┼─────────────────────────────────────────┼──────────────────────┼─────────┼────────────────────┼──────────────────────┤
│ Chrome             │
├────────────────────┼─────────────────────────────────────────┼──────────────────────┼─────────┼────────────────────┼──────────────────────┤
│ 1.                 │ chrome_26_Linux_Desktop                 │ chrome               │ 26      │ Linux              │ Desktop              │
├────────────────────┼─────────────────────────────────────────┼──────────────────────┼─────────┼────────────────────┼──────────────────────┤
│ 2.                 │ chrome_26_Windows_2003_Desktop          │ chrome               │ 26      │ Windows 2003       │ Desktop              │
├────────────────────┼─────────────────────────────────────────┼──────────────────────┼─────────┼────────────────────┼──────────────────────┤
│ 3.                 │ chrome_26_Windows_2008_Desktop          │ chrome               │ 26      │ Windows 2008       │ Desktop              │
├────────────────────┼─────────────────────────────────────────┼──────────────────────┼─────────┼────────────────────┼──────────────────────┤
│ 4.                 │ chrome_26_Windows_2012_Desktop          │ chrome               │ 26      │ Windows 2012       │ Desktop              │
├────────────────────┼─────────────────────────────────────────┼──────────────────────┼─────────┼────────────────────┼──────────────────────┤

  ...

```

Fetch a specific browser from the command line with `--id`

```console
$ ./node_modules/.bin/guacamole --id=firefox_38_OS_X_10_9_Desktop
{ browserName: 'firefox', version: '38', platform: 'OS X 10.9' }
```

Amend screenResolution with `--screenResolution`. If the API supports that screen resolution, you'll get a result:
```console
$ ./bin/guacamole --id=firefox_38_OS_X_10_9_Desktop --screenResolution=1024x768
{ browserName: 'firefox',
  version: '38',
  platform: 'OS X 10.9',
  screenResolution: '1024x768' }
```

If you choose a resolution that isn't supported, you'll get an error:
```console
$ ./bin/guacamole --id=firefox_38_OS_X_10_9_Desktop --screenResolution=1024x555
Browsers that match the following specs could not be found:  { screenResolution: '1024x555',
  id: 'firefox_38_OS_X_10_9_Desktop' }
```

`guacamole` supports filtering by a number of fields (**see below for the full list**).

For example, filtering by `--version=43` displays all available versions of Chrome 43:
```console
$ ./bin/guacamole --version=43
[ { browserName: 'chrome', version: '43', platform: 'Linux' },
  { browserName: 'chrome', version: '43', platform: 'OS X 10.10' },
  { browserName: 'chrome', version: '43', platform: 'OS X 10.6' },
  { browserName: 'chrome', version: '43', platform: 'OS X 10.8' },
  { browserName: 'chrome', version: '43', platform: 'OS X 10.9' },
  { browserName: 'chrome',
    version: '43',
    platform: 'Windows 2003' },
  { browserName: 'chrome',
    version: '43',
    platform: 'Windows 2008' },
  { browserName: 'chrome',
    version: '43',
    platform: 'Windows 2012' },
  { browserName: 'chrome',
    version: '43',
    platform: 'Windows 2012 R2' } ]
```

### Matchable / Amendable desiredCapabilities

The following list of filter options can be used in the programmatic API or command line interface:

```javascript
get({
  "id": xxxx,                 // Proprietary to guacamole
  "family": xxxx,             // Proprietary to guacamole

  "browserName": xxxx,
  "version": xxxx,
  "platform": xxxx,
  "deviceName": xxxx,
  "platformVersion": xxxx,
  "platformName": xxxx,

  "screenResolution": xxxx,   // if supported by Sauce API
  "deviceOrientation": xxxx
})
```

```console
Command Line Options:
  --id=xxxxx                   (proprietary to guacamole)
  --family=xxxxx               (proprietary to guacamole)

  --browserName=xxxxx
  --version=xxxxx
  --platform=xxxxx
  --deviceName=xxxxx
  --platformVersion=xxxxx
  --platformName=xxxxx

  --screenResolution=xxxxx     (if supported)
  --deviceOrientation=xxxxx    (always used)
```

## Licenses

All code not otherwise specified is Copyright Wal-Mart Stores, Inc.
Released under the [MIT](./LICENSE) License.
