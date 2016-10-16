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