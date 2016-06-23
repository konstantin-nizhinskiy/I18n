
"use strict";
var path = require('path'),
    grunt = require('grunt');
module.exports = {
    i18n: {
        options: {
            compress: {
                drop_console: true
            }
        },
        i18n: {
            files: {
                'dist/i18n.min.js':[
                    'dist/i18n.js'
                ]



            }
        }
    }
};