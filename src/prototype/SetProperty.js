/**
 * set property i18n
 *
 * @param params {object} params property
 * @param params.locale {string} location on
 * @param params.localeDefault {string} locale on default if key of main locale is empty
 * @param params.versionJson {string} versionJson add to url params load file translation
 * @param params.defaultValue {string} default value translation (#8)
 * @param params.modulePrefix {string} Prefix url to module
 */
I18n.prototype.setProperty=function(params){
    if(params.locale){
        _locale=params.locale.toLowerCase()
    }
    if(params.localeDefault){
        _localeDefault=params.localeDefault.toLowerCase();
    }
    if(params.versionJson){
        this._versionJson=params.versionJson;
    }
    if(params.defaultValue){
        _defaultValue=params.defaultValue;
    }
    if(params.modulePrefix){
        _modulePrefix=params.modulePrefix;
    }

};