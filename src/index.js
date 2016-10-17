'use strict';
var gutil = require('gulp-util');
var through = require('through2');
import append from './append';

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
