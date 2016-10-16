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
ve.ui.FindAndReplaceDialog.prototype.onFindChange = function () {
	old_onFindChange.call(this);
	if (firstFormLoad) {
		firstFormLoad = false;
		LOG.info('onFindChange - init; this: ', this);
		LOG.info('.ve-ui-findAndReplaceDialog: ', $('.ve-ui-findAndReplaceDialog').length);
		LOG.info('.oo-ui-inputWidget-input: ', $('.oo-ui-inputWidget-input').length);
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
