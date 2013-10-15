/*jshint browser:true, node:true*/
/*global define*/
(function() {
'use strict';

function factory(
  _
) {

var fail = legacyFail;
if (Error.captureStackTrace && Object.create) {
  // nice error class with stack traces based on test line
  fail = fancyFail;
}

// class to be used with fancyFail()
function AssertionError(actual, expected, phrase, base) {
  this.name = 'AssertionError';
  this.actual = actual;
  this.expected = expected;
  this.message = 'expected ' + objectDisplay(actual) + ' ' +
      phrase + ' ' +
    objectDisplay(expected);

  if (typeof actual === 'object' || typeof expected === 'object') {
    this.showDiff = true;
  }

  Error.captureStackTrace(this, base);
}

if (Object.create) {
  // attempt to inherit AssertionError from Error.
  try {
    AssertionError.prototype = Object.create(Error.prototype, {
      constructor: {
        value: AssertionError,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  } catch (e) {
    // ignore
  }
}

function formatMessage(actual, verbPhrase, expected, message) {
  var errorMessage = '';
  if (message) {
    errorMessage += message;
    errorMessage += '\n';
    errorMessage += '\n';
  }

  errorMessage += 'expected ';
  errorMessage += objectDisplay(actual);

  errorMessage += (verbPhrase ? ' '+verbPhrase : '')+': ';
  errorMessage += objectDisplay(expected);
  errorMessage += '\n';

  return errorMessage;
}

function legacyFail(actual, verbPhrase, expected, message) {
  var msg = formatMessage(actual, verbPhrase, expected, message);
  throw new Error(msg);
}

function fancyFail(actual, verbPhrase, expected, message, base) {
  throw new AssertionError(actual, expected, verbPhrase, base);
}

var assert = function(truthy, message) {
  if (!truthy) {
    fail(truthy, 'to be a', "Truthy value", message, assert);
  }
};


assert.fail = function(message) {
  fail('something happened', '', 'something else to happen', message,
       assert.fail);
};

assert.ok = assert;

assert.notOk = function(falsy, message) {
  if (falsy) {
    fail(falsy, 'to be a', 'Falsy value', message, assert.notOk);
  }
};

assert.ifError = assert.notOk;

assert.equal = function(actual, expected, message) {
  if (actual != expected) {
    fail(actual, 'to equal', expected, message, assert.equal);
  }
};

assert.notEqual = function(actual, expected, message) {
  if (actual == expected) {
    fail(actual, 'to not equal', expected, message, assert.notEqual);
  }
};

assert.strictEqual = function(actual, expected, message) {
  if (actual !== expected) {
    fail(actual, 'to strictly equal', expected, message, assert.strictEqual);
  }
};

assert.notStrictEqual = function(actual, expected, message) {
  if (actual === expected) {
    fail(actual, 'to not strictly equal', expected, message,
         assert.notStrictEqual);
  }
};

assert.deepEqual = function(actual, expected, message) {
  if (!_.isEqual(actual, expected)) {
    fail(actual, 'to deep equal', expected, message, assert.deepEqual);
  }
};

assert.notDeepEqual = function(actual, expected, message) {
  if (_.isEqual(actual, expected)) {
    fail(actual, 'to not deep equal', expected, message, assert.notDeepEqual);
  }
};

assert.isTrue = function(value, message) {
  if (value !== true) {
    fail(value, 'to be', true, message, assert.isTrue);
  }
};

assert.isFalse = function(value, message) {
  if (value !== false) {
    fail(value, 'to be', false, message, assert.isFalse);
  }
};

assert.isBoolean = function(value, message) {
  if (!_.isBoolean(value)) {
    fail(value, 'to be a', "Boolean", message, assert.isBoolean);
  }
};

assert.isNull = function(value, message) {
  if (!_.isNull(value)) {
    fail(value, 'to be', "Null", message, assert.isNull);
  }
};

assert.isNotNull = function(value, message) {
  if (_.isNull(value)) {
    fail(value, 'to be', "Not Null", message, assert.isNotNull);
  }
};

assert.isUndefined = function(value, message) {
  if (!_.isUndefined(value)) {
    fail(value, 'to be', "Undefined", message, assert.isUndefined);
  }
};

assert.isDefined = function(value, message) {
  if (_.isUndefined(value)) {
    fail(value, 'to be', "Defined", message, assert.isDefined);
  }
};

assert.isFunction = function(value, message) {
  if (!_.isFunction(value)) {
    fail(value, 'to be a', "Function", message, assert.isFunction);
  }
};

assert.isNotFunction = function(value, message) {
  if (_.isFunction(value)) {
    fail(value, 'to be a', "non-Function", message, assert.isNotFunction);
  }
};

assert.isObject = function(value, message) {
  if (typeof value !== 'object') {
    fail(value, 'to be an', "Object", message, assert.isObject);
  }
};

assert.isNotObject = function(value, message) {
  if (typeof value === 'object') {
    fail(value, 'to be a', "non-Object", message, assert.isNotObject);
  }
};

assert.isArray = function(value, message) {
  if (!_.isArray(value)) {
    fail(value, 'to be an', "Array", message, assert.isArray);
  }
};

assert.isNotArray = function(value, message) {
  if (_.isArray(value)) {
    fail(value, 'to be a', "non-Array", message, assert.isNotArray);
  }
};

assert.isString = function(value, message) {
  if (!_.isString(value)) {
    fail(value, 'to be a', "String", message, assert.isString);
  }
};

assert.isNotString = function(value, message) {
  if (_.isString(value)) {
    fail(value, 'to be a', "non-String", message, assert.isNotString);
  }
};

assert.isNumber = function(value, message) {
  if (!_.isNumber(value)) {
    fail(value, 'to be a', "Number", message, assert.isNumber);
  }
};

assert.isNotNumber = function(value, message) {
  if (_.isNumber(value)) {
    fail(value, 'to be a', "non-Number", message, assert.isNotNumber);
  }
};

assert.typeOf = function(value, type, message) {
  if (typeof value != type) {
    fail(value, 'type', type, message, assert.typeOf);
  }
};

assert.notTypeOf = function(value, type, message) {
  if (typeof value === type) {
    fail(value, 'to not be type', type, message, assert.notTypeOf);
  }
};

assert.instanceOf = function(value, constructor, message) {
  if (!(value instanceof constructor)) {
    fail(value, 'instanceof', constructor.name, message, assert.instanceOf);
  }
};

assert.notInstanceOf = function(value, constructor, message) {
  if (value instanceof constructor) {
    fail(value, "not instanceof", constructor.name, message,
         assert.notInstanceOf);
  }
};

assert.include = function(haystack, needle, message) {
  if (!_.include(haystack, needle)) {
    fail(haystack, "to include", needle, message, assert.include);
  }
};

assert.notInclude = function(haystack, needle, message) {
  if (_.include(haystack, needle)) {
    fail(haystack, "to not include", needle, message, assert.notInclude);
  }
};

assert.match = function(value, regexp, message) {
  if (!value.match(regexp)) {
    fail(value, 'to match', regexp, message, assert.match);
  }
};

assert.notMatch = function(value, regexp, message) {
  if (value.match(regexp)) {
    fail(value, 'to not match', regexp, message, assert.notMatch);
  }
};

assert.property = function(object, property, message) {
  if (!(property in object)) {
    fail(object, 'to have the property', property, message,
         assert.property);
  }
};

assert.notProperty = function(object, property, message) {
  if (property in object) {
    fail(object, 'to not have the property', property, message,
         assert.notProperty);
  }
};

assert.propertyVal = function(object, property, val, message) {
  if (object == null) {
    fail(object, 'to not be null with property "'+property+'" equal',
         val, message, assert.propertyVal);
  }

  if (object[property] != val) {
    fail(object[property], '', val, message, assert.propertyVal);
  }
};

assert.propertyNotVal = function(object, property, val, message) {
  if (object == null) {
    fail(object, 'to not be null with property "'+property+'" not equal',
         val, message, assert.propertyNotVal);
  }

  if (object[property] == val) {
    fail(object[property], 'not to be', val, message, assert.propertyNotVal);
  }
};

assert.lengthOf = function(object, length, message) {
  if (object.length !== length) {
    fail(object.length, 'to have length', length, message, assert.lengthOf);
  }
};

assert.exception = function(fn, expect) {
  if (expect !== undefined &&
      !_.isString(expect) &&
      !_.isRegExp(expect) &&
      !_.isFunction(expect)) {
    throw new TypeError('assert.exception needs string, regexp or function '+
                        'as second argument');
  }

  var errOccurred = false;
  try {
    fn();

  } catch(err) {
    errOccurred = true;

    if (_.isString(expect)) {
      if (err.message != expect) {
        fail(err.message, 'to have message', expect, null,
             assert.exception);
      }
    } else if (_.isRegExp(expect)) {
      if (!err.message.match(expect)) {
        fail(err.message, 'to match', expect, null,
             assert.exception);
      }
    } else if (_.isFunction(expect)) {
      if (!(err instanceof expect)) {
        fail(err.message, 'instanceof', expect.name, null,
             assert.exception);
      }
    } // else undefined
  }

  if (!errOccurred) {
    fail('No error thrown \n' + fn.toString(), '', 'Error thrown',
         null, assert.exception);
  }
};

assert.noException = function(fn, message) {
  try {
    fn();
  } catch(err) {
    fail('Error thrown \n' + err.message + '\n' + err.stack, '',
         'No Error thrown', message, assert.noException);
  }
};

assert.operator = function(val1, operator, val2, message) {
  /*jshint evil:true */
  var result;
  // XXX: validate against valid binary operators
  eval('result = (val1 '+operator+' val2)');
  if (!result) {
    fail(val1, 'to '+operator, val2, message, assert.operator);
  }
};

assert.closeTo = function(actual, expected, delta, message) {
  var difference = Math.abs(expected - actual);
  if (difference > delta) {
    fail(actual, 'to be within +/- ' + delta + ' of', expected,
         message, assert.closeTo);
  }
};

assert.sameMembers = function(set1, set2, message) {
  var oneFromTwo = _.difference(set1, set2);
  if (oneFromTwo.length) {
    fail(
      '[' + oneFromTwo.join(', ') + '] found in set1 and not set2',
      '',
      'No differences',
      message,
      assert.sameMembers
    );
  }
  var twoFromOne = _.difference(set2, set1);
  if (twoFromOne.length) {
    fail(
      '[' + twoFromOne.join(', ') + '] found in set2 and not set1',
      '',
      'No differences',
      message,
      assert.sameMembers
    );
  }
};

assert.includeMembers = function(superset, subset, message) {
  var difference = _.difference(subset, superset);
  if (difference.length) {
    fail(
      '[ ' + difference.join(', ') + ' ] found in subset and not superset',
      '',
      'No differences',
      message,
      assert.includeMembers
    );
  }
};

/*!
 * Chai
 * Copyright(c) 2012-2013 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

var objectDisplay = function (obj) {
  var str = inspect(obj);
  var type = Object.prototype.toString.call(obj);

  if (str.length >= 40) {
    if (type === '[object Function]') {
      return !obj.name || obj.name === '' ? '[Function]'
        : '[Function: ' + obj.name + ']';
    } else if (type === '[object Array]') {
      return '[ Array(' + obj.length + ') ]';
    } else if (type === '[object Object]') {
      var keys = Object.keys(obj);
      var kstr = keys.length > 2 ? keys.splice(0, 2).join(', ') + ', ...'
          : keys.join(', ');
      return '{ Object (' + kstr + ') }';
    } else {
      return str;
    }
  } else {
    return str;
  }
};

function inspect(obj, showHidden, depth) {
  var ctx = {
    showHidden: showHidden,
    seen: [],
    stylize: function (str) { return str; }
  };
  return formatValue(ctx, obj, (typeof depth === 'undefined' ? 2 : depth));
}

// https://gist.github.com/1044128/
var getOuterHTML = function(element) {
  if ('outerHTML' in element) return element.outerHTML;
  var ns = "http://www.w3.org/1999/xhtml";
  var container = document.createElementNS(ns, '_');
  var xmlSerializer = new XMLSerializer();
  var html;
  if (document.xmlVersion) {
    return xmlSerializer.serializeToString(element);
  } else {
    container.appendChild(element.cloneNode(false));
    html = container.innerHTML.replace('><', '>' + element.innerHTML + '<');
    container.innerHTML = '';
    return html;
  }
};

// Returns true if object is a DOM element.
var isDOMElement = function (object) {
  if (typeof HTMLElement === 'object') {
    return object instanceof HTMLElement;
  } else {
    return object &&
      typeof object === 'object' &&
      object.nodeType === 1 &&
      typeof object.nodeName === 'string';
  }
};

function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (value && typeof value.inspect === 'function' &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes);
    if (typeof ret !== 'string') {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // If it's DOM elem, get outer HTML.
  if (isDOMElement(value)) {
    return getOuterHTML(value);
  }

  // Look up the keys of the object.
  var visibleKeys = getEnumerableProperties(value);
  var keys = ctx.showHidden ? getProperties(value) : visibleKeys;

  var name;
  var nameSuffix;

  // Some type of object without properties can be shortcutted.
  // In IE, errors have a single `stack` property,
  // or if they are vanilla `Error`,
  // a `stack` plus `description` property; ignore those for consistency.
  if (keys.length === 0 || (isError(value) && (
      (keys.length === 1 && keys[0] === 'stack') ||
      (keys.length === 2 && keys[0] === 'description' && keys[1] === 'stack')
     ))) {
    if (typeof value === 'function') {
      name = getName(value);
      nameSuffix = name ? ': ' + name : '';
      return ctx.stylize('[Function' + nameSuffix + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toUTCString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (typeof value === 'function') {
    name = getName(value);
    nameSuffix = name ? ': ' + name : '';
    base = ' [Function' + nameSuffix + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    return formatError(value);
  }

  if (keys.length === 0 && (!array || value.length === 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {

    output = _.map(keys, function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  switch (typeof value) {
    case 'undefined':
      return ctx.stylize('undefined', 'undefined');

    case 'string':
      var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                               .replace(/'/g, "\\'")
                                               .replace(/\\"/g, '"') + '\'';
      return ctx.stylize(simple, 'string');

    case 'number':
      return ctx.stylize('' + value, 'number');

    case 'boolean':
      return ctx.stylize('' + value, 'boolean');
  }
  // For some reason typeof null is "object", so special case here.
  if (value === null) {
    return ctx.stylize('null', 'null');
  }
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (Object.prototype.hasOwnProperty.call(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  _.each(keys, function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str;
  if (value.__lookupGetter__) {
    if (value.__lookupGetter__(key)) {
      if (value.__lookupSetter__(key)) {
        str = ctx.stylize('[Getter/Setter]', 'special');
      } else {
        str = ctx.stylize('[Getter]', 'special');
      }
    } else {
      if (value.__lookupSetter__(key)) {
        str = ctx.stylize('[Setter]', 'special');
      }
    }
  }
  if (_.indexOf(visibleKeys, key) < 0) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (_.indexOf(ctx.seen, value[key]) < 0) {
      if (recurseTimes === null) {
        str = formatValue(ctx, value[key], null);
      } else {
        str = formatValue(ctx, value[key], recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return ' ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return ' ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (typeof name === 'undefined') {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = _.reduce(output, function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}

function isArray(ar) {
  return _.isArray(ar);
}

function isRegExp(re) {
  return typeof re === 'object' && objectToString(re) === '[object RegExp]';
}

function isDate(d) {
  return typeof d === 'object' && objectToString(d) === '[object Date]';
}

function isError(e) {
  return typeof e === 'object' && objectToString(e) === '[object Error]';
}

function objectToString(o) {
  return Object.prototype.toString.call(o);
}

var getProperties = function(subject) {
  var result = Object.getOwnPropertyNames(subject);

  function addProperty(property) {
    if (_.indexOf(result, property) === -1) {
      result.push(property);
    }
  }

  var proto = Object.getPrototypeOf(subject);
  while (proto !== null) {
    _.each(Object.getOwnPropertyNames(proto), addProperty);
    proto = Object.getPrototypeOf(proto);
  }

  return result;
};

var getName = function (func) {
  if (func.name) return func.name;

  var match = /^\s?function ([^(]*)\(/.exec(func);
  return match && match[1] ? match[1] : "";
};

var getEnumerableProperties = function(object) {
  var result = [];
  for (var name in object) {
    result.push(name);
  }
  return result;
};

return assert;

}

if (typeof define == 'function' && typeof define.amd == 'object' &&
    define.amd) {

  // Browser AMD
  define(['lodash'], function(_) {
    return factory(_);
  });

} else if (typeof exports === 'object' && !exports.nodeType) {
  // Node
  var assert = factory(
    require('lodash')
  );

  module.exports = assert;

} else {
  // Browser
  window.assert = factory(
    window._
  );
}

})();
