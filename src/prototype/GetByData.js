/**
 * Get translations by data param set in function
 *
 * @param params {string|object} - params translation
 * @param options {object} - options translation
 * @param options.defaultValue {string} - default value translation (#8)
 * @return {string}
 */
I18n.prototype.getByData=function(params,options){
    if(params && (params[this.getLocale()]||params[this.getLocale().toUpperCase()]||params[_localeDefault])){
        return params[this.getLocale()]||params[this.getLocale().toUpperCase()]||params[_localeDefault]
    }else{
        if(options && options.defaultValue){
            return options.defaultValue
        }
        return params;
    }
};