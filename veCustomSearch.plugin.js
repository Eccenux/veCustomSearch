/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/**
		Custom search plugin -- init.
	*/
	var Logger = __webpack_require__(1);
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

/***/ },
/* 1 */
/***/ function(module, exports) {

	/**
	 * Simple logger class.
	 * 
	 * Assuming Firebug style console object is avaiable: http://getfirebug.com/logging
	 * BUT it abstracts you from `console` avilabilty and implementation
	 * as it will simply not run if the functions are not available.
	 * 
	 * How it works:
	 * ```
	 * var LOG = new Logger('function or class name or any other tag');
	 * LOG.info('some debug/notice information');
	 * LOG.warn('some warning (usually non-critical) information');
	 * LOG.error('some error (usually critical) information');
	 * ```
	 *
	 * Note that you can pass any number of arguments and they will be stringified whenever possible.
	 * ```
	 * data = {"test":123,abc:"def"}
	 * LOG.info('the json data:', data);
	 * ```
	 *
	 * Output:
	 * ```
	 * [tag] the json data:{
	 *	"test":123,"abc":"def"
	 * }
	 * ```
	 * 
	 * Author: Maciej Jaros
	 * Web: http://enux.pl/
	 *
	 * Licensed under
	 *   MIT License http://www.opensource.org/licenses/mit-license
	 *   GPL v3 http://opensource.org/licenses/GPL-3.0
	 *
	 * @param {String} tag Tag to be put in console (e.g. class name).
	 * @param {Object|Boolean} levels Preset for enabled levels (true|false for setting all levels).
	 * @class Logger
	 */
	function Logger(tag, levels) {
		/**
		 * Use to disable all levels for this logger instance.
		 */
		this.enabled = true;
		/**
		 * Use to disable levels separately.
		 */
		this.enabledLevels = {
			info : true,
			warn : true,
			error : true
		};
		/**
		 * The tag text.
		 * @private
		 */
		this._tag = tag;
		/**
		 * Use to disable perfmonance logging.
		 */
		this.performanceEnabled = true;
		/**
		 * Tracks performance tick for diffs.
		 * @private
		 */
		this._performancePrevious = 0;

		// setup `_performanceNow` proxy for `performance.now`
		if (this.performanceEnabled) {
			this._performanceNow = (typeof(performance)!='undefined' && 'now' in performance)
			? function () {
				return performance.now();
			}
			// polly for iPhone...
			: function () {
				return (new Date()).getTime();
			};
			this._performancePrevious = this._performanceNow();
		}
		
		this._initEnabled(levels);
	}

	/**
	 * Init enabled levels.
	 * @param {Object|Boolean} levels Preset for enabled levels (true|false for setting all levels).
	 */
	Logger.prototype._initEnabled = function (levels) {
		if (typeof(levels) === 'boolean') {
			this.enabled = levels;
		}
		else if (typeof(levels) === 'object') {
			for (var level in levels) {
				this.enabledLevels[level] = levels[level] ? true : false;
			}
		}
	};

	/**
	 * Check if logging is enabled for certain level.
	 *
	 * @param {String} level info|warn|error
	 * @returns {Boolean} true if enabled
	 */
	Logger.prototype.isEnabled = function (level) {
		if (!this.enabled || typeof(console)==='undefined') {
			return false;
		}
		var enabled = false;
		switch (level) {
			case 'info':
				if ('log' in console) {
					enabled = this.enabledLevels.info;
				}
			break;
			case 'warn':
				if ('warn' in console) {
					enabled = this.enabledLevels.warn;
				}
			break;
			case 'error':
				if ('error' in console) {
					enabled = this.enabledLevels.error;
				}
			break;
		}
		return enabled;
	};

	/**
	 * Attempts to create a readable string from about anything.
	 *
	 * @private
	 *
	 * @param {mixed} variable Whatever to parse.
	 * @returns {String}
	 */
	Logger.prototype._variableToReadableString = function (variable) {
		var text = variable;
		if (typeof(text) == 'undefined') {
			text = '[undefined]';
		}
		else if (typeof(text) != 'string') {
			try {
				text = JSON.stringify(text);
			} catch (e) {
				try {
					text = JSON.stringify(JSON.decycle(text, true));
				} catch (e) {
					text = text.toString();
				}
			}
			text = text
					.replace(/","/g, '",\n"')			// this should also work when a value is JSON.stringfied
					.replace(/\{"/g, '{\n"')
					.replace(/"\}(?=[,}]|$)/g, '"\n}')	// this should also work when a value is JSON.stringfied
			;
		}
		return text;
	};

	/**
	 * Render arguments for display in console.
	 *
	 * @private
	 *
	 * @param {Array} argumentsArray
	 *		This is either arguments array or a real Array object
	 *		(see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions_and_function_scope/arguments).
	 * @returns {String}
	 */
	Logger.prototype._renderArguments = function (argumentsArray) {
		var text = "";
		for (var i = 0; i < argumentsArray.length; i++) {
			text += this._variableToReadableString(argumentsArray[i]);
		}
		if (this._tag.length) {
			return "["+this._tag+"] " + text;
		}
		return text;
	};

	/**
	 * Performance info and checkpoint set.
	 *
	 * @param {String} comment Any comment e.g. tick info/ID.
	 */
	Logger.prototype.performance = function (comment) {
		if (this.performanceEnabled && this.isEnabled('info')) {
			var now = this._performanceNow();
			this.info(comment, '; diff [ms]: ', now - this._performancePrevious);
			this._performancePrevious = now;
		}
	};

	/**
	 * Informational text, notice.
	 *
	 * @note All arugments are converted to text and passed to console.
	 */
	Logger.prototype.info = function () {
		if (this.isEnabled('info')) {
			console.log(this._renderArguments(arguments));
		}
	};

	/**
	 * Warning text.
	 *
	 * @note All arugments are converted to text and passed to console.
	 */
	Logger.prototype.warn = function () {
		if (this.isEnabled('warn')) {
			console.warn(this._renderArguments(arguments));
		}
	};

	/**
	 * Error text.
	 *
	 * @note All arugments are converted to text and passed to console.
	 */
	Logger.prototype.error = function () {
		if (this.isEnabled('error')) {
			console.error(this._renderArguments(arguments));
		}
	};

	if (typeof module !== 'undefined' && module.exports)  {
		module.exports=Logger;
	}

/***/ }
/******/ ]);