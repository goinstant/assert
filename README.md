# Assert

[![Build Status](https://travis-ci.org/goinstant/assert.png?branch=master)](https://travis-ci.org/goinstant/assert)
[![Coverage Status](https://coveralls.io/repos/goinstant/assert/badge.png)](https://coveralls.io/r/goinstant/assert)

A last-resort, legacy browser and node compatible, assert library.

Implements all of Chai.js Assert functions except for `.deepProperty` and the
deepProperty-related functions.

`assert.throws` has been renamed to `assert.exception` and `assert.noException`.

`assert.ifError` is included as an alias of `notOk` for expressively testing for
the non-presence of errors.

http://chaijs.com/api/assert/
