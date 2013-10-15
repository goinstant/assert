/*jshint node: true, browser: true*/
/*global describe, it*/

(function() {
'use strict';

var assert;
var _;

if (typeof module !== 'undefined' && module.exports) {
  assert = require('../index.js');
  _ = require('lodash');
} else {
  assert = window.assert;
  _ = window._;
}

describe('assert', function() {
  var FALSY_VALUES = [
    false, 0, "", null, undefined
  ];

  var TRUTHY_VALUES = [
    true, 1, "sdsadsa", {}, []
  ];

  it('is a function', function() {
    assert(true);
  });

  it('fails for falsy functions', function() {
    var errored = false;
    try {
      assert(false);
    } catch (err) {
      errored = true;
    }

    if (!errored) {
      throw new Error('Did not error');
    }
  });

  describe('#exception', function() {

    function OtherError(message) {
      this.message = message;
    }

    function exceptionTest(fn, arg) {
      var errored = false;
      try {
        assert.exception(fn, arg);
      } catch(err) {
        errored = true;
      }
      assert(errored);
    }

    var ARG_TYPES = {
      'no': undefined,
      'a string': 'exception',
      'a regex': /exce.*/,
      'an Error class': Error
    };

    _.each(ARG_TYPES, function(arg, argType) {
      describe('with ' + argType + ' argument', function() {
        it('captures exceptions', function() {
          assert.exception(function() {
            throw new Error('exception');
          }, arg);
        });

        // no arg type matches all throws
        if (arg) {
          it('throws on the wrong exception', function() {
            exceptionTest(function() {
              throw new OtherError('will not match');
            }, arg);
          });
        }

        it('throws if no exception occurs', function() {
          exceptionTest(function() {
          }, arg);
        });
      });
    });

    it('errors if a bad argument type is passed', function() {
      exceptionTest(function() {
        throw new Error('I am an error');
      }, 123);
    });
  });

  describe('#noException', function() {
    it('executes without error when no error occurs', function() {
      assert.noException(function() {
      });
    });

    it('throws if an error does occur', function() {
      var errored = false;
      try {
        assert.noException(function() {
          throw new Error('exception');
        });

      } catch(err) {
        errored = true;
      }

      assert(errored);
    });
  });

  describe('#ok', function() {
    it('fails on falsiness', function() {
      _.each(FALSY_VALUES, function(v) {
        assert.exception(function() {
          assert.ok(v);
        });
      });
    });

    it('passes on truthiness', function() {
      _.each(TRUTHY_VALUES, function(v) {
        assert.ok(v);
      });
    });
  });

  describe('#notOk', function() {
    it('fails on truthiness', function() {
      _.each(TRUTHY_VALUES, function(v) {
        assert.exception(function() {
          assert.notOk(v);
        });
      });
    });

    it('passes on falsiness', function() {
      _.each(FALSY_VALUES, function(v) {
        assert.notOk(v);
      });
    });
  });

  describe('#equal', function() {
    it('fails on inequality', function() {
      assert.exception(function() {
        assert.equal(1, 2);
      });

      assert.exception(function() {
        assert.equal("woo", "hoo");
      });

      assert.exception(function() {
        assert.equal({}, {});
      });

      assert.exception(function() {
        assert.equal([], []);
      });
    });

    it('plays it loose with types', function() {
      assert.equal('1', 1);
      assert.equal(1, '1');
      assert.equal(0, '');
    });

    it('passes on equality', function() {
      assert.equal(1, 1);

      assert.equal("woo", "woo");

      var obj = {};
      assert.equal(obj, obj);
    });
  });

  describe('#notEqual', function() {
    it('fails on equality', function() {
      assert.exception(function() {
        assert.notEqual(1, 1);
      });

      assert.exception(function() {
        assert.notEqual("woo", "woo");
      });
    });

    it('plays it loose with types', function() {
      assert.exception(function() {
        assert.notEqual('1', 1);
      });
    });

    it('passes on inequality', function() {
      assert.notEqual(1, 2);

      assert.notEqual("woo", "hoo");

      assert.notEqual({}, {});
    });
  });

  describe('#strictEqual', function() {
    it('fails on inequality', function() {
      assert.exception(function() {
        assert.strictEqual(1, 2);
      });

      assert.exception(function() {
        assert.strictEqual("woo", "hoo");
      });

      assert.exception(function() {
        assert.strictEqual({}, {});
      });

      assert.exception(function() {
        assert.strictEqual([], []);
      });

      assert.exception(function() {
        assert.strictEqual('1', 1);
      });

      assert.exception(function() {
        assert.strictEqual(0, '');
      });
    });

    it('passes on equality', function() {
      assert.strictEqual(1, 1);

      assert.strictEqual("woo", "woo");

      var obj = {};
      assert.strictEqual(obj, obj);
    });
  });

  describe('#ifError', function() {
    it('is an alias of notOk', function() {
      assert.strictEqual(assert.ifError, assert.notOk);
    });
  });

  describe('#notStrictEqual', function() {
    it('fails on equality', function() {
      assert.exception(function() {
        assert.notStrictEqual(1, 1);
      });

      assert.exception(function() {
        assert.notStrictEqual("woo", "woo");
      });
    });

    it('passes on inequality', function() {
      assert.notStrictEqual(1, 2);

      assert.notStrictEqual("woo", "hoo");

      assert.notStrictEqual({}, {});

      assert.notStrictEqual(1, '1');
    });
  });

  describe('#deepEqual', function() {
    it('passes on deep equality', function() {
      var a = {
        foo: 'bar'
      };
      var b = {
        foo: 'bar'
      };
      assert.deepEqual(a, b);
    });

    it('fails on deep inequality', function() {
      var a = {
        foo: 'bar',
        bar: 'foo'
      };
      var b = {
        foo: 'bar',
        baz: 'bar'
      };

      assert.exception(function() {
        assert.deepEqual(a, b);
      });
    });
  });

  describe('#notDeepEqual', function() {
    it('fails on deep equality', function() {
      var a = {
        foo: 'bar'
      };
      var b = {
        foo: 'bar'
      };

      assert.exception(function() {
        assert.notDeepEqual(a, b);
      });
    });

    it('passes on deep inequality', function() {
      var a = {
        foo: 'bar',
        bar: 'foo'
      };
      var b = {
        foo: 'bar',
        baz: 'bar'
      };

      assert.notDeepEqual(a, b);
    });
  });

  describe('#isBoolean', function() {
    it('passes on booleans', function() {
      assert.isBoolean(true);
      assert.isBoolean(false);
    });
    it('fails on non-booleans', function() {
      assert.exception(function() {
        assert.isBoolean(1);
      });
      assert.exception(function() {
        assert.isBoolean(0);
      });
    });
  });

  describe('#isTrue', function() {
    it('passes on true', function() {
      assert.isTrue(true);
    });
    it('fails on not true', function() {
      assert.exception(function() {
        assert.isTrue(1);
      });
      assert.exception(function() {
        assert.isTrue(false);
      });
    });
  });

  describe('#isFalse', function() {
    it('passes on false', function() {
      assert.isFalse(false);
    });
    it('fails on not false', function() {
      assert.exception(function() {
        assert.isFalse(0);
      });
      assert.exception(function() {
        assert.isFalse(true);
      });
    });
  });

  describe('#isNull', function() {
    it('passes on null', function() {
      assert.isNull(null);
    });
    it('fails on not null', function() {
      assert.exception(function() {
        assert.isNull(0);
      });
      assert.exception(function() {
        assert.isNull(false);
      });
    });
  });

  describe('#isNotNull', function() {
    it('passes on not null', function() {
      assert.isNotNull(true);
      assert.isNotNull(false);
      assert.isNotNull(0);
      assert.isNotNull(1);
    });

    it('fails on null', function() {
      assert.exception(function() {
        assert.isNotNull(null);
      });
    });
  });

  describe('#isUndefined', function() {
    it('passes on undefined', function() {
      assert.isUndefined(undefined);
    });
    it('fails on not undefined', function() {
      assert.exception(function() {
        assert.isUndefined(0);
      });
      assert.exception(function() {
        assert.isUndefined(false);
      });
    });
  });

  describe('#isDefined', function() {
    it('passes on not undefined', function() {
      assert.isDefined(true);
      assert.isDefined(false);
      assert.isDefined(0);
      assert.isDefined(1);
    });

    it('fails on undefined', function() {
      assert.exception(function() {
        assert.isDefined(undefined);
      });
    });
  });

  describe('#isUndefined', function() {
    it('passes on undefined', function() {
      assert.isUndefined(undefined);
    });
    it('fails on not undefined', function() {
      assert.exception(function() {
        assert.isUndefined(0);
      });
      assert.exception(function() {
        assert.isUndefined(false);
      });
    });
  });

  describe('#isFunction', function() {
    it('passes on function', function() {
      assert.isFunction(function(){});
    });
    it('fails on not function', function() {
      assert.exception(function() {
        assert.isFunction(0);
      });
      assert.exception(function() {
        assert.isFunction(false);
      });
    });
  });

  describe('#isNotFunction', function() {
    it('passes on not function', function() {
      assert.isNotFunction(true);
      assert.isNotFunction(false);
      assert.isNotFunction(0);
      assert.isNotFunction(1);
    });

    it('fails on function', function() {
      assert.exception(function() {
        assert.isNotFunction(function(){});
      });
    });
  });

  describe('#isObject', function() {
    it('passes on {}', function() {
      assert.isObject({});
    });
    it('fails on not {}', function() {
      assert.exception(function() {
        assert.isObject(0);
      });
      assert.exception(function() {
        assert.isObject(false);
      });
    });
    it('passes on custom objects', function() {
      function Custom() {}
      var myObj = new Custom();
      assert.isObject(myObj);
    });
  });

  describe('#isNotObject', function() {
    it('passes on not {}', function() {
      assert.isNotObject(true);
      assert.isNotObject(false);
      assert.isNotObject(0);
      assert.isNotObject(1);
    });

    it('fails on {}', function() {
      assert.exception(function() {
        assert.isNotObject({});
      });
    });

    it('fails on custom objects', function() {
      assert.exception(function() {
        function Custom() {}
        var myObj = new Custom();
        assert.isNotObject(myObj);
      });
    });
  });

  describe('#isArray', function() {
    it('passes on []', function() {
      assert.isArray([]);
    });
    it('fails on not []', function() {
      assert.exception(function() {
        assert.isArray(0);
      });
      assert.exception(function() {
        assert.isArray(false);
      });
    });
  });

  describe('#isNotArray', function() {
    it('passes on not []', function() {
      assert.isNotArray(true);
      assert.isNotArray(false);
      assert.isNotArray(0);
      assert.isNotArray(1);
    });

    it('fails on []', function() {
      assert.exception(function() {
        assert.isNotArray([]);
      });
    });
  });


  describe('#isString', function() {
    it('passes on ""', function() {
      assert.isString("");
    });
    it('fails on not ""', function() {
      assert.exception(function() {
        assert.isString(0);
      });
      assert.exception(function() {
        assert.isString(false);
      });
    });
  });

  describe('#isNotString', function() {
    it('passes on not ""', function() {
      assert.isNotString(true);
      assert.isNotString(false);
      assert.isNotString(0);
      assert.isNotString(1);
    });

    it('fails on ""', function() {
      assert.exception(function() {
        assert.isNotString("");
      });
    });
  });

  describe('#isNumber', function() {
    it('passes on 12345', function() {
      assert.isNumber(12345);
    });
    it('fails on not 12345', function() {
      assert.exception(function() {
        assert.isNumber(false);
      });
    });
  });

  describe('#isNotNumber', function() {
    it('passes on not 12345', function() {
      assert.isNotNumber(true);
      assert.isNotNumber(false);
    });

    it('fails on 12345', function() {
      assert.exception(function() {
        assert.isNotNumber(12345);
      });
    });
  });

  describe('#typeOf', function() {
    it('passes on type', function() {
      assert.typeOf(12345, 'number');
    });
    it('fails on not type', function() {
      assert.exception(function() {
        assert.typeOf(false, 'number');
      });
    });
  });

  describe('#notTypeOf', function() {
    it('passes on not type', function() {
      assert.notTypeOf(false, 'number');
    });
    it('fails on type', function() {
      assert.exception(function() {
        assert.notTypeOf(12345, 'number');
      });
    });
  });

  describe('#instanceOf', function() {
    it('passes on instance', function() {
      assert.instanceOf([], Array);
    });
    it('fails on not instance', function() {
      assert.exception(function() {
        assert.instanceOf({}, Function);
      });
    });
  });

  describe('#notInstanceOf', function() {
    it('passes on not instance', function() {
      assert.notInstanceOf(false, Number);
    });
    it('fails on instance', function() {
      assert.exception(function() {
        assert.notInstanceOf([], Array);
      });
    });
  });

  describe('#include', function() {
    it('passes on include', function() {
      assert.include([1,2,3], 1);
    });
    it('fails on not include', function() {
      assert.exception(function() {
        assert.include([1,2,3], 'woopdidoo');
      });
    });
  });

  describe('#notInclude', function() {
    it('passes on not include', function() {
      assert.notInclude([1,2,3], 'swowewko');
    });
    it('fails on include', function() {
      assert.exception(function() {
        assert.notInclude([1,2,3], 2);
      });
    });
  });

  describe('#match', function() {
    it('passes on match', function() {
      assert.match('woo', /o/);
    });
    it('fails on not match', function() {
      assert.exception(function() {
        assert.match('woo', /c/);
      });
    });
  });

  describe('#notMatch', function() {
    it('passes on not match', function() {
      assert.notMatch('woo', /c/);
    });
    it('fails on match', function() {
      assert.exception(function() {
        assert.notMatch('woo', /o/);
      });
    });
  });

  describe('#property', function() {
    it('passes on property', function() {
      assert.property({ a: 'b' }, 'a');
    });
    it('fails on no property', function() {
      assert.exception(function() {
        assert.property({ b: 'c' }, 'a');
      });
    });
  });

  describe('#notProperty', function() {
    it('passes on not property', function() {
      assert.notProperty({ a: 'b' }, 'c');
    });

    it('fails on property', function() {
      assert.exception(function() {
        assert.notProperty({ b: 'c' }, 'b');
      });
    });
  });

  describe('#propertyVal', function() {
    it('passes on property', function() {
      assert.propertyVal({ a: 'b' }, 'a', 'b');
    });
    it('fails on not property value', function() {
      assert.exception(function() {
        assert.propertyVal({ b: 'c' }, 'b', 'd');
      });
    });
  });

  describe('#notPropertyVal', function() {
    it('passes on not property value', function() {
      assert.propertyNotVal({ a: 'b' }, 'a', 'd');
      assert.propertyNotVal({ a: 'b' }, 'c', 'd');
    });

    it('fails on property value', function() {
      assert.exception(function() {
        assert.propertyNotVal({ b: 'c' }, 'b', 'c');
      });
    });
  });

  describe('#lengthOf', function() {
    it('passes on equal length', function() {
      assert.lengthOf([1, 2, 3], 3);
    });

    it('fails on non-equal length', function() {
      assert.exception(function() {
        assert.lengthOf([1, 2, 3], 7);
      });
    });
  });

  describe('#operator', function() {
    it('works for less than', function() {
      assert.operator(3, '<', 4);

      assert.exception(function() {
        assert.operator(4, '<', 3);
      });
    });

    it('works for greater than', function() {
      assert.operator(4, '>', 3);

      assert.exception(function() {
        assert.operator(3, '>', 4);
      });
    });

    it('works for less than or equal', function() {
      assert.operator(3, '<=', 4);

      assert.exception(function() {
        assert.operator(4, '<=', 3);
      });
    });

    it('works for greater than or equal', function() {
      assert.operator(4, '>=', 3);
      assert.operator(3, '>=', 3);

      assert.exception(function() {
        assert.operator(3, '>=', 4);
        assert.operator(2, '>=', 3);
      });
    });
  });

  describe('#closeTo', function() {
    it('detects when something is close', function() {
      assert.closeTo(3, 4, 1);
    });
    it('detects when something is far', function() {
      assert.exception(function() {
        assert.closeTo(3, 10, 1);
      });
    });
  });

  describe('#sameMembers', function() {
    it('runs without fail when correct', function() {
      assert.sameMembers([1,2,3], [3,2,1]);
    });

    it('fails when incorrect', function() {
      assert.exception(function() {
        assert.sameMembers([1,2,3,4], [3,2,1]);
      });
      assert.exception(function() {
        assert.sameMembers([1,2,3], [3,2,1,4]);
      });
    });
  });

  describe('#includeMembers', function() {
    it('runs without fail when correct', function() {
      assert.includeMembers([1,2,3,4,5,6], [3,2,1]);
    });

    it('fails when incorrect', function() {
      assert.exception(function() {
        assert.includeMembers([3,2,1], [1,2,3,4]);
      });
    });
  });
});

})();
