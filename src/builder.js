'use strict';

var async = require('async');
var colors = require('colors');
var validator = require('validator.js');

var Files = require('./steps/files.js');
var Icon = require('./steps/icon.js');
var Plist = require('./steps/plist.js');
var Signature = require('./steps/signature.js');

var m = function()
{

    this.build = function(config, callback, log_output)
    {
        var wrong_fields = _checkConfiguration.apply(this, [config]);
        if (wrong_fields.length > 0)
        {
            callback(new Error('The following fields are not correct: ' + wrong_fields.join(',')));
            return;
        }
        var app_path = config.build_path.replace(/\/$/, '') + '/' + config.name + '.app';
        var steps = [
            function(next)
            {
                log_output ? console.log('Installing base app...') : null;
                Files.installBaseApp(config.nwjs_path, app_path, next);
            },
            function(next)
            {
                log_output ? console.log('Copying app...') : null;
                Files.copyApp(config.source_path, app_path, next);
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
                Icon.installIcon(app_path, config.icon_path, next);
            },
            function(next)
            {
                log_output ? console.log('Configuring Info.plist...') : null;
                Plist.configureInfoPlist(app_path, config, next);
            },
            function(next)
            {
                log_output ? console.log('Configuring helpers...') : null;
                Plist.configureHelpers(next);
            },
            function(next)
            {
                log_output ? console.log('Signing...') : null;
                Signature.sign(next);
            }
        ];
        async.series(steps, function(error)
        {
            if (typeof callback === 'function')
            {
                callback(error);
            }
        });
    };

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

};

module.exports = m;