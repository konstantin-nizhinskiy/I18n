/**
 * Get translations
 *
 * @param key {string} - Key translation
 * @param params {object} - Params merge with translation messengers
 * @event error:translation:key - Not fount key translation
 * @return {string}
 */
I18n.prototype.get=function(key,params){
    var _translation;
    if(this.translations[this._local] && this.translations[this._local][key]){
        _translation=this.translations[this._local][key];
        if('object'===typeof params){
            for (var paramKey in params){
                _translation=_translation.replace(new RegExp('{{[ ]{0,}'+paramKey+'[ ]{0,}}}','g'),params[paramKey])
            }
        }
        return _translation;
    }else{
        this.trigger('error:translation:key','not fount key translation',this._local);
        if(this._localDefault && this.translations[this._localDefault] && this.translations[this._localDefault][key]){
            _translation=this.translations[this._localDefault][key];
            if('object'===typeof params){
                for (var paramKey in params){
                    _translation=_translation.replace(new RegExp('{{[ ]{0,}'+paramKey+'[ ]{0,}}}','g'),params[paramKey])
                }
            }
        }else{
            return key;
        }
    }
};