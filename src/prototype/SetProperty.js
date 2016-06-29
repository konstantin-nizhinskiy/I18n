/**
 * set property i18n
 *
 * @param params {object} params property
 * @param params.local {string} location on
 * @param params.localDefault {string} local on default if key of main local is empty
 * @param params.versionJson {string} versionJson add to url params load file translation
 */
I18n.prototype.setProperty=function(params){
    if(params.local){
        _local=params.local
    }
    if(params.localDefault){
        _localDefault=params.localDefault;
    }
    if(params.versionJson){
        this._versionJson=params.versionJson;
    }

};