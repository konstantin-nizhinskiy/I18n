var grunt = require ( 'grunt'),
    YAML = require('yamljs');



module.exports = function (options) {
    var _write=function(file,obj){
        switch (options.typeTranslation){
            case 'json':
                obj=obj||{};
                grunt.file.write(file+'.json',JSON.stringify(obj, "", 4));
                break;
            case 'yml':
                grunt.file.write(file+'.yml',YAML.stringify(obj||{}));
                break;
            case 'js':
                var tpl,tplContent;
                tpl= "(function (root, factory) {\n" +
                            "<%= loadJsTranslation %>"+
                            "\n}(this, function () {"+
                            "\n//objTranslation\n" +
                            "return <%= objTranslation %>" +


                                "\n//objTranslationEnd\n"+
                            "}));";
                tplContent=grunt.template.process(tpl,{
                 data:{
                     loadJsTranslation : options.loadJsTranslation,
                     objTranslation: JSON.stringify(obj||{})
                 }
                 });
                grunt.file.write(file+'.js',tplContent);
                break;
            default :
                grunt.log.error('not fount typeTranslation ['+options.typeTranslation+']');
                throw 'not fount typeTranslation ['+options.typeTranslation+']';
        }
    };
    var _get=function(file){
        switch (options.typeTranslation){
            case 'json':
                if (grunt.file.isFile(file + '.json')) {
                    return grunt.file.readJSON(file + '.json');
                }else{
                    return {};
                }
                break;
            case 'yml':
                if (grunt.file.isFile(file + '.yml')) {
                    return grunt.file.readYAML(file + '.yml');
                }else{
                    return {};
                }
                break;
            case 'js':
                if (grunt.file.isFile(file + '.js')) {
                    var str,str2;
                    str=grunt.file.read(file + '.js');
                    str2=str.substr(0,str.indexOf('objTranslationEnd')-2);
                    str2=str2.substr(str.indexOf('objTranslation')+14);
                    return JSON.parse(str2.replace('return',''));
                }else{
                    return {};
                }
                break;
            default :
                grunt.log.error('not fount typeTranslation ['+options.typeTranslation+']');
               throw 'not fount typeTranslation ['+options.typeTranslation+']';
        }

    };
    var _isFile=function(file){
        return grunt.file.isFile( file+'.'+options.typeTranslation )
    };
    var _copy=function(file,copyFile){
        grunt.file.copy(
            file+'.'+options.typeTranslation,
            copyFile+'.'+options.typeTranslation
        );
    };
    return{
        write:_write,
        get : _get,
        isFile: _isFile,
        copy : _copy

    }
};