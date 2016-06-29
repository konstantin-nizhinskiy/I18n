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