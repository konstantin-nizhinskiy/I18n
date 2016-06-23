/**
 * Change local
 *
 * @param local {string} - local (UA,EN)
  * @event error:translation:key - Not fount key translation
 * @return {string}
 */
I18n.prototype.changeLocal=function(local){
    if(this.translations[local]){
        this._local=local;
        this.trigger('changeLocal',local);
    }else{
        // Adding the script tag to the head as suggested before
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = this._translationUrl+'Translations.'+local+'.min.js';
        script.onload = (function(){
            this.trigger('changeLocal',local);
        }).bind(this);
        head.appendChild(script);
    }
};