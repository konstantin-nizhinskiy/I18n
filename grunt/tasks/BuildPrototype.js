
"use strict";
var path = require('path'),
    grunt = require('grunt');
grunt.task.registerTask('buildPrototype','build prototype',function(){
    var prototype=[''];
    grunt.file.recurse('src/prototype', function (a) {
        prototype.push(grunt.file.read(a));
    });
    grunt.file.write('dist/I18n.js',grunt.template.process(
        grunt.file.read('src/I18n.js'),
        {
            data:{
                prototype:prototype.join('\n')
            }
        }));

});