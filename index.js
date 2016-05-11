'use strict';
var gutil = require('gulp-util');
var through = require('through2');
var fs = require('fs');
var nameFromPath = require('name-from-path');

function setupData(file, dest, cb) {
  var data = JSON.parse(fs.readFileSync(dest));
  return nameFromPath([file.path, file.base], false, (fileName) => {
    nameFromPath([file.path, file.base], true, (name) => {
      data.push({
        'name': String(name),
        'file': String(fileName),
        'path': String(file.path),
        'todo': String(file.contents).trim()
      });
      return cb(data);
    });
  });
}

module.exports = function (destination) {
	if (!destination) {
    destination = 'appended.json';
  }
  fs.readdir(destination, function(err) {
    if (err) {
      fs.writeFileSync(destination, '[]');
    }
  });

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
			setupData(file, destination, (data) => {
        fs.writeFileSync(destination, JSON.stringify(data, null, '\t'));
        file.contents = new Buffer(data);
				this.push(file);
      });
		} catch (err) {
			this.emit('error', new gutil.PluginError('gulp-append', err));
		}

		cb();
	});
};
