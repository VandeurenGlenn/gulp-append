'use strict';

module.exports = (file, transform, item, update=false, named=false) => {
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
};
