/**
 * Change locale
 *
 * @param locale {string} - locale (UA,EN...)
 * @param callback {function} - callback on success change locale
 * @event changeLocale - event change locale
 * @return {string}
 */
I18n.prototype.changeLocale = function (locale,callback) {
    locale=locale.toLowerCase();
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
                    if("function"===typeof callback){
                        callback()
                    }
                    _this.trigger('changeLocale', locale);
                }
            };
        _setLocale(locale);
        urls.forEach(function(url){
            _this.load(url,_callback)
        });
    } else {
        _setLocale(locale);
        if("function"===typeof callback){
            callback()
        }
        this.trigger('changeLocale', locale);
    }
};