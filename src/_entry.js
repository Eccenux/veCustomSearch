/**
	Custom search plugin -- init.
*/
var Logger = require("./logger.js");
var LOG = new Logger('main');

LOG.info('plugin code loaded');

//
// Replace `onFindChange` to hook into the find-and-replace form.
//
var firstFormLoad = true;
var old_onFindChange = ve.ui.FindAndReplaceDialog.prototype.onFindChange;
var findAndReplaceDialog = null;
ve.ui.FindAndReplaceDialog.prototype.onFindChange = function () {
	old_onFindChange.call(this);
	if (firstFormLoad) {
		firstFormLoad = false;
		findAndReplaceDialog = this;
		LOG.info('onFindChange - init; this: ', this);
		LOG.info('.ve-ui-findAndReplaceDialog: ', $('.ve-ui-findAndReplaceDialog').length);
		LOG.info('.oo-ui-inputWidget-input: ', $('.oo-ui-inputWidget-input').length);
		addGui();
	}
	else {
		LOG.info('onFindChange - repeated');
	}
	/*
	ve.userConfig( {
		'visualeditor-findAndReplace-findText': this.findText.getValue(),
		'visualeditor-findAndReplace-matchCase': this.matchCaseToggle.getValue(),
		'visualeditor-findAndReplace-regex': this.regexToggle.getValue(),
		'visualeditor-findAndReplace-word': this.wordToggle.getValue()
	} );
	*/
};

// example rules
var rules = [{
	title: 'cudz.',
	s: '(?:,,|["„])(.+?)["“]',
	r: '„$1”',
	options : {
		caseSensitive: false,
		regExp: true,
		word: false
	}
}];

/**
	Apply rule.
*/
function applyRule (rule) {
	LOG.info('applyRule called: ', rule);
}

/**
	Button instances for rules.
*/
var rulesButtons = [];

/**
	Add (init) GUI.
*/
function addGui () {
	LOG.info('addGui called');
	
	var $findRow = $('.ve-ui-findAndReplaceDialog .ve-ui-findAndReplaceDialog-row:first');
	var $findCell = $('.ve-ui-findAndReplaceDialog-cell-input:first', $findRow);
	if (!$findRow.length || !$findCell.length) {
		LOG.warn('addGui failed -- required form elments not available');
		return false;
	}

	// create buttons
	for (var i = 0; i < rules.length; i++) {
		var rule = rules[i];
		rulesButtons[i] = new OO.ui.ButtonWidget( {
			label: rule.title
		} );
		rulesButtons[i].$element[0]._veCS_rule = rule;
		rulesButtons[i].$element.click(function(){
			debugger;
			applyRule(this._veCS_rule);
		});
	}

	// create buttons group
	rulesGroup = new OO.ui.ButtonGroupWidget( {
			classes: [ 've-ui-findAndReplaceDialog-cell' ],
			items: rulesButtons
		} )
	;
	$findCell.after(rulesGroup.$element);
	LOG.info('addGui done');
	return true;
}