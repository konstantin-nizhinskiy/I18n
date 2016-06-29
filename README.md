I18n
====
 * [download](#download)
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

## Build json trunslation

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

#### locals 
Type: `Array`  
Default: `['en']`

Specify the location you want to create

#### cache 
Type: `Boolean`  
Default: `true`

Cache ald bundle json file before build new. Save in one cache file all keys, value 

#### cacheDir
Type: `String`  
Default: `cache/i18n/`

Cache directory 

#### buildDoc
Type: `Boolean`  
Default: `true`

Create information file after build translation in directory(options.cacheDir+'doc/')
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
            locals:['ua','en']
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

## Config
```js
    i18n.setProperty({
        local: 'EN', // location on
        localDefault: 'EN', //local on default if key of main local is empty
        versionJson: 1.1.1 // versionJson add to url params load file translation
    });
```


## Methods
 Method               | Arguments         |  info           
----------------------|-------------------|------------------------
 changeLocal          | local             | Change local
 get                  | key, params       | Get translations
 getLocal             |                   | Get local now
 load                 | url, [callback]   | Load translations JSON
 setProperty          | params            | Set property i18n
 on                   | event, callback   | Bind event callback
 off                  | event, [callback] | Unbind event callback
 once                 | event, callback   | Bind once event callback
 trigger              | event, param1,... | Trigger event


## Events
 Event                | Arguments               |  info           
----------------------|-------------------------|-------------------
changeLocal           | local                   | Event change local
load                  | url, JSON               | Event load file json
error:translation:key | key, local              | Event not fount key translation 
error:load            | statusText, status, xhr | Event error load json translation
error                 | type, *                 | All error event error:*

## Example

```html
<!-- ... -->
    <script src="dist/I18n.js" type="application/javascript"></script>
    <script>
        i18n.setProperty({
            local: 'en',
            localDefault: 'en'
        });
        var demoFunction=function(){
            console.log(i18n.get("test.test.test")); // Test test test
            console.log(i18n.get("count.books", {count: 20}));  // 20 books
            console.log(i18n.get("book.name.pages.number", {name: 'JS', number: 201})); // Book JS page 201
        };
        i18n.load('translations/bundle1.min', demoFunction );
        i18n.on('changeLocal',function(){
            console.log('change local');
            demoFunction();
        });
    </script>
  
            
    <button onclick="i18n.changeLocal('UA')">UA</button>
    <button onclick="i18n.changeLocal('EN')">EN</button>


<!-- ... -->
```