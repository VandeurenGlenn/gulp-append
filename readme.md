# gulp-append [![Build Status](https://travis-ci.org/VandeurenGlenn/gulp-append.svg?branch=master)](https://travis-ci.org/VandeurenGlenn/gulp-append)

> An gulp plugin for writing .pipe 'data' to a file.


## Install

```
$ npm install --save-dev gulp-append
```


## Usage

### Default usage
```js
var gulp = require('gulp');
var append = require('gulp-append');

gulp.task('default', function () {
	return gulp.src('src/file.json')
		.pipe(append());
});
```

### Using a custom destination
```js
var gulp = require('gulp');
var append = require('gulp-append');

gulp.task('default', function () {
	return gulp.src('src/file.json')
		.pipe(append({destination: 'some/path/appended-file.json'}));
});
```

### Using tranform
```js
var gulp = require('gulp');
var append = require('gulp-append');
var nameFromPath = require('name-from-path');

gulp.task('append:transform', () => {
  return gulp.src(
    'README.md'
  ).pipe(append({
      transform: {
        path: function(file) {
          return String(file.path)
        },
        name: function(file) {
          return nameFromPath(file, true);
        }
      }
    }
  ));
});
```

### Wrapping it all together
```js
var gulp = require('gulp');
var append = require('gulp-append');
var nameFromPath = require('name-from-path');

gulp.task('append:transform', () => {
  return gulp.src(
    'README.md'
  ).pipe(append({
    transform: {
      path: function(file) {
        return String(file.path)
      },
      name: function(file) {
        return nameFromPath(file, true);
      }
    },
		destination: 'some/path/to/file.json'
  }));
});
```

## API

### options

#### destination

Type: `string`  
Default: `appended.json`

The destination to write to.

```js
append({destination: 'some-file.json'});
```

#### json

Type: `boolean`  
Default: `false`

Wether or not the destination should be handled as json.

```js
append({json: true});
```

#### transform

Type: `object`  
Default: `undefined`

Transform the file to your likes.

```js
append({
	transform: {
	  path: function(file) {
			return String(file.path);
	  }
	}
});
```
## License

MIT © [Glenn Vandeuren](https://github.com/VandeurenGlenn)
