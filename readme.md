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
		.pipe(append('some/path/appended-file.json'));
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
  ).pipe(append('some/path/to/file.json', {
    transform: {
      path: function(file) {
        return String(file.path)
      },
      name: function(file) {
        return nameFromPath(file, true);
      }
    }
  }));
});
```

## API

### options

#### append(destination)

Type: `string`  
Default: `appended.json`

The destination to write to.

```js
append('some-file.json');
```

#### append(opts) - json

Type: `boolean`  
Default: `false`

Wether or not the destination should be handled as json.

```js
append({json: true});
```

#### append(opts) - named

Type: `boolean`  
Default: `false`

Wether or not to name the items.

*** creates an named object when true (checkout the [transform](https://github.com/VandeurenGlenn/gulp-append#appendopts---transform) option to learn how to set an custom name)***

```js
append({named: true});
```

#### append(opts) - transform

Type: `object`  
Default: `undefined`

Transform the file to your likes.

```js
append({
	transform: {
	  path: function(file) {
			return String(file.path);
	  },
		info: function(file) {
			return 'some info ...';
		}
	}
});
```
## License

MIT © [Glenn Vandeuren](https://github.com/VandeurenGlenn)
