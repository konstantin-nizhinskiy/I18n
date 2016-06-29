/**
 * Get translations
 *
 * @param key {string} - Key translation
 * @param params {object} - Params merge with translation messengers
 * @event error - Not fount key translation  [this.trigger('error','error:translation:key',key,this.getLocale());]
 * @event error:translation:key - Not fount key translation  [this.trigger('error',key,this.getLocale());]
 * @return {string}
 */
I18n.prototype.get=function(key,params){
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
            return key;
        }
    }
};