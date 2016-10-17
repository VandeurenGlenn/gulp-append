'use strict';

var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();





var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();







var get = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

















var set = function set(object, property, value, receiver) {
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent !== null) {
      set(parent, property, value, receiver);
    }
  } else if ("value" in desc && desc.writable) {
    desc.value = value;
  } else {
    var setter = desc.set;

    if (setter !== undefined) {
      setter.call(receiver, value);
    }
  }

  return value;
};

var DataHandler = function () {
  function DataHandler() {
    classCallCheck(this, DataHandler);
  }

  createClass(DataHandler, [{
    key: '_getJSON',
    value: function _getJSON(dest) {
      try {
        return JSON.parse(fs.readFileSync(dest));
      } catch (e) {
        return [];
      }
    }
  }, {
    key: '_getString',
    value: function _getString(dest) {
      try {
        return String(fs.readFileSync(dest));
      } catch (e) {
        return String();
      }
    }
  }, {
    key: 'getData',
    value: function getData(dest, json) {
      if (json) {
        return this._getJSON(dest);
      } else {
        return this._getString(dest);
      }
    }
  }, {
    key: 'setup',
    value: function setup(file, json, opts) {
      var _this = this;

      return new Promise(function (resolve, reject) {
        var data;
        var item = {};
        var transform = opts ? opts.transform : false;
        if (typeof opts === 'function') {
          cb = opts;
        }
        data = _this.getData(opts.destination, json);
        if (typeof data === 'string') {
          data += '\n' + String(file.contents).trim();
          data = data.trim();
        } else if (data instanceof Array) {
          data.push(_this.add(file, opts));
        }
        resolve(data);
      });
    }
  }, {
    key: 'transformItem',
    value: function transformItem(file, transform, item) {
      var update = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
      var named = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

      var contents = transform.contents ? transform.contents(file) : 'contents';
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = Object.keys(transform)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var key = _step.value;

          if (update) {
            if (key !== 'name' && contents === 'contents') {
              item[key] = transform[key](file);
            } else if (contents !== 'contents' && key !== 'contents' && key !== 'name') {
              item[key] = transform[key](file);
            }
          } else {
            if (key === 'name' && named) {
              item[transform[key](file)] = {};
            } else if (!named) {
              item[key] = transform[key](file);
            }
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return item;
    }
  }, {
    key: 'add',
    value: function add(file, opts, item) {
      // TODO: Create ids when named is true & use those as name when transform.name = undefined.
      item = item || {};
      if (opts.transform) {
        var transform = opts.transform;
        var contents = transform.contents ? transform.contents(file) : 'contents';
        if (transform.name) {
          var name = transform.name(file) || 'name';
        }
        item = this.transfromItem(file, transform, item, false, opts.named);
        if (!opts.named) {
          item[contents] = String(file.contents).trim();
        } else if (opts.named) {
          item[name][contents] = String(file.contents).trim();
        }
        return item;
      } else if (!opts.named) {
        return String(file.contents).trim();
      } else if (opts.named) {
        return item[name] = String(file.contents).trim();
      }
    }
  }, {
    key: 'update',
    value: function update(file, opts, item) {
      item = item || {};
      var name = 'name';
      var transform = opts.transform;
      if (transform) {
        var contents = transform.contents ? transform.contents(file) : 'contents';
        item = this.transfromItem(file, transform, item, true);
        item[contents] = String(file.contents).trim();
      } else {
        item.contents = String(file.contents).trim();
      }
      return item;
    }
  }]);
  return DataHandler;
}();

var dataHandler = new DataHandler();
var fs$1 = require('fs');

/**
 * @module gulp-append
 *
 * @arg {object} opts {json: Boolean, transform: {name: function}}
 */
var append = (function (file, opts, cb) {
  var json = false;
  if (opts && opts.json || opts.destination.includes('.json')) {
    json = opts.json || opts.destination.includes('.json');
  }
  if (opts.destination.match(/\//) || opts.destination.match(/\\/)) {
    var a = opts.destination.replace(/\/(.*)$/g, '');
    try {
      fs$1.lstatSync(a);
    } catch (e) {
      fs$1.mkdir(file.cwd + '/' + a);
    }
  }
  dataHandler.setup(file, json, opts).then(function (data) {
    if (json) {
      fs$1.writeFileSync(opts.destination, JSON.stringify(data, null, 2));
    } else {
      fs$1.writeFileSync(opts.destination, data);
    }
    return cb(null, data);
  });
});

var gutil = require('gulp-util');
var through = require('through2');
module.exports = function (destination, opts) {
	if (!destination) {
		destination = 'appended.json';
	}
	opts = opts || {};
	opts.destination = destination;

	return through.obj(function (file, enc, cb) {
		if (file.isNull()) {
			// return empty file
			return cb(null, file);
		}

		if (file.isStream()) {
			cb(new gutil.PluginError('gulp-append', 'Streaming not supported'));
			return;
		}

		try {
			return append(file, opts, cb);
		} catch (err) {
			this.emit('error', new gutil.PluginError('gulp-append', err));
		}

		return cb();
	});
};
