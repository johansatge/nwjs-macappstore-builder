var Builder = require('../src/builder.js');
var config = require('./fixtures/config.json');

describe('Builder.build()', function()
{
    it('Should build without error', function(done)
    {
        var builder = new Builder();
        builder.build(config, function(error)
        {
            if (error)
            {
                throw error;
            }
            done();
        }, true);
    });

    // @todo Should install base app
    // @todo Should copy app
    // @todo Should uglify JS
    // @todo Should remove FFMPEG
    // @todo Should remove OSX files
    // @todo Should remove crash_inspector
    // @todo Should copy icon
    // @todo Should configure Info.plist
    // @todo Should configure helpers
    // @todo Should fix permissions
    // @todo Should sign the app
    // @todo Should create a package

});