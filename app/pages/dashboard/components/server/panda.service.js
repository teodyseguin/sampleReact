/**
 * Panda Utility Object
 *
 * This object is used to determine, what corresponding details should
 * be displayed in the form, when selecting a panda type."
 */
export let Panda = (function() {
	'use strict';

	let types = {};
	let typeName = null;

	class PandaClassObject {
		constructor(pandaTypeName, options) {
			let prefixName = 'Panda';
			let processorList = [1, 1, 2, 2, 4, 8, 12, 16, 20];
			let memoryList = [512, 1, 2, 4, 8, 16, 32, 48, 64];
			let monthlyList = [35, 99, 179, 249, 475, 699, 1399, 2249, 3499];
			let storageList = [20, 30, 40, 60, 80, 160, 320, 480, 640];
			let symbols = {
				currency: '$',
				memory: 'MB',
				processor: 'Core',
				storage: 'GB',
				transfer: 'TB',
			};
			let transferList = [1, 2, 3, 4, 5, 6, 7, 8, 9];

			if (options) {
				Object.keys(options).forEach(key => {
					if (key) {
						symbols[key] = options[key];
					}
				});
			}

			transferList.forEach(key => {
				let index = key - 1;
				let obj = {
				  monthly: `${symbols.currency}${monthlyList[index]}`,
				  memory: `${memoryList[index]}${symbols.memory}`,
				  processor: `${processorList[index]} ${symbols.processor}`,
				  storage: `${storageList[index]}${symbols.storage}`,
				  transfer: `${transferList[index]}${symbols.transfer}`,
				};

				types[`${prefixName} ${key}`] = obj;

			});

			typeName = pandaTypeName;
		}

		get type() {
			if (types[typeName]) {
				return types[typeName];
			}
		}
	}

	return PandaClassObject;
})();

