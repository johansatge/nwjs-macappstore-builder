'use strict';

var exec = require('child_process').exec;
var path = require('path');
var glob = require('glob');
var uglifyjs = require('uglify-js');
var fs = require('fs');

var m = {};

m.installBaseApp = function(nwjs_path, app_path, callback)
{
    var rm_command = 'rm -r "' + app_path + '"';
    var dir_command = 'mkdir -p "' + path.dirname(app_path) + '"';
    var cp_command = 'cp -r "' + nwjs_path + '" "' + app_path + '"';
    exec(rm_command + ';' + dir_command + ';' + cp_command, function(error, stdout, stderr)
    {
        callback(error);
    });
};

m.removeFFMPEGLibrary = function(app_path, callback)
{
    exec('rm "' + app_path + '/Contents/Frameworks/nwjs Framework.framework/Libraries/ffmpegsumo.so"', function()
    {
        callback();
    });
};

m.removeOSXFiles = function(app_path, callback)
{
    exec('cd YourApp.app && find . -name "*.DS_Store" -type f -delete', function()
    {
        callback();
    });
};

m.removeCrashInspector = function(app_path, callback)
{
    exec('rm "' + app_path + '/Contents/Frameworks/crash_inspector"', function()
    {
        callback();
    });
};

m.copyApp = function(source_path, app_path, callback)
{
    exec('cp -r "' + source_path + '" "' + app_path + '/Contents/Resources/app.nw"', function(error)
    {
        callback(error);
    });
};

m.fixPermissions = function(app_path, callback)
{
    exec('cd "' + app_path + '/Contents/Resources/app.nw" && find . -type f -exec chmod 664 {} \\;', function(error)
    {
        callback(error);
    });
};

m.uglifyJavascript = function(app_path, callback)
{
    var cwd = app_path + '/Contents/Resources/app.nw/';
    glob('**/*.js', {cwd: cwd}, function(error, files)
    {
        var error_files = [];
        for (var index = 0; index < files.length; index += 1)
        {
            if (files[index].search('.min.') === -1)
            {
                try
                {
                    var minified = uglifyjs.minify(cwd + files[index]);
                    fs.writeFileSync(cwd + files[index], minified.code, {encoding: 'utf8'});
                }
                catch(error)
                {
                    error_files.push({path: files[index], error: error.message});
                }
            }
        }
        callback(null, error_files);
    });
};

module.exports = m;
