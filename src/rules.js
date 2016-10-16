/**
	Default search->replace rules (pl).
*/
defaultRules = [];

// pl-quotes
defaultRules.push({
	title: 'cudz.',
	s: '(?:,,|["„])(.+?)["“]',
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

//
// Module exports
// --------------------------------
if (typeof module !== 'undefined' && module.exports)  {
	module.exports=defaultRules;
}