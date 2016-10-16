/**
	Custom search plugin -- init.
*/
var Logger = require("./logger.js");
var LOG = new Logger('main');

LOG.info('plugin code loaded');

var toolbarHelper = require("./toolbarHelper.js");

toolbarHelper.waitForToolbar().done(function(){
	try {
		toolbar = ve.init.target.getToolbar();
		LOG.info(toolbar.$element);
	} catch (e) {
		LOG.warn('toolbar element not available', e.message);
		debugger;
	}
	LOG.info('.ve-ui-findAndReplaceDialog: ', $('.ve-ui-findAndReplaceDialog').length);
	LOG.info('.oo-ui-inputWidget-input: ', $('.oo-ui-inputWidget-input').length);
});
