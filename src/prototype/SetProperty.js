/**
 * set property i18n
 *
 * @param params {object} params property
 * @param params.local {string} location on
 * @param params.localDefault {string} local on default if key of main local is empty
 * @param params.translationUrl {string} translations url
 */
I18n.prototype.setProperty=function(params){
    if(params.local){
        this._local=params.local
    }
    if(params.localDefault){
        this._localDefault=params.localDefault;
    }
    if(params.translationUrl){
        this._translationUrl=params.translationUrl;
    }

};