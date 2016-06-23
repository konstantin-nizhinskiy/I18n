"use strict";
var path = require('path'),
    grunt = require('grunt');
module.exports = {
    usebanner: {
        i18n: {
            options: {
                position: 'top',
                banner: '/*<%= banner %>*/',
                linebreak: true
            },
            files: {
                src: [
                    'dist/*.js'

                ]
            }
        }
    }
};