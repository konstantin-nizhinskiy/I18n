/**
 * set translation data i18n
 *
 * @param data {object} Object translation
 * @param locale {string} location
 */
I18n.prototype.setTranslation=function(data,locale){
    if(!_translations[locale]){
        _translations[locale]=data;
    }else{
        for (var key in data) {
            if (!_translations[locale][key]) {
                _translations[locale][key] = data[key];
            }
        }
    }


};