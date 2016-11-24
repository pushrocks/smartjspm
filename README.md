# smartjspm
smartjspm wraps the awesome jspm to enable easier automated workflows

## Availabililty
[![npm](https://push.rocks/assets/repo-button-npm.svg)](https://www.npmjs.com/package/smartjspm)
[![git](https://push.rocks/assets/repo-button-git.svg)](https://gitlab.com/pushrocks/smartjspm)
[![git](https://push.rocks/assets/repo-button-mirror.svg)](https://github.com/pushrocks/smartjspm)
[![docs](https://push.rocks/assets/repo-button-docs.svg)](https://pushrocks.gitlab.io/smartjspm/)

## Status for master
[![build status](https://gitlab.com/pushrocks/smartjspm/badges/master/build.svg)](https://gitlab.com/pushrocks/smartjspm/commits/master)
[![coverage report](https://gitlab.com/pushrocks/smartjspm/badges/master/coverage.svg)](https://gitlab.com/pushrocks/smartjspm/commits/master)
[![npm downloads per month](https://img.shields.io/npm/dm/smartjspm.svg)](https://www.npmjs.com/package/smartjspm)
[![Dependency Status](https://david-dm.org/pushrocks/smartjspm.svg)](https://david-dm.org/pushrocks/smartjspm)
[![bitHound Dependencies](https://www.bithound.io/github/pushrocks/smartjspm/badges/dependencies.svg)](https://www.bithound.io/github/pushrocks/smartjspm/master/dependencies/npm)
[![bitHound Code](https://www.bithound.io/github/pushrocks/smartjspm/badges/code.svg)](https://www.bithound.io/github/pushrocks/smartjspm)
[![TypeScript](https://img.shields.io/badge/TypeScript-2.x-blue.svg)](https://nodejs.org/dist/latest-v6.x/docs/api/)
[![node](https://img.shields.io/badge/node->=%206.x.x-blue.svg)](https://nodejs.org/dist/latest-v6.x/docs/api/)
[![JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

## Usage
We recommend the use of TypeScript for best intellisense

```javascript
import * as smartjspm from 'smartjspm'

// Lets create an instance of Smartjspm
// targetDir is the final directory that serves your project to the web
// npmDevDir is your proejct dir to install any plugins for IDE use (important for TypeScript projects)
let myJspm = new smartjspm.Smartjspm({
    targetDir: 'some/path/to/the/final/directory',
    npmDevDir: 'the/base/of/your/project'
})

// lets read any dependencies from npmextra.json
// take a look at the npmextra.json example below
myJspm.readDependencies('./npmextra.json')

// install dependencies with npm into your dev directory
myJspm.installNpmDevDir()

// install dependencies with jspm into web root and create jspm.config.js for SystemJS
myJspm.installTargetDir()

// creates a single bundle.js for production use
myJspm.createBundle()

```

npmextra.json

```json
{
    "smartjspm": {
        "npm": {
            "@angular/common": "^2.0.1",
            "@angular/compiler": "^2.0.1",
            "@angular/core": "^2.0.1",
            "@angular/forms": "^2.0.1",
            "@angular/http": "^2.0.1",
            "@angular/platform-browser": "^2.0.1",
            "@angular/platform-browser-dynamic": "^2.0.1",
            "@angular/router": "^3.0.1",
            "@angular/upgrade": "^2.0.1",
            "lik": "^1.0.23",
            "q": "^1.4.1",
            "rxjs": "^5.0.0-beta.12"
        }
    }
}
```

[![npm](https://push.rocks/assets/repo-header.svg)](https://push.rocks)
