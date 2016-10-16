var Logger = require("./logger.js");
var LOG = new Logger('toolbarHelper');

/**
	Wait for the toolbar to be fully loaded.
*/
function waitForToolbar() {
	var dfd = jQuery.Deferred();
	
	var eventsBound = false;
	LOG.performance('binding setInterval');
	var waitId = setInterval(function() {
		if (typeof(ve.init.target) !== 'object') {
			return
		}
		LOG.performance('ve.init.target available');
		
		if (!eventsBound) {
			eventsBound = true;
			ve.init.target.on('surfaceReady', function() {
				LOG.performance('surfaceReady');
			});
		}
		
		LOG.info('ve.init.target.loading: ', ve.init.target.loading);
		if (ve.init.target.loading) {
			return
		}
		
		LOG.info('ve.init.target loaded');
		clearInterval(waitId);
		dfd.resolve();
	}, 100);
	
	return dfd.promise();
}

//
// Module exports
// --------------------------------
if (typeof module !== 'undefined' && module.exports)  {
	module.exports={
		waitForToolbar : waitForToolbar
	};
}