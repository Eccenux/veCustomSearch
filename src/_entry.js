/**
	Custom search plugin -- init.
*/
var Logger = require("./logger.js");
var LOG = new Logger('main');

LOG.info('loaded');

// check for elements
console.log('init', ve.init);
console.log('target', ve.init.target);

try {
toolbar = ve.init.target.getToolbar();
LOG.info(toolbar.$element);
} catch (e) {
	LOG.warn('toolbar element not available', e.message);
	debugger;
}
ve.init.platform.initialized.done(function(){console.log('target', ve.init.target);})

LOG.info('.ve-ui-findAndReplaceDialog: ', $('.ve-ui-findAndReplaceDialog').length);
LOG.info('.oo-ui-inputWidget-input: ', $('.oo-ui-inputWidget-input').length);
