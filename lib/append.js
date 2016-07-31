'use strict';
var fs = require('fs');

function setupItem(file, transform) {
  var item = {};
  if (transform) {
    for (var opt of Object.keys(transform)) {
      item[opt] = transform[opt](file);
    }
    item.contents = String(file.contents).trim();
    return item;
  } else {
    return String(file.contents).trim();
  }
}

function unBuffer(buf) {
 return buf
}

function _getJSON(dest) {
  try {
    return JSON.parse(fs.readFileSync(dest));
  } catch (e) {
    return [];
  }
}

function _getString(dest) {
  try {
    return String(fs.readFileSync(dest));
  } catch (e) {
    return String();
  }
}

function getData(dest, json) {
  if (json) {
    return _getJSON(dest);
  } else {
    return _getString(dest)
  }
}

function setupData(file, json, opts, cb) {
  var data;
  var item = {};
  var transform = opts ? opts.transform : false;
  if (typeof opts === 'function') {
    cb = opts;
  }
  data = getData(opts.destination, json);
  if (typeof data === 'string') {
    data += '\n' + String(file.contents).trim();
    data = data.trim();
  } else if (data instanceof Array) {
    data.push(setupItem(file, transform));
  }
  return cb(data);
}
/**
 * @module gulp-append
 *
 * @arg {object} opts {json: Boolean, transform: {name: function}}
 */
module.exports = function(file, opts, cb) {
  var json = false;
  if (opts && opts.json || opts.destination.includes('.json')) {
     json = opts.json || opts.destination.includes('.json');
  }
  setupData(file, json, opts, function(data) {
    if (json) {
      fs.writeFileSync(opts.destination, JSON.stringify(data, null, 2));
    } else {
      fs.writeFileSync(opts.destination, data);
    }
    cb(null, data);
  });
};
