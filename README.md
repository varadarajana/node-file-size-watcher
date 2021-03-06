node-file-size-watcher
===============
# This project is no longer being updated or maintained.

Watches files for size changes in Node.js. Tiny, unit tested, and no dependencies.

###Usage
``` js
require('file-size-watcher').watch("fileName.txt").on('sizeChange',
	function callback(newSize, oldSize){
		console.log('The file size changed from ' + oldSize + ' to ' + newSize);
	}
);
```

The `watch` method returns an [EventEmitter](http://nodejs.org/api/events.html#events_class_events_eventemitter). It takes the following parameters:

`watch(fd, [interval], [onErr], [onReady])`
 * `fd` - File descriptor (anything `fs.stat` accepts for a file descriptor)
 * `interval` - pause between checks in milliseconds.
 * `onErr` - Error handler.  Users can listen for `'error'` events themselves, but setting this avoids possible race conditions.
 * `onReady` - Same thing as onErr, but for `'ready'` event.

###Events

 * `'sizeChange'` - passes new size and old size to listeners.
 * `'ready'` - passes initial size to listeners (called only once).
 * `'error'` - Passes any error objects to listeners. Includes ENOENTs, so prepare for lots of those if the file is missing. Program will keep running regardless of whether this is listened to.

###Extras

The watcher object (`var watcher = fsw.watch(...)`), besides emitting events, also has a few additional features:

```js
	watcher.stop(); // Stops watching the file
	watcher.start(); // Resumes watching the file
	console.log(watcher.info.size); // Returns last known size.
```
