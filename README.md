# :warning::warning: DEPRECATED :warning::warning:

This project, and it's related TestArmada projects, will no longer be supported. No further work from the owners will be done, and no PRs will be reviewed.

# magellan-saucelabs-plugin

`magellan-saucelabs-plugin` is a wrapper for the SauceLabs platform API (i.e. the browser/platform selector API).

### Features:
  - Standardized browser identification with machine and human-readable browser identifiers.
  - Generate Sauce `desiredCapabilities` objects from a browser id, with screen resolution and device orientation support.
  - Appium support for native app `desiredCapabilities` objects
  - Built-in command-line interface for listing browsers and generating `desiredCapabilities` objects.
  - Normalize strings from the SauceLabs browser list API to values that `desiredCapabilities` actually consumes.
  - Proxy support if `SAUCE_OUTBOUND_PROXY` is set to a proxy address.

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

Fetch the latest version of a browser/OS combination with `--id` and `latest`:

```console
$ ./node_modules/.bin/guacamole --id=firefox_latest_OS_X_10_9_Desktop
{ browserName: 'firefox', version: '40', platform: 'OS X 10.9' }
```

Amend screenResolution with `--screenResolution`. If the API supports that screen resolution, you'll get a result:
```console
$ ./node_modules/.bin/guacamole --id=firefox_38_OS_X_10_9_Desktop --screenResolution=1024x768
{ browserName: 'firefox',
  version: '38',
  platform: 'OS X 10.9',
  screenResolution: '1024x768' }
```

If you choose a resolution that isn't supported, you'll get an error:
```console
$ ./node_modules/.bin/guacamole --id=firefox_38_OS_X_10_9_Desktop --screenResolution=1024x555
Browsers that match the following specs could not be found:  { screenResolution: '1024x555',
  id: 'firefox_38_OS_X_10_9_Desktop' }
```

`guacamole` supports filtering by a number of fields (**see below for the full list**).

For example, filtering by `--version=43` displays all available versions of Chrome 43:
```console
$ ./node_modules/.bin/guacamole --version=43
[
  {
    "browserName": "chrome",
    "version": "43",
    "platform": "Linux"
  },
  {
    "browserName": "chrome",
    "version": "43",
    "platform": "OS X 10.10"
  },
  {
    "browserName": "chrome",
    "version": "43",
    "platform": "OS X 10.11"
  },
  {
    "browserName": "chrome",
    "version": "43",
    "platform": "OS X 10.8"
  },
  {
    "browserName": "chrome",
    "version": "43",
    "platform": "OS X 10.9"
  },
  {
    "browserName": "chrome",
    "version": "43",
    "platform": "Windows 10"
  },
  {
    "browserName": "chrome",
    "version": "43",
    "platform": "Windows 2003"
  },
  {
    "browserName": "chrome",
    "version": "43",
    "platform": "Windows 2008"
  },
  {
    "browserName": "chrome",
    "version": "43",
    "platform": "Windows 2012"
  },
  {
    "browserName": "chrome",
    "version": "43",
    "platform": "Windows 2012 R2"
  }
]
```

### Native App desiredCapabilities (Appium Support)

`guacamole` supports appium environments, and will ensure that the `appium-version` is set to the currently-recommended backend version of Appium. Examples:

```sh
$ ./node_modules/.bin/guacamole --id=Google_Nexus_7_HD_Emulator_Android_4_4_Linux
[
  {
    "version": "4.4",
    "platform": "Android",
    "deviceName": "Google Nexus 7 HD Emulator",
    "appium-version": "1.4.7"
  }
]

$ ./node_modules/.bin/guacamole --id=iPhone_Simulator_iOS_8_2_OS_X_10_10
[
  {
    "version": "8.2",
    "platform": "iOS",
    "deviceName": "iPhone Simulator",
    "platformName": "iOS",
    "appium-version": "1.4.7"
  }
]
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

### Creating and Using a Shrinkwrap File / Allowing Synchronous Usage

You can cache the results of the SauceLabs browser API:

```console
./node_modules/.bin/guacamole --generate-shrinkwrap
Wrote guacamole shrinkwrap to /Users/example/myproject/guacamole-shrinkwrap.json
```

This will cache a local copy of the SauceLabs API result, allowing you to bypass a network request and use the `guacamole` API in a synchronous fashion. To use the generated shrinkwrap, call `useShrinkwrap()`:

```javascript
var guacamole = require("guacamole");

