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
	// Init i18n
	//
	var i18nData = {
		pl : __webpack_require__(5),
		en : __webpack_require__(6)
	}
	var I18n = __webpack_require__(7);
	var i18n = new I18n(i18nData, mw.config.get('wgUserLanguage'));


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
	};

	// default rules
	var rules = __webpack_require__(4);

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
				label: rule.title,
				title: i18n.get('rules-button-tooltip', {from:rule.s, to:rule.r})
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

/***/ },
/* 2 */,
/* 3 */,
/* 4 */
/***/ function(module, exports) {

	/**
		Default search->replace rules (pl).
	*/
	var defaultRules = [];

	// pl-quotes
	defaultRules.push({
		title: 'cudz.',
		s: '(?:,,|["„])(.+?)["“]',
		r: '„$1”',
		options : {
			caseSensitive: false,
			regExp: true,
			word: false
		}
	});

	// spacing
	defaultRules.push({
		title: 'int. spacja',
		s: '([^\\s\\d][.,:])([^\\s\\d])',
		r: '$1 $2',
		options : {
			caseSensitive: false,
			regExp: true,
			word: false
		}
	});

	//
	// Module exports
	// --------------------------------
	if (typeof module !== 'undefined' && module.exports)  {
		module.exports=defaultRules;
	}

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = {
		'rules-button-tooltip' : 'Zamiana `{$from}` na `{$to}`.'
	};

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = {
		'rules-button-tooltip' : 'Replace `{$from}` with `{$to}`.'
	};

/***/ },
/* 7 */
/***/ function(module, exports) {

	/**
	 * Klasa obsługująca internacjonalizację (ang. i18n)
	 * 
	 * <p>Podstawową metodą jest metoda "get". Przykłady użycia:</p>
	 * <ol>
	 *   <li>var yesText = i18n.get("_Yes");</li>
	 *   <li>var hiText = i18n.get("_Hi_username", {username:"Maciej"});</li>
	 *   <li>{i18n.get("_Yes")}</li>
	 * </ol>
	 * <p>Pierwszy i drugi przykład przypisuje wartość do zmiennej. Drugi do razu ją wyświetla.</p>
	 * <p>Należy zwrócić uwagę, że w tekście "_Hi_username" musi być zawarty tekst "{$username}".</p>
	 * 
	 * <hr />
	 * <pre>
	 * TODO: testowanie prawidłowości i18n w this.init?
	 * TODO: Obsługa gender
	 * TODO: Obsługa formy zależnej od liczby
	 * Uwaga! Będzie wymagało stworzenia tablicy warunków zależnych od używanego języka.
	 * </pre>
	 *
	 * @see init Opis parametrów konstruktora
	 */
	function I18n(i18nTexts, userLanguage, fallbackLanguage, defaultLanguage)
	{
		/**
		 * Określa, czy udało się załadować dane.
		 */
		this.loaded = false;
		
		/**
		 * Czy tryb debugowania języka
		 * 
		 * <p>Jeśli prawda, to tryb debugowania językowego jest włączony, co oznacza, że znaki specjalne będą dołączane do tekstu.</p>
		 */				
		var _isDebugModeOn = false;
		this.get_isDebugModeOn = function()
		{
			return _isDebugModeOn;
		}
		this.set_isDebugModeOn = function(value)
		{
			_isDebugModeOn = value;
		}
		/**
		 * Oznaczenie wiadomości, które były dostępne (tylko w trybie debugowania)
		 */
		var _textAvailableMark = "☺";
		/**
		 * Oznaczenie wiadomości, które nie były dostępne w języku użytkownika (tylko w trybie debugowania)
		 */
		var _textOnlyFallbackAvailableMark = "☻";
		/**
		 * Oznaczenie wiadomości, które nie były w ogóle dostępne (tylko w trybie debugowania)
		 */
		var _textNotAvailableMark = "☒";

		/**
		 * Kod języka awaryjnego odwrotu
		 * 
		 * <p>Jeśli tekst dla preferowanego języka nie jest dostępny, to tekst z tym kodem jest zwracany (jeśli w ogóle dostępny).</p>
		 */
		var _fallbackLanguage = "en";
		/**
		 * Domyślny kod języka
		 * 
		 * <p>Kod języka używany jeśli użytkonik nie wybrał inaczej.</p>
		 */
		var _defaultLanguage = "pl";
		
		/**
		 * Kod język użytkownika programu
		 * 
		 * <p>Kod ten jest ustawiany przy inicjowaniu.</p>
		 */
		var _userLanguage;
		this.get_userLanguage = function()
		{
			return _userLanguage;
		}
		this.set_userLanguage = function(value)
		{
			/*
			if (_texts[_userLanguage] == 'undefined')
			{
				_userLanguage = value;
			}
			else
			{
				_userLanguage = _fallbackLanguage;
			}
			*/
			_userLanguage = value;
		}

		var _texts = new Object();

		/**
		 * Pobiera odpowiedni text (odpowiedni wg bieżącego _userLanguage).
		 * 
		 * @param id Unikatowy identyfikator tekstu
		 * @return {
		 *		isFallback : true/false,	- true on error (text not available)
		 *		text : 'blah'				- the text (either in _userLanguage or in _fallbackLanguage); empty when none available!
		 *      isObject : true/false       - if true `text` is actualy a subobject (probably for some plugin)
		 *	}
		 * @note text might be a string but might be some object like {'key' : 'value'} (or an array)
		 */
		function _rawGet(id)
		{
			var isFallback = true;
			var text = '';
			
			// user choosen lang. available (at all and for the given id)
			if (
				typeof(_texts[_userLanguage]) != 'undefined'
				&&
				typeof(_texts[_userLanguage][id]) != 'undefined'
			)
			{
				text = _texts[_userLanguage][id];
				isFallback = false;
			}
			// fallback? (at all and for the given id)
			else if (
				typeof(_texts[_fallbackLanguage]) != 'undefined'
				&&
				typeof(_texts[_fallbackLanguage][id]) != 'undefined'
			)
			{
				text = _texts[_userLanguage][id];
			}
			/*
			// critical fallback!
			else
			{
				text = id;
			}
			*/
			// check if we got something a bit different...
			var isObject = true;
			if (typeof(text) == 'string')
			{
				isObject = false;
			}
			
			return {'isFallback': isFallback, 'text': text, 'isObject': isObject};
		}
		
		/**
		 * Inicjalizacja (lub re-inicjalizacja) umożliwiająca korzystanie potem z metody get.
		 * 
		 * @param i18nTexts
		 *	Obiekt typu (puste klucze są ignorowane - mogą być użyte dla wygody):
		 *	{"":""
		 *		// Polski
		 *		,'pl' : {"":""
		 *			,"text id" : "Tłumaczenie"
		 *			,"something" : "Coś"
		 *		}
		 *		// English
		 *		,'en' : {"":""
		 *			,"text id" : "Translation"
		 *			,"something" : "Something"
		 *		}
		 *	}
		 * @param userLanguage [opcjonalny] Kod języka użytkownika
		 * @param fallbackLanguage [opcjonalny] Kod języka awaryjnego odwrotu
		 * @param defaultLanguage [opcjonalny] Domyślny kod języka
		 *
		 * @return true if load texts, false otherwise
		 */
		this.init = function(i18nTexts, userLanguage, fallbackLanguage, defaultLanguage)
		{
			// setup languages
			if (fallbackLanguage && fallbackLanguage.length > 0)
			{
				_fallbackLanguage = fallbackLanguage;
			}
			if (defaultLanguage && defaultLanguage.length > 0)
			{
				_defaultLanguage = defaultLanguage;
			}
			
			if (userLanguage && userLanguage.length > 0)
			{
				_userLanguage = userLanguage;
			}
			else _userLanguage = _defaultLanguage;
			
			// init
			_texts = i18nTexts;
			
			// ready
			this.loaded = true;
			
			// done
			return this.loaded;
		}
		
		/**
		 * Przetwarza tekst aby wyeliminować znaki specjalne występujące w wyrażeniach regularnych typu RegExp
		 * 
		 * @param text Tekst do przetworzenia
		 * @return Przetworzony tekst
		 */
		function _escapeRegExpString(text)
		{
			return text.replace(/([\^\$\.\|\?\*\+\(\)\[\]\-\\])/g, '\\$1');
		}
		
		/**
		 * Pobieranie tekstu według identyfikatora
		 * 
		 * <p><b>Uwaga!</b> nazwa_parametru powinna zawierać tylko litery i ew. podkreślenia</p>
		 * 
		 * @param id Unikatowy identyfikator tekstu
		 * @param parameters [opcjonalny] obiekt-tablica par {'nazwa_parametru' : 'wartość'}
		 * @return Gotowy do wyświetlenia tekst
		 * 
		 * @see I18n Przykłady użycia w opisie klasy
		 */
		this.get = function(id, parameters)
		{
			var textInfo = _rawGet(id);
			
			// return raw if object
			if (textInfo.isObject)
			{
				return textInfo.text;
			}
			// not available at all - return id (with optional iconic mark)
			else if (textInfo.text.length <= 0)
			{
				return (!_isDebugModeOn ? id : _textNotAvailableMark + id);
			}
			// either fallback or correct translation was given
			else
			{
				var text = textInfo.text;
				// resolve parameters
				if (parameters != null && text.search(/\$[a-z]+/) > -1)
				{
					// Uwaga! podmienia parametry i usuwa klamerki, 
					// docelowo powinno je pewnie zostawiać, żeby móc obsłużyć inne kontrukcje specjalne
					text = text.replace(/\{([^\}]+)\}/g, function (a1, specialContent, index, text)
					{
						for (var parameterName in parameters)
						{
							var parameterExpression = new RegExp("\\$"+_escapeRegExpString(parameterName), "g")
							specialContent = specialContent.replace(parameterExpression, parameters[parameterName])
						}
						return specialContent;
					});
				}
				if (textInfo.isFallback)
				{
					return (!_isDebugModeOn ? id : _textOnlyFallbackAvailableMark + id);
				}
				return (!_isDebugModeOn ? text : _textAvailableMark + text);
			}
		}				

		//
		// Uruchomienie init jako konstruktora
		this.init (i18nTexts, userLanguage, fallbackLanguage, defaultLanguage);
		i18nTexts = userLanguage = fallbackLanguage = defaultLanguage = null;	// usuwanie parametrów konstruktora co by nie śmieciły
	}

	if (typeof module !== 'undefined' && module.exports)  {
		module.exports=I18n;
	}

/***/ }
/******/ ]);