/**
	Script loader for an actual plugin
*/
// load User Script
mw.loader.using( 'ext.visualEditor.desktopArticleTarget.init', function () {
	// Register plugins to VE. will be loaded once the user opens VE
	mw.libs.ve.addPlugin( function () { 
		//return $.getScript('//pl.wikipedia.org/w/index.php?title=User:Nux/veCustomSearch.plugin.js&action=raw&ctype=text/javascript'); 
		return $.getScript('/_wiki_js/_przyciski%20edycji/veMyPlugins/veCustomSearch.plugin.js'); 
	} );
});
