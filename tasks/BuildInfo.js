var grunt = require ( 'grunt' );



module.exports = function () {
    var InfoBuild=function(options,keysLocaleBundle,allKeys){
        var tplContent,countKeys= 0,keysLocaleEmpty=[],tpl;
            tpl =
            '# Info last build translation \n' +
            '\n'+
            '#### Last build <%= time %> \n' +
            '\n'+
            '#### Count keys: <%= countKeys %> \n' +
            '\n' +
            '\n' +
            '### Count empty keys \n'+
            ' locale        | Count \n' +
            '--------------|-------------\n' +
            '<%  keysLocaleEmpty.forEach(function(row){ %>' +
            ' <%= row.locale %>           | <%= row.count %> \n' +
            '<% }) %>' +

            '\n' +

            '### Count keys by bundle: \n'+

            '<% for(var key in keysLocaleBundle){ %>' +
            '<% var row=keysLocaleBundle[key]; %>'+
            '\n' +
            ' * **<%= row.name %>**\n\n' +
            '     locale        | Count       |  Empty\n' +
            '    --------------|-------------|-------------\n' +
            '<%  row.locales.forEach(function(row2){ %>' +
            '     <%= row2.locale %>           | <%= row2.count %> | <%= row2.countEmpty %> \n' +
            '<% }) %>' +
            '<% } %>'+

            '\n' +

            '';
        for ( var key in allKeys){
            var localeEmpty={'locale':key,count:0,keys:0};
            for (var key2 in allKeys[key]){
                if(allKeys[key][key2]===''){
                    localeEmpty.count++;
                }
                localeEmpty.keys++;
            }
            keysLocaleEmpty.push(localeEmpty)
        }
        if(keysLocaleEmpty.length>0){
            countKeys=keysLocaleEmpty[0].keys;
        }
        tplContent=grunt.template.process(tpl,{
            data:{
                time:grunt.template.today("yyyy-mm-dd HH:mm:ss"),
                countKeys:countKeys,
                keysLocaleEmpty:keysLocaleEmpty,
                keysLocaleBundle:keysLocaleBundle

            }
        });
        grunt.file.write(options.cacheDir+'doc/InfoBuild.md',tplContent);
    };

    var AllKeysBuild=function(options,keysLocaleBundle,allKeys) {
        var tplContent, infoKeys = [], tpl;
        tpl =
            '# All keys translation \n' +
            '\n' +
            '#### Last build <%= time %> \n' +
            '\n' +
            '#### Count keys: <%= infoKeys.length %> \n' +
            '\n' +
            '\n' +
            '### All keys \n' +
            ' Keys                        | <%  locales.forEach(function(row){ %> <%= row %> | <% }) %>\n' +
            '-----------------------------|------<%  locales.forEach(function(row){ %>----|<% })%>\n' +
            '<%  infoKeys.forEach(function(keyRow){ %>' +
            ' <%= keyRow.key %> |<%  keyRow.localeProperty.forEach(function(row){ %> <%= row %> | <% }) %>\n' +
            '<% }) %>'+
            '\n' +
            '\n' +
            '### All keys value \n' +
            ' Keys                        | <%  locales.forEach(function(row){ %> <%= row %> | <% }) %>\n' +
            '-----------------------------|------<%  locales.forEach(function(row){ %>----|<% })%>\n' +
            '<%  infoKeys.forEach(function(keyRow){ %>' +
            ' <%= keyRow.key %> |<%  keyRow.localeValue.forEach(function(row){ %> <%= row %> | <% }) %>\n' +
            '<% }) %>'+

            '\n';
        if(options.locales.length>0){
            for (var key in allKeys[options.locales[0]]){
                var _infoKey={key:key,localeProperty:[],localeValue:[]};
                options.locales.forEach(function(locale){
                    if(allKeys[locale][key]=='' || !allKeys[locale][key]){
                        _infoKey.localeProperty.push(' - ');
                        _infoKey.localeValue.push('');
                    }else {
                        _infoKey.localeProperty.push(' + ');
                        _infoKey.localeValue.push(allKeys[locale][key]);
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
                locales: options.locales

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
    var AllKeysSizeBuild=function(options,keysLocaleBundle,allKeys) {
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
            ' Keys                        | <%  locales.forEach(function(row){ %> <%= row %> | <% }) %> Min size / Max size / Max diff |\n' +
            '-----------------------------|----<%  locales.forEach(function(row){ %>--|--<% }) %>--|\n' +
            '<%  infoKeys.forEach(function(keyRow){ %>' +
            ' <%= keyRow.key %> |<%  keyRow.localeSize.forEach(function(row,key){ %> <%= row %> / <%= keyRow.localeSizeDiff[key] %> (<%= keyRow.localeSizeDiffPercent[key] %> %) | <% }) %> <%= keyRow.minSize %> / <%= keyRow.maxSize %> / <%= keyRow.maxDiff %> |\n' +
            '<% }) %>'+
            '\n';
        if(options.locales.length>0){
            for (var key in allKeys[options.locales[0]]){
                var _infoKey={key:key,localeSize:[],localeSizeDiffPercent:[],localeSizeDiff:[],minSize:0,maxSize:0,maxDiff:0};

                options.locales.forEach(function(locale){
                    if(allKeys[locale][key]=='' || !allKeys[locale][key]){
                        _infoKey.localeSize.push(0);
                    }else {
                        _infoKey.localeSize.push(allKeys[locale][key].length);
                        if(allKeys[locale][key].length < _infoKey.minSize || _infoKey.minSize===0){
                            _infoKey.minSize=allKeys[locale][key].length;
                        }
                        if(allKeys[locale][key].length >_infoKey.maxSize){
                            _infoKey.maxSize=allKeys[locale][key].length;
                        }
                    }
                });
                _infoKey.localeSize.forEach(function(size){
                    if(size!==0){
                        _infoKey.localeSizeDiffPercent.push(((size*100)/_infoKey.minSize));
                        _infoKey.localeSizeDiff.push(size-_infoKey.minSize);

                        if(_infoKey.maxDiff < (size-_infoKey.minSize)){
                            _infoKey.maxDiff=size-_infoKey.minSize;
                        }
                    }else{
                        _infoKey.localeSizeDiffPercent.push(0);
                        _infoKey.localeSizeDiff.push(0);
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
                locales: options.locales

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