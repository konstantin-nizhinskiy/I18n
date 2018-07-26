/*
name: nks-i18n
version: 1.7.0
author: Konstantin Nizhinskiy
date: 2018-07-26 13:07:05 

*/
(function (root, factory) {
    if(typeof define === "function" && define.amd) {
        // the AMD loader.
        define([], function(){
            return (root.i18n = factory());
        });
    } else if(typeof module === "object" && module.exports) {
        // the CommonJS loader.
        module.exports = (root.i18n = factory());
    } else {
        root.i18n = factory();
    }
}(this, function () {
    /**
     *
     * @constructor
     */
    var I18n = function () {
            this.setProperty({
                locale: 'UA',
                localeDefault: 'UA',
                versionJson: +new Date()
            });
        },
        /**
         *
         * @type {string} - locale active now
         * @private
         */
        _locale='UA',
        /**
         *
         * @type {string} - default locale active now
         * @private
         */
        _localeDefault='UA',
        /**
         *
         * @type {string} - default value translation
         * @private
         */
        _defaultValue='',
        /**
         *
         * @type {object} - translations object load
         * @private
         */
        _translations = {},
        /**
         *
         * @type {object} - flags load translations bundle
         * @private
         */
        _bundleFile = {};
        /**
         *
         * @type {object} - Module prefix url
         * @private
         */
        _modulePrefix = {};
    // 
/**
 * Change locale
 *
 * @param locale {string} - locale (UA,EN...)
 * @event changeLocale - event change locale
 * @return {string}
 */
I18n.prototype.changeLocale = function (locale) {
    var urls = [],_this=this;
    for (var url in _bundleFile) {
        if (_bundleFile[url][locale] !== true) {
            urls.push(url);
        }
    }
    if (urls.length > 0) {
        var _countLoad = urls.length,
            _callback = function () {
                _countLoad--;
                if(_countLoad===0){
                    _this.trigger('changeLocale', locale);
                }
            };
        _setLocale(locale);
        urls.forEach(function(url){
            _this.load(url,_callback)
        });
    } else {
        _setLocale(locale);
        this.trigger('changeLocale', locale);
    }
};
var eventCallback={};
/**
 * Bind event callback
 *
 * @param event {string} - name event
 * @param callback {function} - function callback
 */
I18n.prototype.on=function(event,callback){
    if('undefined' === typeof eventCallback[event]){
        eventCallback[event]={
            callback:[],
            callbackOnce:[]
        }
    }
    eventCallback[event].callback.push(callback);
};
/**
 * Bind once event callback
 *
 * @param event {string} - name event
 * @param callback {function} - function callback
 */
I18n.prototype.once=function(event,callback){
    if('undefined' === typeof eventCallback[event]){
        eventCallback[event]={
            callback:[],
            callbackOnce:[]
        }
    }
    eventCallback[event].callbackOnce.push(callback);
};
/**
 * Unbind event callback
 *
 * @param event {string} - name event
 * @param callback {function} - function callback
 */
I18n.prototype.off=function(event,callback){
    var _callback;
    if('function'===typeof callback){
        if(eventCallback[event].callback && eventCallback[event].callback.length>0){
            _callback=[];
            for(var i= 0; i<eventCallback[event].callback.length;i++){
                if('function' === typeof eventCallback[event].callback[i] && eventCallback[event].callback[i]!==callback){
                    _callback.push(eventCallback[event].callback[i])
                }
            }
            eventCallback[event].callback=_callback;
        }
        if(eventCallback[event].callbackOnce && eventCallback[event].callbackOnce.length>0){
            _callback=[];
            for(var i= 0; i<eventCallback[event].callbackOnce.length;i++){
                if('function' === typeof eventCallback[event].callbackOnce[i] && eventCallback[event].callbackOnce[i]!==callback){
                    _callback.push(eventCallback[event].callbackOnce[i])
                }
            }
            eventCallback[event].callbackOnce=_callback;
        }
    }else{
        delete eventCallback[event];
    }
};
/**
 * Trigger event
 *
 * @param event - name event
 * @example i18n.trigger('test',1,2,3....)
 */
I18n.prototype.trigger=function(event){
    if(eventCallback[event]){
        var args=[];
        for (var key in arguments){
            if(key!=0){
                args.push(arguments[key])
            }

        }
        if(eventCallback[event].callback && eventCallback[event].callback.length>0){

            for(var i= 0; i<eventCallback[event].callback.length;i++){
                if('function' === typeof eventCallback[event].callback[i]){
                    eventCallback[event].callback[i].apply(this,args)
                }
            }
        }
        if(eventCallback[event].callbackOnce && eventCallback[event].callbackOnce.length>0){
            for(var i= 0; i<eventCallback[event].callbackOnce.length;i++){
                if('function' === typeof eventCallback[event].callbackOnce[i]){
                    eventCallback[event].callbackOnce[i].apply(this,args)
                }
            }
            eventCallback[event].callbackOnce=[];
        }
    }
};


/**
 * Get translations
 *
 * @param key {string} - Key translation
 * @param params {object} - Params merge with translation messengers
 * @param options {object} - options translation
 * @param options.defaultValue {string} - default value translation (#8)
 * @event error - Not fount key translation  [this.trigger('error','error:translation:key',key,this.getLocale());]
 * @event error:translation:key - Not fount key translation  [this.trigger('error',key,this.getLocale());]
 * @return {string}
 */
I18n.prototype.get=function(key,params,options){
    var _text;
    if(_translations[this.getLocale()] && _translations[this.getLocale()][key]){
        _text=_translations[this.getLocale()][key];
        if('object'===typeof params){
            for (var paramKey in params){
                _text=_text.replace(new RegExp('{{[ ]{0,}'+paramKey+'[ ]{0,}}}','g'),params[paramKey])
            }
        }
        return _text;
    }else{
        this.trigger('error','error:translation:key',key,this.getLocale());
        this.trigger('error:translation:key',key,this.getLocale());
        if(_localeDefault && _translations[_localeDefault] && _translations[_localeDefault][key]){
            _text=_translations[_localeDefault][key];
            if('object'===typeof params){
                for (var paramKey in params){
                    _text=_text.replace(new RegExp('{{[ ]{0,}'+paramKey+'[ ]{0,}}}','g'),params[paramKey])
                }
            }
            return _text;
        }else{
            if(options && options.defaultValue){
                return options.defaultValue
            }
            if(_defaultValue){
                return _defaultValue;
            }
            return key;
        }
    }
};
/**
 * Get locale now
 *
 * @return {string}
 */
I18n.prototype.getLocale=function(){
    return _locale;
};
/**
 * Load translations JSON
 *
 * @param url {string} - url json file translations
 * @param callback {function} - callback function
 * @param options {object} - Dop options
 * @param options.modulePrefix {string} - You can set prefix url
 * @event load - load file json [this.trigger('load',url,{json}])]
 * @event error - error load json [this.trigger('error', 'error:load', xhr.statusText, xhr.status, xhr)]
 * @event error:load - error load json [this.trigger('error:load', xhr.statusText, xhr.status, xhr)]
 */
I18n.prototype.load=function(url,callback,options){
    var _last_locale=this.getLocale();
    options=options||{};
    if(options.modulePrefix && _modulePrefix[options.modulePrefix]){
        url=_modulePrefix[options.modulePrefix]+url;
    }
    if('undefined'===typeof _bundleFile[url]){
        _bundleFile[url]={};
    }
    /**
     *  load default locale
     */
    if('undefined'=== typeof _bundleFile[url][_localeDefault] && _last_locale!==_localeDefault){
        var xhr2 = new XMLHttpRequest(),
            _this = this;
        xhr2.open('GET', url + '.' + _localeDefault.toLowerCase() + '.json?'+this._versionJson, true);
        xhr2.send();

        xhr2.onreadystatechange = function () {

            if (xhr2.readyState != 4) return;
            if (xhr2.status != 200) {
                _this.trigger('error', 'error:load', xhr2.statusText, xhr2.status, xhr2);
                _this.trigger('error:load', xhr2.statusText, xhr2.status, xhr2);
            } else {
                var _json=JSON.parse(xhr2.responseText);
                _bundleFile[url][_localeDefault] = true;
                if('undefined'===typeof _translations[_localeDefault]){
                    _translations[_localeDefault]=_json;
                }else{
                    for (var key in _json){
                        if(!_translations[_localeDefault][key]) {
                            _translations[_localeDefault][key] = _json[key];
                        }
                    }
                }

            }

        };
    }
    /**
     * load active locale
     */
    if('undefined'=== typeof _bundleFile[url][_last_locale]) {
        var xhr = new XMLHttpRequest(),
            _this = this;
        xhr.open('GET', url + '.' + _last_locale.toLowerCase() + '.json?'+this._versionJson, true);
        xhr.send();

        xhr.onreadystatechange = function () {

            if (xhr.readyState != 4) return;
            if (xhr.status != 200) {
                _this.trigger('error', 'error:load', xhr.statusText, xhr.status, xhr);
                _this.trigger('error:load', xhr.statusText, xhr.status, xhr);
                if('function'===typeof callback){
                    callback()
                }
            } else {
                var _json=JSON.parse(xhr.responseText);
                _bundleFile[url][_last_locale] = true;
                if('undefined'===typeof _translations[_last_locale]){
                    _translations[_last_locale]=_json;
                }else{
                    for (var key in _json){
                        if(!_translations[_last_locale][key]) {
                            _translations[_last_locale][key] = _json[key];
                        }
                    }
                }
                _this.trigger('load', url,_bundleFile[url][_last_locale]);
                if('function'===typeof callback){
                    callback()
                }
            }

        };
    }else{
        if('function'===typeof callback){
            callback()
        }
    }


};
/**
 * Set locale now
 * @private
 * @return {string}
 */
var _setLocale=function(locale){
   _locale=locale;
};
/**
 * set property i18n
 *
 * @param params {object} params property
 * @param params.locale {string} location on
 * @param params.localeDefault {string} locale on default if key of main locale is empty
 * @param params.versionJson {string} versionJson add to url params load file translation
 * @param params.defaultValue {string} default value translation (#8)
 * @param params.modulePrefix {string} Prefix url to module
 */
I18n.prototype.setProperty=function(params){
    if(params.locale){
        _locale=params.locale
    }
    if(params.localeDefault){
        _localeDefault=params.localeDefault;
    }
    if(params.versionJson){
        this._versionJson=params.versionJson;
    }
    if(params.defaultValue){
        _defaultValue=params.defaultValue;
    }
    if(params.modulePrefix){
        _modulePrefix=params.modulePrefix;
    }

};
    return new I18n();
}));