'use strict';

// formatter.format(number); // $2345
let formatter = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'USD',
	maximumSignificantDigits: 3
});


function ago(val) {
	val = 0 | (Date.now() - val) / 1000;
	var unit, length = { sec: 60, min: 60, h: 24, d: 7, w: 4.35,
			m: 12, y: 10000 }, result;

	for (unit in length) {
			result = val % length[unit];
			if (!(val = 0 | val / length[unit]))
					return result + unit;
	}
}
// ago(new Date('2010-10-11T01:46:25.251Z')); // '8 years'

exports.ago = ago;
exports.formatter = formatter;
