'use strict';

var path = require('path');
var exec = require('child_process').exec;

var m = {};

m.buildPackage = function(app_path, identity, callback)
{
    var dir = path.dirname(app_path);
    var app = path.basename(app_path);
    var pkg = app.replace('.app', '.pkg');
    var command = 'cd "' + dir + '" && productbuild --component "' + app + '" /Applications --sign "' + identity + '" "' + pkg + '"';
    exec(command, callback);
};

module.exports = m;
