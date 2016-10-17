'use strict';
import DataHandler from './data-handler';
const dataHandler = new DataHandler();
const fs = require('fs');

/**
 * @module gulp-append
 *
 * @arg {object} opts {json: Boolean, transform: {name: function}}
 */
export default (file, opts, cb) => {
  var json = false;
  if (opts && opts.json || opts.destination.includes('.json')) {
     json = opts.json || opts.destination.includes('.json');
  }
  if (opts.destination.match(/\//) || opts.destination.match(/\\/)) {
    var a = opts.destination.replace(/\/(.*)$/g, '');
    try {
      fs.lstatSync(a);
    } catch (e) {
      fs.mkdir(`${file.cwd}/${a}`);
    }
  }
  dataHandler.setup(file, json, opts).then(data => {
    if (json) {
      fs.writeFileSync(opts.destination, JSON.stringify(data, null, 2));
    } else {
      fs.writeFileSync(opts.destination, data);
    }
    return cb(null, data);
  });
};
