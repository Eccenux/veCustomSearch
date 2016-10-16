const path = require('path');

module.exports = {
    //context: 'd:\\_WWW\\__serwer_root\\_wiki_js\\_przyciski edycji\\veMyPlugins',
    entry: './src/_entry.js',
    output: {
        path: __dirname,
        filename: "veCustomSearch.plugin.js"
    }
};
