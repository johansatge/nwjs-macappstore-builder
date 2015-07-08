#!/usr/bin/env node

'use strict';

var colors = require('colors');
var Builder = require('./builder.js');

var config = {
    nwjs_path: '/Applications/nwjs.app',
    source_path: '/Users/johan/Desktop/app.nw',
    build_path: '/Users/johan/Desktop',
    icon_path: '/Volumes/AirData/Dev/namagic/assets/icon/icon.icns',
    name: 'Your App',
    bundle_id: 'com.namagicapp.namagictest',
    version: '1.0.0',
    bundle_version: '100',
    copyright: '© Sample copyright',
    app_category: 'public.app-category.utilities',
    app_sec_category: 'public.app-category.productivity',
    plist: {
        NSSampleProperty1: 'Property value 1',
        NSSampleProperty2: 'Property value 1'
    }
};

var builder = new Builder();
builder.build(config, function(error)
{
    console.log(error ? colors.red(error.message) : colors.green('Done.'));
}, true);

/*
 var updateNotifier = require('update-notifier');
 var meow = require('meow');
 var trash = require('./');

 var cli = meow({
 help: [
 'Usage',
 '  $ trash [--force] <path> [<path> ...]',
 '',
 'Example',
 '  $ trash unicorn.png rainbow.png'
 ]
 }, {
 string: ['_'],
 boolean: ['force']
 });

 var errExitCode = cli.flags.force ? 0 : 1;

 updateNotifier({pkg: cli.pkg}).notify();

 if (cli.input.length === 0) {
 console.error('You need to specify at least one path');
 process.exit(errExitCode);
 }

 trash(cli.input, function (err) {
 if (err) {
 console.error(err.message);
 process.exit(errExitCode);
 }
 });*/