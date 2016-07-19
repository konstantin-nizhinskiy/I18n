/*
 * grunt-nks-i18n
 * https://github.com/konstantin-nizhinskiy/I18n
 *
 * Licensed under the MIT license.
 */

'use strict';

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

            cacheAllKeys={};

        if(options.cacheFile===true) {
            dirTmp = 'bak/' + grunt.template.today("yyyymmdd_HHmmss") + '/';
        }

        if(options.cache===true) {
            /**
             * Cache all keys project
             */
            options.locales.forEach(function (locale) {
                // cacheAllKeys[locale] = {};
                // if (grunt.file.isFile(options.cacheDir + 'cacheAllKeys.' + locale + '.json')) {
                //  cacheAllKeys[locale] = grunt.file.readJSON(options.cacheDir + 'cacheAllKeys.' + locale + '.json');
                // }
                cacheAllKeys[locale]=fileTranslation(options).get(options.cacheDir + 'cacheAllKeys.' + locale );
            });

        }

        /**
         * Find in all files translation keys
         */
        this.files.forEach( function ( file ) {
            var bundleKeysLast={},
                keys=[];//Key last find and already save in json

            file.src.forEach( function ( src ) {
                if ( grunt.file.isFile( src ) ) {
                    var fileContents = grunt.file.read( src),
                        reg= new RegExp(options.reg,'ig'),
                        myArray;
                    while ((myArray = reg.exec(fileContents)) !== null) {
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
                        //grunt.file.copy(file.dest+'.'+locale+'.json', options.cacheDir+dirTmp+file.dest+'.'+locale+'.json')
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
                                allKeys[locale] = {}
                            }
                            if ('undefined' === typeof allKeys[locale][key] || !allKeys[locale][key]) {
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
                //grunt.file.write(file.dest+'.'+locale+'.json',JSON.stringify(bundleKeys));

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
                    //grunt.file.write(options.cacheDir +bundleFile + fileRow +'/'+ locale + '.json',JSON.stringify(_files[fileRow]||{}));
                    fileTranslation(options).write(options.cacheDir +bundleFile + fileRow +'/'+ locale,_files[fileRow]);
                }
            }

            fileTranslation(options).write(options.cacheDir + 'cacheAllKeys.' + locale,allKeys[locale]);
            //grunt.file.write(options.cacheDir + 'cacheAllKeys.' + locale + '.json',JSON.stringify(allKeys[locale]||{}));
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
