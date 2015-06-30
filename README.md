# guacamole

`guacamole` is a wrapper for the SauceLabs browser API.

### Features:
  - Standardized browser identification with machine and human-readable browser identifiers.
  - Generate Sauce `desiredCapabilities` objects from a browser id, with screen resolution and device orientation support.
  - Built-in command-line interface for listing browsers and generating `desiredCapabilities` objects.

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
    var desiredCapabilities = guacamole.get("firefox_38_OS_X_10_9_Desktop");
    // Yields: { browserName: 'firefox', version: '38', platform: 'OS X 10.9' }
    console.log(desiredCapabilities);
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

Fetch a specific browser from the command line with `--browser`

```console
$ ./node_modules/.bin/guacamole --browser=firefox_38_OS_X_10_9_Desktop
{ browserName: 'firefox', version: '38', platform: 'OS X 10.9' }
```

## Licenses

All code not otherwise specified is Copyright Wal-Mart Stores, Inc.
Released under the [MIT](./LICENSE) License.
