(function(root,factory){
    if(typeof define ==='function' && define.amd){
        define('i18n',[],function(){
            return root.i18n=factory()
        })
    }else{
        root.i18n=factory();
    }
}(this,function(){
    var I18n=function(){
        this.translations={};
        this.setProperty({
            local:'UA',
            localDefault:'UA',
            translationUrl:'/js/translations/'
        });
    };
    // <%= prototype %>
    return new I18n();
}));