/*
name: nks-i18n
version: 0.9.0
author: Konstantin Nizhinskiy
date: 2016-06-29 11:06:10 

*/
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('i18n', [], function () {
            return root.i18n = factory()
        })
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
                local: 'UA',
                localDefault: 'UA',
                versionJson: +new Date()
            });
        },
        /**
         *
         * @type {string} - local active now
         * @private
         */
        _local='UA',
        /**
         *
         * @type {string} - default local active now
         * @private
         */
        _localDefault='UA',
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
    // 
/**
 * Change local
 *
 * @param local {string} - local (UA,EN...)
 * @event changeLocal - event change local
 * @return {string}
 */
I18n.prototype.changeLocal = function (local) {
    var urls = [],_this=this;
    for (var url in _bundleFile) {
        if (_bundleFile[url][local] !== true) {
            urls.push(url);
        }
    }
    if (urls.length > 0) {
        var _countLoad = urls.length,
            _callback = function () {
                _countLoad--;
                if(_countLoad===0){
                    _this.trigger('changeLocal', local);
                }
            };
        _setLocal(local);
        urls.forEach(function(url){
            _this.load(url,_callback)
        });
    } else {
        _setLocal(local);
        this.trigger('changeLocal', local);
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
 * @event error - Not fount key translation  [this.trigger('error','error:translation:key',key,this.getLocal());]
 * @event error:translation:key - Not fount key translation  [this.trigger('error',key,this.getLocal());]
 * @return {string}
 */
I18n.prototype.get=function(key,params){
    var _text;
    if(_translations[this.getLocal()] && _translations[this.getLocal()][key]){
        _text=_translations[this.getLocal()][key];
        if('object'===typeof params){
            for (var paramKey in params){
                _text=_text.replace(new RegExp('{{[ ]{0,}'+paramKey+'[ ]{0,}}}','g'),params[paramKey])
            }
        }
        return _text;
    }else{
        this.trigger('error','error:translation:key',key,this.getLocal());
        this.trigger('error:translation:key',key,this.getLocal());
        if(_localDefault && _translations[_localDefault] && _translations[_localDefault][key]){
            _text=_translations[_localDefault][key];
            if('object'===typeof params){
                for (var paramKey in params){
                    _text=_text.replace(new RegExp('{{[ ]{0,}'+paramKey+'[ ]{0,}}}','g'),params[paramKey])
                }
            }
            return _text;
        }else{
            return key;
        }
    }
};
/**
 * Get local now
 *
 * @return {string}
 */
I18n.prototype.getLocal=function(){
    return _local;
};
/**
 * Load translations JSON
 *
 * @param url {string} - url json file translations
 * @param callback {function} - callback function
 * @event load - load file json [this.trigger('load',url,{json}])]
 * @event error - error load json [this.trigger('error', 'error:load', xhr.statusText, xhr.status, xhr)]
 * @event error:load - error load json [this.trigger('error:load', xhr.statusText, xhr.status, xhr)]
 */
I18n.prototype.load=function(url,callback){

    if('undefined'===typeof _bundleFile[url]){
        _bundleFile[url]={};
    }
    if('undefined'=== typeof _bundleFile[url][this.getLocal()]) {
        var xhr = new XMLHttpRequest(),
            _this = this;
        xhr.open('GET', url + '.' + this.getLocal().toLowerCase() + '.json?'+this._versionJson, true);
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
                _bundleFile[url][_this.getLocal()] = true;
                if('undefined'===typeof _translations[_this.getLocal()]){
                    _translations[_this.getLocal()]=_json;
                }else{
                    for (var key in _json){
                        if(!_translations[_this.getLocal()][key]) {
                            _translations[_this.getLocal()][key] = _json[key];
                        }
                    }
                }
                _this.trigger('load', url,_bundleFile[url][_this.getLocal()]);
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
 * Set local now
 * @private
 * @return {string}
 */
var _setLocal=function(local){
   _local=local;
};
/**
 * set property i18n
 *
 * @param params {object} params property
 * @param params.local {string} location on
 * @param params.localDefault {string} local on default if key of main local is empty
 * @param params.versionJson {string} versionJson add to url params load file translation
 */
I18n.prototype.setProperty=function(params){
    if(params.local){
        _local=params.local
    }
    if(params.localDefault){
        _localDefault=params.localDefault;
    }
    if(params.versionJson){
        this._versionJson=params.versionJson;
    }

};
    return new I18n();
}));