var events = require('events'),
	fs = require('fs');

function checkFileSize (fn, oldSize, cb, onErr) {
	fs.stat(fn, function(error, info){
		if (error) {
			onErr(error);
			// If file missing, we'll just say it's size changed to 0.
			// The ENOENT will also be emitted.
			if (error.code=="ENOENT") {
				if(0 != oldSize){
					cb(0);
				}
			};
		} else {
			if(info.size != oldSize){
				cb(info.size);
			}
		}
	});
}

module.exports = {
	watch: function(fd, ms, onErr, onReady){

		ms = ms || 100;

		var watcher = new events.EventEmitter(),
			currSize = -1,
			pulse,
			fileSizeChangeHandler,
			errorHandler,
			check;

		// -------------------------------------------------------
		// Ignored 'error' events will cause the program to crash.
		// Do not let this happen.
		// -------------------------------------------------------
		onErr = onErr || function() {};

		// -------------------------------------------------------
		// Without these, the user might run into race conditions
		// with those initial events.
		// -------------------------------------------------------
		if (onErr) watcher.on('error', onErr);
		if (onReady) watcher.on('ready', onReady);

		fileSizeChangeHandler = function(newSize) {
			if(currSize !== -1){
				watcher.emit('sizeChange', newSize, currSize);
			} else {
				watcher.emit('ready', newSize);
			}
			currSize = newSize;
		};
	
		errorHandler = function(error) {
			watcher.emit('error',error);
			onErr(error);
		};
	
		check = function(){
			checkFileSize(fd, currSize, fileSizeChangeHandler, errorHandler);
		};

		watcher.go = function() { 
			pulse = setInterval( check, (ms || 1000)); 
		};
		
		watcher.stop = function() { 
			pulse && clearInterval(pulse); 
		};

		watcher.info = function() {
			return {
				size: currSize
			};
		};

		// Immediately check file size to set baseline.  Then start watching on an interval.
		check();
		watcher.once('ready',function() { watcher.go(); });
		return watcher;
	}
};
