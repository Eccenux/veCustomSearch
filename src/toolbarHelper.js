var Logger = require("./logger.js");
var LOG = new Logger('toolbarHelper');

/**
	Wait for the toolbar to be fully loaded.
*/
function waitForToolbar(surfaceReadyCheck) {
	var dfd = jQuery.Deferred();
	
	var eventsBound = false;
	var surfaceReady = false;
	var targetLoaded = false;
	if (!surfaceReadyCheck) {
		surfaceReady = true;
	}
	LOG.performance('binding setInterval');
	var waitId = setInterval(function() {
		if (typeof(ve.init.target) !== 'object') {
			return
		}
		LOG.performance('ve.init.target available');
		
		if (surfaceReadyCheck) {
			if (!eventsBound) {
				eventsBound = true;
				ve.init.target.on('surfaceReady', function() {
					LOG.performance('surfaceReady');
					surfaceReady = true;
					if (targetLoaded) {
						dfd.resolve();
					}
				});
			}
		}
		
		LOG.info('ve.init.target.loading: ', ve.init.target.loading);
		if (ve.init.target.loading) {
			return
		}
		targetLoaded = true;
		LOG.info('ve.init.target loaded');
		clearInterval(waitId);
		if (surfaceReady) {
			dfd.resolve();
		}
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