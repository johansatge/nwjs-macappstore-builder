'use strict';

var async = require('async');
var colors = require('colors');
var validator = require('validator.js');
var path = require('path');

var Files = require('./steps/files.js');
var Icon = require('./steps/icon.js');
var Plist = require('./steps/plist.js');
var Signature = require('./steps/signature.js');
var Package = require('./steps/package.js');

var m = function()
{

    var cwd = process.cwd().replace(/\/$/, '');

    var _checkConfiguration = function(config)
    {
        var assert = validator.Assert;
        var constraint = new validator.Constraint({
            nwjs_path: [new assert().Required(), new assert().NotBlank()],
            source_path: [new assert().Required(), new assert().NotBlank()],
            build_path: [new assert().Required(), new assert().NotBlank()],
            icon_path: [new assert().Required(), new assert().NotBlank(), new assert().Regexp('\.icns$')],
            name: [new assert().Required(), new assert().NotBlank()],
            bundle_id: [new assert().Required(), new assert().NotBlank(), new assert().Regexp('^[a-z0-9.]+$')],
            version: [new assert().Required(), new assert().NotBlank()],
            bundle_version: [new assert().Required(), new assert().NotBlank()],
            copyright: [new assert().Required(), new assert().NotBlank()],
            app_category: [new assert().Required(), new assert().NotBlank()],
            app_sec_category: [new assert().Required(), new assert().NotBlank()],
            identity: [new assert().Required(), new assert().NotBlank()],
            entitlements: [new assert().Required(), new assert().NotNull()],
            plist: [new assert().NotNull()]
        });
        var checked = constraint.check(config);
        var wrong_fields = [];
        if (checked !== true)
        {
            for (var index in checked)
            {
                wrong_fields.push(index);
            }
        }
        return wrong_fields;
    };

    this.setCWD = function(dir)
    {
        cwd = dir.replace(/\/$/, '');
    };

    this.build = function(config, callback, log_output)
    {
        var wrong_fields = _checkConfiguration.apply(this, [config]);
        if (wrong_fields.length > 0)
        {
            if (typeof callback === 'function')
            {
                callback(new Error('The following fields are not correct: ' + wrong_fields.join(',')));
            }
            return;
        }
        var build_path = path.isAbsolute(config.build_path) ? config.build_path : cwd + '/' + config.build_path.replace(/\/$/, '');
        var app_path = build_path + '/' + config.name + '.app';
        var steps = [
            function(next)
            {
                log_output ? console.log('Installing base app...') : null;
                var nwjs_path = path.isAbsolute(config.nwjs_path) ? config.nwjs_path : cwd + '/' + config.nwjs_path;
                Files.installBaseApp(nwjs_path, app_path, next);
            },
            function(next)
            {
                log_output ? console.log('Copying app...') : null;
                var source_path = path.isAbsolute(config.source_path) ? config.source_path : cwd + '/' + config.source_path;
                Files.copyApp(source_path, app_path, next);
            },
            function(next)
            {
                log_output ? console.log('Removing FFMPEG...') : null;
                Files.removeFFMPEGLibrary(app_path, next);
            },
            function(next)
            {
                log_output ? console.log('Removing OSX files...') : null;
                Files.removeOSXFiles(app_path, next);
            },
            function(next)
            {
                log_output ? console.log('Removing crash_inspector...') : null;
                Files.removeCrashInspector(app_path, next);
            },
            function(next)
            {
                log_output ? console.log('Copying icon...') : null;
                var icon_path = path.isAbsolute(config.icon_path) ? config.icon_path : cwd + '/' + config.icon_path;
                Icon.installIcon(app_path, icon_path, next);
            },
            function(next)
            {
                log_output ? console.log('Configuring Info.plist...') : null;
                Plist.configureInfoPlist(app_path, config, next);
            },
            function(next)
            {
                log_output ? console.log('Configuring helpers...') : null;
                Plist.configureHelpers(app_path, config.bundle_id, next);
            },
            function(next)
            {
                log_output ? console.log('Signing...') : null;
                Signature.sign(app_path, config.bundle_id, config.identity, config.entitlements, next);
            },
            function(next)
            {
                log_output ? console.log('Packaging...') : null;
                Package.buildPackage(app_path, config.identity, next);
            }
        ];
        async.series(steps, function(error)
        {
            if (typeof callback === 'function')
            {
                callback(error, app_path);
            }
        });
    };

};

module.exports = m;