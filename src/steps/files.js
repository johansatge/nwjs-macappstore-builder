'use strict';

var exec = require('child_process').exec;

var m = {};

m.installBaseApp = function(nwjs_path, app_path, callback)
{
    exec('rm -r "' + app_path + '"; cp -r "' + nwjs_path + '" "' + app_path + '"', function(error)
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

module.exports = m;