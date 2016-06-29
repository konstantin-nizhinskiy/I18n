var grunt = require ( 'grunt' );



module.exports = function () {
    var InfoBuild=function(options,keysLocalBundle,allKeys){
        var tplContent,countKeys= 0,keysLocalEmpty=[],tpl;
            tpl =
            '# Info last build translation \n' +
            '\n'+
            '#### Last build <%= time %> \n' +
            '\n'+
            '#### Count keys: <%= countKeys %> \n' +
            '\n' +
            '\n' +
            '### Count empty keys \n'+
            ' local        | Count \n' +
            '--------------|-------------\n' +
            '<%  keysLocalEmpty.forEach(function(row){ %>' +
            ' <%= row.local %>           | <%= row.count %> \n' +
            '<% }) %>' +

            '\n' +

            '### Count keys by bundle: \n'+

            '<% for(var key in keysLocalBundle){ %>' +
            '<% var row=keysLocalBundle[key]; %>'+
            '\n' +
            ' * **<%= row.name %>**\n\n' +
            '     local        | Count       |  Empty\n' +
            '    --------------|-------------|-------------\n' +
            '<%  row.locals.forEach(function(row2){ %>' +
            '     <%= row2.local %>           | <%= row2.count %> | <%= row2.countEmpty %> \n' +
            '<% }) %>' +
            '<% } %>'+

            '\n' +

            '';
        for ( var key in allKeys){
            var localEmpty={'local':key,count:0,keys:0};
            for (var key2 in allKeys[key]){
                if(allKeys[key][key2]===''){
                    localEmpty.count++;
                }
                localEmpty.keys++;
            }
            keysLocalEmpty.push(localEmpty)
        }
        if(keysLocalEmpty.length>0){
            countKeys=keysLocalEmpty[0].keys;
        }
        tplContent=grunt.template.process(tpl,{
            data:{
                time:grunt.template.today("yyyy-mm-dd HH:mm:ss"),
                countKeys:countKeys,
                keysLocalEmpty:keysLocalEmpty,
                keysLocalBundle:keysLocalBundle

            }
        });
        grunt.file.write(options.cacheDir+'doc/InfoBuild.md',tplContent);
    };

    var AllKeysBuild=function(options,keysLocalBundle,allKeys) {
        var tplContent, countKeys = 0, infoKeys = [], tpl;
        tpl =
            '# All keys translation \n' +
            '\n' +
            '#### Last build <%= time %> \n' +
            '\n' +
            '#### Count keys: <%= infoKeys.length %> \n' +
            '\n' +
            '\n' +
            '### All keys \n' +
            ' Keys                        | <%  locals.forEach(function(row){ %> <%= row %> | <% }) %>\n' +
            '-----------------------------|-------------\n' +
            '<%  infoKeys.forEach(function(keyRow){ %>' +
            ' <%= keyRow.key %> |<%  keyRow.localProperty.forEach(function(row){ %> <%= row %> | <% }) %>\n' +
            '<% }) %>'+
            '\n' +
            '\n' +
            '### All keys value \n' +
            ' Keys                        | <%  locals.forEach(function(row){ %> <%= row %> | <% }) %>\n' +
            '-----------------------------|-------------\n' +
            '<%  infoKeys.forEach(function(keyRow){ %>' +
            ' <%= keyRow.key %> |<%  keyRow.localValue.forEach(function(row){ %> <%= row %> | <% }) %>\n' +
            '<% }) %>'+

            '\n';
        if(options.locals.length>0){
            for (var key in allKeys[options.locals[0]]){
                var _infoKey={key:key,localProperty:[],localValue:[]};
                options.locals.forEach(function(local){
                    if(allKeys[local][key]=='' || !allKeys[local][key]){
                        _infoKey.localProperty.push(' - ');
                        _infoKey.localValue.push('');
                    }else {
                        _infoKey.localProperty.push(' + ');
                        _infoKey.localValue.push(allKeys[local][key]);
                    }
                });
                infoKeys.push(_infoKey)
            }

        }
        infoKeys.sort(function (a, b) {
            if (a.key > b.key) {
                return 1;
            }
            if (a.key < b.key) {
                return -1;
            }
            // a должно быть равным b
            return 0;
        });
        tplContent = grunt.template.process(tpl, {
            data: {
                time: grunt.template.today("yyyy-mm-dd HH:mm:ss"),
                infoKeys: infoKeys,
                locals: options.locals

            }
        });
        grunt.file.write(options.cacheDir + 'doc/AllKeys.md', tplContent);
    };
    var AllKeysFileBuild=function(options,allKeysFiles) {
        var tplContent, tpl;
        tpl =
            '# All keys file \n' +
            '\n' +
            '#### Last build <%= time %> \n' +
            '\n' +
            '\n' +
            '### All keys \n' +
            '<% for(var key in allKeysFiles){ %>' +
            ' * <%= key %> \n' +
            '<%  allKeysFiles[key].forEach(function(file){ %>' +
            '       * <%= file %> \n' +
            '<% }) %>' +
            '<% } %>'+
            '\n';

        tplContent = grunt.template.process(tpl, {
            data: {
                time: grunt.template.today("yyyy-mm-dd HH:mm:ss"),
                allKeysFiles: allKeysFiles

            }
        });
        grunt.file.write(options.cacheDir + 'doc/AllKeysFileBuild.md', tplContent);
    };
    var AllKeysSizeBuild=function(options,keysLocalBundle,allKeys) {
        var tplContent, infoKeys = [], tpl;
        tpl =
            '# All keys size translation \n' +
            '\n' +
            '#### Last build <%= time %> \n' +
            '\n' +
            '#### Count keys: <%= infoKeys.length %> \n' +
            '\n' +
            '\n' +
            '### All keys \n' +
            ' Keys                        | <%  locals.forEach(function(row){ %> <%= row %> | <% }) %> Min size / Max size / Max diff |\n' +
            '-----------------------------|-------------\n' +
            '<%  infoKeys.forEach(function(keyRow){ %>' +
            ' <%= keyRow.key %> |<%  keyRow.localSize.forEach(function(row,key){ %> <%= row %> / <%= keyRow.localSizeDiff[key] %> (<%= keyRow.localSizeDiffPercent[key] %> %) | <% }) %> <%= keyRow.minSize %> / <%= keyRow.maxSize %> / <%= keyRow.maxDiff %> |\n' +
            '<% }) %>'+
            '\n';
        if(options.locals.length>0){
            for (var key in allKeys[options.locals[0]]){
                var _infoKey={key:key,localSize:[],localSizeDiffPercent:[],localSizeDiff:[],minSize:0,maxSize:0,maxDiff:0};

                options.locals.forEach(function(local){
                    if(allKeys[local][key]=='' || !allKeys[local][key]){
                        _infoKey.localSize.push(0);
                    }else {
                        _infoKey.localSize.push(allKeys[local][key].length);
                        if(allKeys[local][key].length < _infoKey.minSize || _infoKey.minSize===0){
                            _infoKey.minSize=allKeys[local][key].length;
                        }
                        if(allKeys[local][key].length >_infoKey.maxSize){
                            _infoKey.maxSize=allKeys[local][key].length;
                        }
                    }
                });
                _infoKey.localSize.forEach(function(size){
                    if(size!==0){
                        _infoKey.localSizeDiffPercent.push(((size*100)/_infoKey.minSize));
                        _infoKey.localSizeDiff.push(size-_infoKey.minSize);

                        if(_infoKey.maxDiff < (size-_infoKey.minSize)){
                            _infoKey.maxDiff=size-_infoKey.minSize;
                        }
                    }else{
                        _infoKey.localSizeDiffPercent.push(0);
                        _infoKey.localSizeDiff.push(0);
                    }
                });
                infoKeys.push(_infoKey)
            }

        }
        infoKeys.sort(function (a, b) {
            if (a.maxDiff < b.maxDiff) {
                return 1;
            }
            if (a.maxDiff > b.maxDiff) {
                return -1;
            }
            // a должно быть равным b
            return 0;
        });
        tplContent = grunt.template.process(tpl, {
            data: {
                time: grunt.template.today("yyyy-mm-dd HH:mm:ss"),
                infoKeys: infoKeys,
                locals: options.locals

            }
        });
        grunt.file.write(options.cacheDir + 'doc/AllKeysSize.md', tplContent);
    };
    return{
        infoBuild:InfoBuild,
        allKeysBuild:AllKeysBuild,
        allKeysSizeBuild:AllKeysSizeBuild,
        allKeysFileBuild:AllKeysFileBuild
    }
};