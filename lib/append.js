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

function contentsExists(file, data, transform) {
  return data[transform ? transform(file) : 'contents'].includes(file.contents.toString());
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
    let transformsContents = transform.contents || false;
    if (data.length > 0) {
      for (let obj of data) {

        for (let key of Object.keys(obj)) {
          console.log(contentsExists(file, obj[key], transformsContents));
          if (contentsExists(file, obj[key], transformsContents)) {
            console.log('update');
            // obj[transform.name(file)] = update(file, opts, obj[transform.name(file)]);
          } else if (!contentsExists(file, obj[key], transformsContents)){
            console.log('add');
            data.push(add(file, opts));
          }
        }

      }
    } else {
      data.push(add(file, opts));
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
    return cb(null, data);
  });
};
