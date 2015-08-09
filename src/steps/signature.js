'use strict';

var plist = require('plist');
var os = require('os');
var crypto = require('crypto');
var fs = require('fs');
var async = require('async');
var exec = require('child_process').exec;

var m = {};

m.sign = function(app_path, identity, entitlements, callback)
{
    var uniqid = crypto.createHash('md5').update(app_path).digest('hex');
    var parent_path = os.tmpdir().replace(/\/$/, '') + '/nwjs_parent_' + uniqid + '.xml';
    var child_path = os.tmpdir().replace(/\/$/, '') + '/nwjs_child_' + uniqid + '.xml';
    try
    {
        _buildChildEntitlement(child_path);
        _buildParentEntitlement(parent_path, entitlements);
    }
    catch (error)
    {
        callback(error);
        return;
    }
    var commands = [
        function(next)
        {
            var path = app_path + '/Contents/Frameworks/nwjs Helper.app';
            exec(_getSigningCommand(identity, child_path, path), next);
        },
        function(next)
        {
            var path = app_path + '/Contents/Frameworks/nwjs Helper EH.app';
            exec(_getSigningCommand(identity, child_path, path), next);
        },
        function(next)
        {
            var path = app_path + '/Contents/Frameworks/nwjs Helper NP.app';
            exec(_getSigningCommand(identity, child_path, path), next);
        },
        function(next)
        {
            exec(_getSigningCommand(identity, parent_path, app_path), next);
        }
    ];
    async.series(commands, function(error)
    {
        try
        {
            fs.unlinkSync(child_path);
            fs.unlinkSync(parent_path);
        }
        catch (e)
        {

        }
        callback(error);
    });
};

var _getSigningCommand = function(identity, entitlement_path, app_path)
{
    var command = 'codesign --deep -s "' + identity + '" --entitlements "' + entitlement_path + '"';
    return command + ' "' + app_path + '"';
};

var _buildChildEntitlement = function(path)
{
    var properties = {
        'com.apple.security.app-sandbox': true,
        'com.apple.security.inherit': true
    };
    fs.writeFileSync(path, plist.build(properties), {encoding: 'utf8'});
};

var _buildParentEntitlement = function(path, config)
{
    var properties = {
        'com.apple.security.app-sandbox': true
    };
    for (var index = 0; index < config.length; index += 1)
    {
        properties[config[index]] = true;
    }
    fs.writeFileSync(path, plist.build(properties), {encoding: 'utf8'});
};

module.exports = m;
