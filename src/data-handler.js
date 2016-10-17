'use strict';

export default class DataHandler {

  _getJSON(dest) {
    try {
      return JSON.parse(fs.readFileSync(dest));
    } catch (e) {
      return [];
    }
  }

  _getString(dest) {
    try {
      return String(fs.readFileSync(dest));
    } catch (e) {
      return String();
    }
  }

  getData(dest, json) {
    if (json) {
      return this._getJSON(dest);
    } else {
      return this._getString(dest)
    }
  }

  setup(file, json, opts) {
    return new Promise((resolve, reject) => {
      var data;
      var item = {};
      var transform = opts ? opts.transform : false;
      if (typeof opts === 'function') {
        cb = opts;
      }
      data = this.getData(opts.destination, json);
      if (typeof data === 'string') {
        data += '\n' + String(file.contents).trim();
        data = data.trim();
      } else if (data instanceof Array) {
        data.push(this.add(file, opts));
      }
      resolve(data);
    });
  }

 transformItem(file, transform, item, update=false, named=false) {
   var contents = transform.contents ? transform.contents(file) : 'contents';
   for (let key of Object.keys(transform)) {
     if (update) {
       if (key !== 'name' && contents === 'contents') {
         item[key] = transform[key](file);
       } else if(contents !== 'contents' &&
                 key !== 'contents' && key !== 'name') {
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
   return item;
 }

  add(file, opts, item) {
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
      item = this.transfromItem(file, transform, item, true);
      item[contents] = String(file.contents).trim();
    } else {
      item.contents = String(file.contents).trim();
    }
    return item;
  }
}
