import Parse from 'parse';

export let Account = (function() {
	'use strict';

	return Parse.Object.extend('Account', {
		defaults: {
			accountName: null,
			authorizedAdmins: [],
			authorizedReaders: [],
			authorizedWriters: [],
			billingInfo: [],
			ownerPointer: null,
			ownerPFObjectID: null,
			photo: null,
		}
	});
})();

