import Parse from 'parse';

export let ServerModel = (function() {
	'use strict';

	return Parse.Object.extend("Server", {
	    defaults: {
			ACL: null,
			accountPointer: null,
			active: false,
			authorizedAdmins: [],
			authorizedReaders: [],
			authorizedWriters: [],
			serverName: "104.236.132.183 (Processing...)",
			createdAt: null,
			done: false,
			finished: false,
			madeActiveOn: null,
			memorySize: "512 Mb",
			pandaType: "Panda 1",
			photo: null,
			processing: true,
			requested: false,
			storageSize: "20 Gb",
			tested: false,
			transferRate: "1 Tb"
	    }
	});
})();

