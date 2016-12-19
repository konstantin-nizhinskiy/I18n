I18n
====
 * [download](#download)
 * [Loader supports](#loader-supports)
 * [config](#config)
 * [build json translation](#build-json-translation)
 * [methods](#methods)
 * [events](#events)
 * [example](#example)
 
    
## Download
```sh
  $ bower install nks-i18n;
  $ git clone https://github.com/konstantin-nizhinskiy/I18n.git;
```

## Build json translation

### Getting Started
   
If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:
   
```shell
    npm install grunt-nks-i18n --save-dev
```
   
Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:
   
```js
   grunt.loadNpmTasks('grunt-nks-i18n');
```
   
### i18n task
_Run this task with the `grunt i18n` command._
 
Task targets, files and options may be specified according to the grunt [Configuring tasks](http://gruntjs.com/configuring-tasks) guide.
   
### Options

#### locales 
Type: `Array`  
Default: `['en']`

Specify the location you want to create

#### cache 
Type: `Boolean`  
Default: `true`

Cache ald bundle json file before build new. Save in one cache file all keys, value 

#### cacheFile
Type: `Boolean`  
Default: `true`

On/off cache bundle file translation

#### cacheDir
Type: `String`  
Default: `cache/i18n/`

Cache directory 

#### buildDoc
Type: `Boolean`  
Default: `true`

#### bundleFile
Type: `Boolean`  
Default: `true`

Saving a file translate where he was taken and placed in the cache

#### typeTranslation
Type: `String`
Default: `json`

Type build translation file (json,yml,js)

#### loadJsTranslation:
Type: `String`
Default: 
```js
    if (typeof define === 'function' && define.amd) {
        define(['i18n'], function (i18n) {
            return i18n.setTranslation(factory())
        })
    } else {
        i18n.setTranslation(factory());
    }
```

Load function translation if you select type typeTranslation=='js'

*file:*

 * AllKeys.md - All keys translation
 * AllKeysFileBuild.md - All keys file
 * AllKeysSize.md - All keys size translation 
 * InfoBuild.md - Info last build translation

#### reg
Type: `String`  
Default: `(i18n\\.get\\([ ]{0,}[\'"])([A-Za-z.]+)([\'"])`

This Regex finds keys in your file project

### grunt config
```js
grunt.initConfig({
    i18n: {
        options: {
            locales:['ua','en']
        },
        bundle1: {
            files: {
                'test/translations/bundle1.min.js':[
                    'test/**'
                ]
            }
        },
        bundle2: {
            files: {
                'test/translations/bundle2.min.js':[
                    'test2/**'
                ]
            }
        }
    }
});
    ...
```
build file: 
    
 * bundle1.min.en.json
 * bundle1.min.ua.json
 * bundle2.min.en.json
 * bundle2.min.ua.json

## Loader supports
    * AMD
    * CommonJS

## Config
```js
    i18n.setProperty({
        locale: 'EN', // location on
        localeDefault: 'EN', //locale on default if key of main locale is empty
        versionJson: '1.1.1', // versionJson add to url params load file translation
        defaultValue: '' // You can set default value for translated
    });
```


## Methods
 Method               | Arguments                  |  info           
----------------------|----------------------------|------------------------
 changeLocale         | locale                     | Change locale
 get                  | key, params, [option]      | Get translations
 getLocale            |                            | Get locale now
 load                 | url, [callback]            | Load translations JSON
 setProperty          | params                     | Set property i18n
 on                   | event, callback            | Bind event callback
 off                  | event, [callback]          | Unbind event callback
 once                 | event, callback            | Bind once event callback
 trigger              | event, param1,...          | Trigger event


## Events
 Event                | Arguments               |  info           
----------------------|-------------------------|-------------------
changeLocale          | locale                  | Event change locale
load                  | url, JSON               | Event load file json
error:translation:key | key, locale             | Event not fount key translation 
error:load            | statusText, status, xhr | Event error load json translation
error                 | type, *                 | All error event error:*

## Example

```html
<!-- ... -->
    <script src="dist/I18n.js" type="application/javascript"></script>
    <script>
        i18n.setProperty({
            locale: 'en',
            localeDefault: 'en'
        });
        var demoFunction=function(){
            console.log(i18n.get("test.test.test")); // Test test test
            console.log(i18n.get("count.books", {count: 20}));  // 20 books
            console.log(i18n.get("book.name.pages.number", {name: 'JS', number: 201})); // Book JS page 201
            console.log(i18n.get("test.test.test1")); // test.test.test1
            console.log(i18n.get("test.test.test1",{},{defaultValue:'my value'})); // my value
        };
        i18n.load('translations/bundle1.min', demoFunction );
        i18n.on('changeLocale',function(){
            console.log('change locale');
            demoFunction();
        });
    </script>
  
            
    <button onclick="i18n.changeLocale('UA')">UA</button>
    <button onclick="i18n.changeLocale('EN')">EN</button>


<!-- ... -->
```