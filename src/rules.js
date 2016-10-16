/**
	Some search->replace rules.
	
	Think of it as named search form state.
*/
// make sure the settings exist
if (!Array.isArray(veCustomSearchRules)) {
	var veCustomSearchRules = [];
}
// pl-quotes
veCustomSearchRules.push({
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
veCustomSearchRules.push({
	title: 'int. spacja',
	s: '([^\s\d][.,:])([^\s\d])',
	r: '$1 $2',
	options : {
		caseSensitive: false,
		regExp: true,
		word: false
	}
});
