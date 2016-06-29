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
            locals:['en'],
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
            options.locals.forEach(function (local) {
                cacheAllKeys[local] = {};
                if (grunt.file.isFile(options.cacheDir + 'cacheAllKeys.' + local + '.json')) {
                    cacheAllKeys[local] = grunt.file.readJSON(options.cacheDir + 'cacheAllKeys.' + local + '.json');
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
                locals:[]
            };
            options.locals.forEach(function(local){
                var bundleKeys={},//Keys find in bundle
                    countEmpty= 0,
                    count=0;
                if ( grunt.file.isFile( file.dest+'.'+local+'.json' ) ) {
                    bundleKeysLast=grunt.file.readJSON(file.dest+'.'+local+'.json');
                    /**
                     * Cache file bundle
                     */
                    if(options.cache){
                        grunt.file.copy(file.dest+'.'+local+'.json', options.cacheDir+dirTmp+file.dest+'.'+local+'.json')
                    }

                }

                keys.forEach(function(key){
                    if('undefined' === typeof bundleKeys[keys]) {
                        if (bundleKeysLast[key]) {
                            bundleKeys[key] = bundleKeysLast[key];
                        } else if (options.cache === true && cacheAllKeys[local][key]) {
                            bundleKeys[key] = cacheAllKeys[local][key];
                        } else {
                            bundleKeys[key] = "";
                        }
                        if (options.cache === true) {
                            if ('undefined' === typeof allKeys[local]) {
                                allKeys[local] = {}
                            }
                            if ('undefined' === typeof allKeys[local][key] || !allKeys[local][key]) {
                                allKeys[local][key] = bundleKeys[key];
                            }

                        }
                        count++;
                        if(bundleKeys[key]===''){
                            countEmpty++
                        }
                    }
                });

                bundleKeysFiles[file.dest].locals.push({
                    local:local,
                    count:count,
                    countEmpty:countEmpty
                });
                grunt.file.write(file.dest+'.'+local+'.json',JSON.stringify(bundleKeys));

            });



        });

        options.locals.forEach(function(local){
            grunt.file.write(options.cacheDir + 'cacheAllKeys.' + local + '.json',JSON.stringify(allKeys[local]||{}));
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
