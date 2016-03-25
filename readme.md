# gulp-append [![Build Status](https://travis-ci.org/VandeurenGlenn/gulp-append.svg?branch=master)](https://travis-ci.org/VandeurenGlenn/gulp-append)

> An gulp plugin for writing .pipe 'data' to a file.


## Install

```
$ npm install --save-dev gulp-append
```


## Usage

```js
var gulp = require('gulp');
var append = require('gulp-append');

gulp.task('default', function () {
	return gulp.src('src/file.ext')
		.pipe(append('appended.json'));
});
```


## API

### options

#### append(destination)

Type: `string`  
Default: `appended.json`

The destination to write to.


## License

MIT © [Glenn Vandeuren](https://github.com/VandeurenGlenn)
