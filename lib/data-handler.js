'use strict';
const transformItem = require('./transform-item');

class DataHandler {

  add(file, opts, item) {
    // TODO: Create ids when named is true & use those as name when transform.name = undefined.
    item = item || {};
    if (opts.transform) {
      var transform = opts.transform;
      var contents = transform.contents ? transform.contents(file) : 'contents';
      if (transform.name) {
        var name = transform.name(file) || 'name';
      }
      item = transfromItem(file, transform, item, false, opts.named);
      if (!opts.named) {
        item[contents] = String(file.contents).trim();
      } else if (opts.named) {
        item[name][contents] = String(file.contents).trim();
      }
      return item;
    } else if(!opts.named) {
      return String(file.contents).trim();
    } else if (opts.named) {
      return item[name] = String(file.contents).trim();
    }
  }

  update(file, opts, item) {
    item = item || {};
    var name = 'name';
    var transform = opts.transform;
    if(transform) {
      var contents = transform.contents ? transform.contents(file) : 'contents';
      item = transfromItem(file, transform, item, true);
      item[contents] = String(file.contents).trim();
    } else {
      item.contents = String(file.contents).trim();
    }
    return item;
  }
}

module.exports = new DataHandler();