// Tell guacamole to use ./guacamole-shrinkwrap.json
guacamole.useShrinkwrap();

// Fetch a specific Firefox by id
console.log(guacamole.get({ id: "firefox_38_OS_X_10_9_Desktop" }));
// Yields: [{ browserName: 'firefox', version: '38', platform: 'OS X 10.9' }]
```

If you have a shrinkwrap stored somewhere other than the default location, you can specify the location when calling `useShrinkwrap()`:

```javascript
// Tell guacamole to use ./settings/guacamole-shrinkwrap.json
guacamole.useShrinkwrap("./settings/guacamole-shrinkwrap.json");
```

The same logic works on the command line version of `guacamole` with the `shrinkwrap` option:
```console
./node_modules/.bin/guacamole --shrinkwrap=./settings/guacamole-shrinkwrap.json --id=firefox_38_OS_X_10_9_Desktop
[
  {
    "browserName": "firefox",
    "version": "38",
    "platform": "OS X 10.9"
  }
]
```

### Windows Version "Polyfills"

While the SauceLabs web-based platform configurator claims to support Windows XP, 7, 8, and 8.1, these platforms are instead provided by equivalent server versions of Windows, thus they do not show up in the Sauce browser API. To account for this, `guacamole` supports the following platforms:

```
OS           |  guacamole translation  |  sauce-side fulfillment
-------------+-------------------------+--------------------------
Windows XP   |  Windows 2003           |  Windows 2003 R2
Windows 7    |  Windows 2008           |  Windows 2008 R2
Windows 8    |  Windows 2012           |  Windows Server 2012
Windows 8.1  |  Windows 2012 R2        |  Windows Server 2012 R2
```

If your code requests a browser id with the substring `Windows_8_1`, for example, it will be translated like so:

```console
$ guacamole --id=chrome_43_Windows_8_1_Desktop
[
  {
    "browserName": "chrome",
    "version": "43",
    "platform": "Windows 2012 R2"
  }
]
```

### REPL

Now Guacamole comes with a REPL (built on [vorpal](http://vorpal.js.org/)) for a better interactive user experience. To use it, simply do

```
./bin/guacamole-repl 
``` 

#### Basic usage

```
guacamole$ help

  Commands:

    help [command...]  Provides help for a given command.
    exit               Exits application.
    desktop            Get saucelabs id for desktop browsers
    appium             Get saucelabs id for appium test
    webkit             Get saucelabs id for mobile browsers

guacamole$ desktop
> Which browser do you prefer? Chrome
Browser: Chrome
> Which version do you prefer? 52
Version: 52
> Which platform do you prefer? windows
Platform: windows
> Generating sauce browser id...
> Platform windows  for Chrome@52 doesn't exist, you can choose from [OS X 10.10,OS X 10.11,OS X 10.9,Windows 10,Windows 2008,Windows 2012,Windows 2012 R2]
guacamole$ desktop
> Which browser do you prefer? chrome
Browser: chrome
> Which version do you prefer? 52
Version: 52
> Which platform do you prefer? windows 2008
Platform: windows 2008
> Generating sauce browser id...
> Use chrome_52_Windows_2008_Desktop as your browser
```

### Proxy Configuration

To use a proxy to reach Saucelabs when querying the Saucelabs API, `gaucamole` checks the presence of an environment variable called `SAUCE_OUTBOUND_PROXY`. Set this variable before using `gaucamole` on the CLI or programmatically to use a proxy.

Note: Proxy configuration is not supported in **synchronous mode**.

```console
$ export SAUCE_OUTBOUND_PROXY=http://your-internal-proxy-host:8080
$ guacamole
```

## License
Documentation in this project is licensed under Creative Commons Attribution 4.0 International License. Full details available at https://creativecommons.org/licenses/by/4.0
