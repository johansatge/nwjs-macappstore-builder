#!/usr/bin/env node

'use strict';

var colors = require('colors');
var Builder = require('./builder.js');
var argv = require('yargs').argv;
var fs = require('fs');
var manifest = JSON.parse(fs.readFileSync(__dirname.replace(/\/$/, '') + '/../package.json', {encoding: 'utf8'}));

// Prints version
if (argv.version)
{
    console.log('Version ' + manifest.version);
    process.exit(0);
}

// Prints help
if (argv.help)
{
    console.log([
        'Usage:',
        'nwjs-macappstore-builder',
        '    --config=<configpath.json>',
        '    --<param>=<value>'
    ].join('\n'));
    process.exit(0);
}

// Main process
try
{
    var config = argv.config !== 'undefined' ? JSON.parse(fs.readFileSync(argv.config, {encoding: 'utf8'})) : {};
}
catch (error)
{
    console.log(colors.red(error.message));
    process.exit(1);
}
for (var param in argv)
{
    if (param.search(/^[a-zA-Z]/) !== -1)
    {
        try
        {
            config[param] = argv[param].search(/^[{\[]/) !== -1 ? JSON.parse(argv[param]) : argv[param];
        }
        catch (error)
        {
            console.log(colors.red(error.message));
            process.exit(1);
        }
    }
}

var builder = new Builder();
builder.build(config, function(error, app_path)
{
    console.log(error ? colors.red(error.message) : colors.green('Built successfully. (' + app_path + ')'));
    process.exit(error ? 1 : 0);
}, true);