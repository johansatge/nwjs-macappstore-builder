'use strict';

var plist = require('plist');
var fs = require('fs');
var replace = require('replace');

var m = {};

m.configureInfoPlist = function(app_path, config, callback)
{
    var properties = {
        CFBundleDevelopmentRegion: 'en',
        CFBundleDisplayName: config.name,
        CFBundleExecutable: 'nwjs',
        CFBundleIconFile: 'nw.icns',
        CFBundleIdentifier: config.bundle_id,
        CFBundleInfoDictionaryVersion: '6.0',
        CFBundleName: config.name,
        CFBundlePackageType: 'APPL',
        CFBundleShortVersionString: config.version,
        CFBundleVersion: config.bundle_version,
        LSMinimumSystemVersion: '10.8',
        NSPrincipalClass: 'NSApplication',
        NSHumanReadableCopyright: config.copyright,
        LSApplicationCategoryType: config.app_category,
        LSApplicationSecondaryCategoryType: config.app_sec_category,
        NSSupportsAutomaticGraphicsSwitching: true
    };
    if (typeof config.plist === 'object')
    {
        for (var prop in config.plist)
        {
            properties[prop] = config.plist[prop];
        }
    }
    fs.writeFile(app_path + '/Contents/Info.plist', plist.build(properties), {encoding: 'utf8'}, function(error)
    {
        callback(error);
    });
};

m.configureHelpers = function(app_path, bundle_id, callback)
{
    var files = [
        app_path + '/Contents/Frameworks/nwjs Helper.app/Contents/Info.plist',
        app_path + '/Contents/Frameworks/nwjs Helper EH.app/Contents/Info.plist',
        app_path + '/Contents/Frameworks/nwjs Helper NP.app/Contents/Info.plist'
    ];
    for (var index = 0; index < files.length; index += 1)
    {
        try
        {
            var plist = fs.readFileSync(files[index], {encoding: 'utf8'});
            fs.writeFileSync(files[index], plist.replace('io.nwjs.nw', bundle_id), {encoding: 'utf8'});
        }
        catch (error)
        {
            callback(error);
            return;
        }
    }
    callback();
};

module.exports = m;