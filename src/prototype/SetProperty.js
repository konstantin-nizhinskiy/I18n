/**
 * set property i18n
 *
 * @param params {object} params property
 * @param params.locale {string} location on
 * @param params.localeDefault {string} locale on default if key of main locale is empty
 * @param params.versionJson {string} versionJson add to url params load file translation
 */
I18n.prototype.setProperty=function(params){
    if(params.locale){
        _locale=params.locale
    }
    if(params.localeDefault){
        _localeDefault=params.localeDefault;
    }
    if(params.versionJson){
        this._versionJson=params.versionJson;
    }

};