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
    if('undefined'=== typeof _bundleFile[url][this.getLocale()]) {
        var xhr = new XMLHttpRequest(),
            _this = this;
        xhr.open('GET', url + '.' + this.getLocale().toLowerCase() + '.json?'+this._versionJson, true);
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
                _bundleFile[url][_this.getLocale()] = true;
                if('undefined'===typeof _translations[_this.getLocale()]){
                    _translations[_this.getLocale()]=_json;
                }else{
                    for (var key in _json){
                        if(!_translations[_this.getLocale()][key]) {
                            _translations[_this.getLocale()][key] = _json[key];
                        }
                    }
                }
                _this.trigger('load', url,_bundleFile[url][_this.getLocale()]);
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