/**
	Default search->replace rules (pl).
*/
var defaultRules = [];

// dash
defaultRules.push({
	title: ' – ',
	s: ' - ',
	r: ' – ',
	options : {
		caseSensitive: false,
		regExp: true,
		word: false
	}
});

// pl-quotes
defaultRules.push({
	title: 'cudz.',
	s: '(?:,,|["])(.+?)["“]',
	r: '„$1”',
	options : {
		caseSensitive: false,
		regExp: true,
		word: false
	}
});

// spacing
defaultRules.push({
	title: 'int. spacja',
	s: '([^\\s\\d][.,:])([^\\s\\d])',
	r: '$1 $2',
	options : {
		caseSensitive: false,
		regExp: true,
		word: false
	}
});

// dates
defaultRules.push({
	title: 'Y-m-d',
	s: '(\d{1,2})\.(\d{1,2})\.(\d{4})',
	r: '$3-$2-$1',
	options : {
		caseSensitive: false,
		regExp: true,
		word: false
	}
});


//
// Module exports
// --------------------------------
if (typeof module !== 'undefined' && module.exports)  {
	module.exports=defaultRules;
}