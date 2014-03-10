var fileName = process.argv[2];

require('./index.js').watch(fileName).on('sizeChange',
	function callback(newSize){
		console.log('The file size changed to ' + newSize);
	}
);

