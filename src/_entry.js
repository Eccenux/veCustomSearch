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

// default rules
var rules = require("./rules.js");

/**
	Apply value.
	@return true if value was found and actualy applied (different).
*/
function applyValue (control, valueObject, valueKey) {
	if (valueKey in valueObject) {
		var next = valueObject[valueKey];
		var current = control.getValue();
		if (current != next) {
			control.setValue(next);
			return true;
		}
	}
	return false;
}

/**
	Apply rule.
*/
function applyRule (rule) {
	LOG.info('applyRule called: ', rule);
	// pre-parse
	if (typeof(rule) !== 'object') {
		return;
	}
	if (typeof(rule.options) !== 'object') {
		rule.options = {};
	}
	// apply
	var changed = false;
	changed |= applyValue(findAndReplaceDialog.findText, rule, 's');
	changed |= applyValue(findAndReplaceDialog.replaceText, rule, 'r');
	changed |= applyValue(findAndReplaceDialog.matchCaseToggle, rule.options, 'caseSensitive');
	changed |= applyValue(findAndReplaceDialog.regexToggle, rule.options, 'regExp');
	changed |= applyValue(findAndReplaceDialog.wordToggle, rule.options, 'word');
}

/**
	Button instances for rules.
*/
var rulesButtons = [];

/**
	Add (init) GUI.
	
	@return true if GUI was successfully initialized.
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