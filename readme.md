# now-cli-releases

[![Build Status](https://travis-ci.org/zeit/now-cli-latest.svg?branch=master)](https://travis-ci.org/zeit/now-cli-latest)
[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)
[![Slack Channel](http://zeit-slackin.now.sh/badge.svg)](https://zeit.chat)

Microservice for caching and exposing the [latest stable and canary release of Now CLI](https://github.com/zeit/now-cli/releases/latest). It's being used inside of [Now Desktop](https://github.com/zeit/now-desktop) to get the latest version of the CLI in the tutorial and for auto updates (+ on the homepage).

## Usage

Simply install the dependencies:

```bash
npm install
```

And run the server:

```bash
npm run dev
```

## Contributing

1. [Fork](https://help.github.com/articles/fork-a-repo/) this repository to your own GitHub account and then [clone](https://help.github.com/articles/cloning-a-repository/) it to your local device
2. Follow the [usage section](#usage)
3. Start making changes and open a pull request once they're ready!

You can use `npm test` to run the tests and see if your changes have broken anything.

## Authors

- Leo Lamprecht ([@notquiteleo](https://twitter.com/notquiteleo)) - [▲ZEIT](https://zeit.co)
- Guillermo Rauch ([@rauchg](https://twitter.com/rauchg)) - [▲ZEIT](https://zeit.co)
