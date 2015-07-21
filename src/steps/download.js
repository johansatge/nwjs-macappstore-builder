'use strict';

var crypto = require('crypto');
var os = require('os');
var fs = require('fs');
var exec = require('child_process').exec;

var m = {};
var progressCallback = null;

m.onProgress = function(callback)
{
    progressCallback = callback;
};

m.get = function(url, callback)
{
    var uniqid = crypto.createHash('md5').update(url).digest('hex');
    var cached_path = os.tmpdir() + uniqid + '.app';
    fs.stat(cached_path, function(error)
    {
        if (!error)
        {
            callback(null, cached_path);
            return;
        }
        _get(url, cached_path, function(error)
        {
            process.exit(); // @todo remove this
            callback(error, cached_path);
        });
    });
};

var _get = function(url, destination_path, callback)
{
    var child = exec('curl --progress-bar "' + url + '" > "' + destination_path + '.zip"', function(error)
    {
        if (error)
        {
            callback(error);
        }
        else
        {
            // @todo unzip and move
            console.log('LA');

            callback(null);
        }
    });
    child.stderr.on('data', function(data)
    {
        var progress = new RegExp('([0-9.]+)%', 'g').exec(data);
        if (progress !== null && typeof progress[1] !== 'undefined' && progressCallback !== null)
        {
            progressCallback(progress[1]);
        }
    });
};

module.exports = m;