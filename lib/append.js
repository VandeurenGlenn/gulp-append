'use strict';
const fs = require('fs');
const {add, update} = require('./data-handler');

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
  var named = opts ? opts.named : false;
  if (typeof opts === 'function') {
    cb = opts;
  }
  data = getData(opts.destination, json);
  if (typeof data === 'string') {
    data += '\n' + String(file.contents).trim();
    data = data.trim();
  } else if (data instanceof Array) {
    if (data.length > 0) {
      for (let obj of data) {
        if (obj[transform.name(file)]) {
          obj[transform.name(file)] = update(file, {transform: transform, named: named}, obj[transform.name(file)]);
        } else {
          data.push(add(file, {transform: transform, named: named}));
        }
      }
    } else {
      data.push(add(file, {transform: transform, named: named}));
    }
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
  if (opts.destination.match(/\//) || opts.destination.match(/\\/)) {
    if (opts.destination.match(/.\//)) {
      opts.destination = opts.destination.replace(/.\//, '');
    }
    var a = opts.destination.replace(/\/(.*)$/g, '');
    var b = String(file.base) + a;
    try {
      fs.lstatSync(b);
    } catch (e) {
      fs.mkdir(b);
    }
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
