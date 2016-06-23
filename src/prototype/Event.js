var eventCallback={};
/**
 * Bind event callback
 *
 * @param event {string} - name event
 * @param callback {function} - function callback
 */
I18n.prototype.on=function(event,callback){
    if('undefined' === typeof eventCallback[event]){
        eventCallback[event]={
            callback:[],
            callbackOnce:[]
        }
    }
    eventCallback[event].callback.push(callback);
};
/**
 * Bind once event callback
 *
 * @param event {string} - name event
 * @param callback {function} - function callback
 */
I18n.prototype.once=function(event,callback){
    if('undefined' === typeof eventCallback[event]){
        eventCallback[event]={
            callback:[],
            callbackOnce:[]
        }
    }
    eventCallback[event].callbackOnce.push(callback);
};
/**
 * Unbind event callback
 *
 * @param event {string} - name event
 * @param callback {function} - function callback
 */
I18n.prototype.off=function(event,callback){
    var _callback;
    if('function'===typeof callback){
        if(eventCallback[event].callback && eventCallback[event].callback.length>0){
            _callback=[];
            for(var i= 0; i<eventCallback[event].callback.length;i++){
                if('function' === typeof eventCallback[event].callback[i] && eventCallback[event].callback[i]!==callback){
                    _callback.push(eventCallback[event].callback[i])
                }
            }
            eventCallback[event].callback=_callback;
        }
        if(eventCallback[event].callbackOnce && eventCallback[event].callbackOnce.length>0){
            _callback=[];
            for(var i= 0; i<eventCallback[event].callbackOnce.length;i++){
                if('function' === typeof eventCallback[event].callbackOnce[i] && eventCallback[event].callbackOnce[i]!==callback){
                    _callback.push(eventCallback[event].callbackOnce[i])
                }
            }
            eventCallback[event].callbackOnce=_callback;
        }
    }else{
        delete eventCallback[event];
    }
};
/**
 * Trigger event
 *
 * @param event - name event
 * @example i18n.trigger('test',1,2,3....)
 */
I18n.prototype.trigger=function(event){
    if(eventCallback[event]){
        var args=[];
        for (var key in arguments){
            if(key!=0){
                args.push(arguments[key])
            }

        }
        if(eventCallback[event].callback && eventCallback[event].callback.length>0){

            for(var i= 0; i<eventCallback[event].callback.length;i++){
                if('function' === typeof eventCallback[event].callback[i]){
                    eventCallback[event].callback[i].apply(this,args)
                }
            }
        }
        if(eventCallback[event].callbackOnce && eventCallback[event].callbackOnce.length>0){
            for(var i= 0; i<eventCallback[event].callbackOnce.length;i++){
                if('function' === typeof eventCallback[event].callbackOnce[i]){
                    eventCallback[event].callbackOnce[i].apply(this,args)
                }
            }
            eventCallback[event].callbackOnce=[];
        }
    }
};

