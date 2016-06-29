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