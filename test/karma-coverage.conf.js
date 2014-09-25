/* jshint node: true */

var shared = require('./karma.conf');

module.exports = function(config) {
    var coverage = ['coverage'];

    shared(config);

    config.files = shared.files.concat([
        { pattern: 'test/**/*Spec.js', included: false }
    ]);

    config.reporters.push.apply(config.reporters, coverage);

    config.preprocessors = {
        'src/**/*.js': coverage
    };
};