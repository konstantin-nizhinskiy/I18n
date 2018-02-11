/*
 * grunt-nks-i18n
 * https://github.com/konstantin-nizhinskiy/I18n
 *
 * Licensed under the MIT license.
 */

'use strict';
String.prototype.replaceAll = function( token, newToken, ignoreCase ) {
    var _token;
    var str = this + "";
    var i = -1;

    if ( typeof token === "string" ) {

        if ( ignoreCase ) {

            _token = token.toLowerCase();

            while( (
                i = str.toLowerCase().indexOf(
                    _token, i >= 0 ? i + newToken.length : 0
                ) ) !== -1
                ) {
                str = str.substring( 0, i ) +
                    newToken +
                    str.substring( i + token.length );
            }

        } else {
            return this.split( token ).join( newToken );
        }

    }
    return str;
};
var chalk = require ( 'chalk'),
    buildInfo=require ('./BuildInfo'),
    fileTranslation=require ('./FileTranslation'),
    allKeys={},
    bundleKeysFiles={},
    _allKeysFiles={};

module.exports = function ( grunt ) {


    grunt.registerMultiTask( 'i18n', 'Adds a banner or a footer to a file', function () {
        // Set up defaults for the options hash
        var options = this.options({
            typeTranslation: 'json',
            locales:['en'],
            cache:true,
            template_build:false,
            template_build_dir:{},
            cacheFile:false,
            bundleFile:true,
            cacheDir:'cache/i18n/',
            buildDoc:true,
            loadJsTranslation:
            "if (typeof define === 'function' && define.amd) {"+
            "define(['i18n'], function (i18n) {"+
            "return i18n.setTranslation(factory())"+
            "})"+
            "} else {"+
            "i18n.setTranslation(factory());"+
            "}",
            reg:'(i18n\\.get\\([ ]{0,}[\'"])([A-Za-z.]+)([\'"])'

        });

        var dirTmp,
            bundleFile='bundleFile/',
            template_build_file={},
            cacheAllKeys={};

        if(options.cacheFile===true) {
            dirTmp = 'bak/' + grunt.template.today("yyyymmdd_HHmmss") + '/';
        }

        if(options.cache===true) {
            /**
             * Cache all keys project
             */
            options.locales.forEach(function (locale) {
                cacheAllKeys[locale]=fileTranslation(options).get(options.cacheDir + 'cacheAllKeys.' + locale );
            });

        }
        /**
         * Find in all files translation keys
         */
        this.files.forEach( function ( file ) {
            var bundleKeysLast={},
                keys=[];//Key last find and already save in json
            if(options.template_build==true){
                if(!template_build_file[file.dest]){
                    template_build_file[file.dest]={
                        keys:{},
                        file_name:{}
                    }
                }
            }
            file.src.forEach( function ( src ) {
                if ( grunt.file.isFile( src ) ) {
                    var fileContents = grunt.file.read( src),
                        reg= new RegExp(options.reg,'ig'),
                        myArray;
                    if(options.template_build==true){
                        template_build_file[file.dest].file_name[src.split("/").pop()]=fileContents;
                    }

                    while ((myArray = reg.exec(fileContents)) !== null) {
                        if(options.template_build==true){
                            template_build_file[file.dest].keys[myArray[2]]=myArray.input.substring(myArray.index,myArray.input.indexOf(")",myArray.index)+1)
                        }
                        keys.push(myArray[2]);
                        if('undefined'===typeof _allKeysFiles[myArray[2]]){
                            _allKeysFiles[myArray[2]]={
                                files:[],
                                value:{}
                            };
                        }
                        if(_allKeysFiles[myArray[2]].files.indexOf(src)<0){
                            _allKeysFiles[myArray[2]].files.push(src);
                        }

                    }

                }
            });
            if('undefined'=== typeof bundleKeysFiles[file.dest]) {
                bundleKeysFiles[file.dest] = {
                    name: file.dest,
                    locales: []
                };
            }
            options.locales.forEach(function(locale){
                var bundleKeys={},//Keys find in bundle
                    countEmpty= 0,
                    count=0;
                if ( fileTranslation(options).isFile(file.dest+'.'+locale)) {
                    bundleKeysLast=fileTranslation(options).get(file.dest+'.'+locale);
                    /**
                     * Cache file bundle
                     */
                    if(options.cache === true && options.cacheFile === true){

                        fileTranslation(options).copy(file.dest+'.'+locale,options.cacheDir+dirTmp+file.dest+'.'+locale);
                    }

                }

                keys.forEach(function(key){
                    if('undefined' === typeof bundleKeys[keys]) {
                        if (bundleKeysLast[key]) {
                            bundleKeys[key] = bundleKeysLast[key];
                        } else if (options.cache === true && cacheAllKeys[locale][key]) {
                            bundleKeys[key] = cacheAllKeys[locale][key];
                        } else {
                            bundleKeys[key] = "";
                        }
                        if (options.cache === true) {
                            if ('undefined' === typeof allKeys[locale]) {
                                allKeys[locale] = cacheAllKeys[locale]||{}
                            }
                            if ('undefined' === typeof allKeys[locale][key] || bundleKeys[key] || !allKeys[locale][key]) {
                                allKeys[locale][key] = bundleKeys[key];
                            }
                        }
                        if(_allKeysFiles && _allKeysFiles[key]) {
                            _allKeysFiles[key].value[locale] = bundleKeys[key];
                        }
                        count++;
                        if(bundleKeys[key]===''){
                            countEmpty++
                        }
                    }
                });

                bundleKeysFiles[file.dest].locales.push({
                    locale:locale,
                    count:count,
                    countEmpty:countEmpty
                });
                fileTranslation(options).write(file.dest+'.'+locale,bundleKeys);
               });



        });
        options.locales.forEach(function(locale){
            if(options.bundleFile===true){
                var _files={};
                for(var key in _allKeysFiles){
                    //_file[]

                    _allKeysFiles[key].files.forEach(function(fileRow){
                        if('undefined' === typeof _files[fileRow]){
                            _files[fileRow]={}
                        }
                        _files[fileRow][key]=_allKeysFiles[key].value[locale];
                    });

                }

                for(var fileRow in _files){
                    fileTranslation(options).write(options.cacheDir +bundleFile + fileRow +'/'+ locale,_files[fileRow]);
                }
            }
            fileTranslation(options).write(options.cacheDir + 'cacheAllKeys.' + locale,allKeys[locale]);
            if(options.template_build==true){

                for (var t_key in template_build_file){

                    for(var file_name in template_build_file[t_key].file_name){
                        var file_content=template_build_file[t_key].file_name[file_name]
                        for(var file_name_keys in template_build_file[t_key].keys){
                            file_content=file_content.replaceAll(template_build_file[t_key].keys[file_name_keys],allKeys[locale][file_name_keys]||file_name_keys)
                        }
                        if (!options.template_build_dir[t_key]){
                            console.log("options template_build_dir not you set" ,t_key)
                            return
                        }
                        grunt.file.write(options.template_build_dir[t_key]+"/"+locale+"/"+file_name,file_content);

                    }

                }

            }
        });
        if(options.buildDoc===true) {
            buildInfo().infoBuild(options, bundleKeysFiles, allKeys);
            buildInfo().allKeysBuild(options, bundleKeysFiles, allKeys);
            buildInfo().allKeysSizeBuild(options, bundleKeysFiles, allKeys);
            buildInfo().allKeysFileBuild(options, _allKeysFiles);
        }
        grunt.log.writeln( chalk.green( '\u221A' ) + ' grunt-nks-i18n completed successfully' );

    });

};
