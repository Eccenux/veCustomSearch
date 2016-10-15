/**
	Script loader for an actual plugin
*/
// load User Script
mw.loader.using('ext.visualEditor.desktopArticleTarget.init', function () {
	console.log('init');	// happens when VE is already loaded too
	// Register plugins to VE. will be loaded once the user opens VE
	mw.libs.ve.addPlugin(function () {
		console.log('addPlugin');	// only happens on-switch to VE (not when VE is already loaded)
		//return $.getScript('//pl.wikipedia.org/w/index.php?title=User:Nux/veCustomSearch.plugin.js&action=raw&ctype=text/javascript'); 
		return $.getScript('https://localhost/_wiki_js/_przyciski%20edycji/veMyPlugins/veCustomSearch.plugin.js'); 
	});
});
