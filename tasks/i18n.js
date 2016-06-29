/*
 * grunt-nks-i18n
 * https://github.com/konstantin-nizhinskiy/I18n
 *
 * Licensed under the MIT license.
 */

'use strict';

var chalk = require ( 'chalk'),
    buildInfo=require ('./BuildInfo');

module.exports = function ( grunt ) {


    grunt.registerMultiTask( 'i18n', 'Adds a banner or a footer to a file', function () {
        // Set up defaults for the options hash
        var options = this.options({
            type: 'js',
            locales:['en'],
            cache:true,
            cacheDir:'cache/i18n/',
            buildDoc:true,
            reg:'(i18n\\.get\\([ ]{0,}[\'"])([A-Za-z.]+)([\'"])'

        });


        var dirTmp='bak/'+grunt.template.today("yyyymmdd_HHmmss")+'/',
            allKeys={},
            allKeysFiles={},
            bundleKeysFiles={},
            cacheAllKeys={};

        if(options.cache===true) {
            /**
             * Cache all keys project
             */
            options.locales.forEach(function (locale) {
                cacheAllKeys[locale] = {};
                if (grunt.file.isFile(options.cacheDir + 'cacheAllKeys.' + locale + '.json')) {
                    cacheAllKeys[locale] = grunt.file.readJSON(options.cacheDir + 'cacheAllKeys.' + locale + '.json');
                }
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
                        if('undefined'===typeof allKeysFiles[myArray[2]]){
                            allKeysFiles[myArray[2]]=[];
                        }
                        if(allKeysFiles[myArray[2]].indexOf(src)<0){
                            allKeysFiles[myArray[2]].push(src);
                        }

                    }

                }
            });


            bundleKeysFiles[file.dest]={
                name:file.dest,
                locales:[]
            };
            options.locales.forEach(function(locale){
                var bundleKeys={},//Keys find in bundle
                    countEmpty= 0,
                    count=0;
                if ( grunt.file.isFile( file.dest+'.'+locale+'.json' ) ) {
                    bundleKeysLast=grunt.file.readJSON(file.dest+'.'+locale+'.json');
                    /**
                     * Cache file bundle
                     */
                    if(options.cache){
                        grunt.file.copy(file.dest+'.'+locale+'.json', options.cacheDir+dirTmp+file.dest+'.'+locale+'.json')
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
                grunt.file.write(file.dest+'.'+locale+'.json',JSON.stringify(bundleKeys));

            });



        });

        options.locales.forEach(function(locale){
            grunt.file.write(options.cacheDir + 'cacheAllKeys.' + locale + '.json',JSON.stringify(allKeys[locale]||{}));
        });
        if(options.buildDoc===true) {
            buildInfo().infoBuild(options, bundleKeysFiles, allKeys);
            buildInfo().allKeysBuild(options, bundleKeysFiles, allKeys);
            buildInfo().allKeysSizeBuild(options, bundleKeysFiles, allKeys);
            buildInfo().allKeysFileBuild(options, allKeysFiles);
        }
        grunt.log.writeln( chalk.green( '\u221A' ) + ' grunt-nks-i18n completed successfully' );

    });

};
