/**
 * Sample Javascript file
 */
(function(window, document, p)
{

    'use strict';

    var app = {};

    app.init = function()
    {
        var node = document.getElementById('version');
        if (node)
        {
            node.innerHTML = process.version;
        }
    };

    window.App = app;

})(window, document, process);
