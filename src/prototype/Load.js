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