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