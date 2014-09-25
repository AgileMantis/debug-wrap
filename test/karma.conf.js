/* jshint node: true */
module.exports = function karmaConfig(config) {
    config.set({
        basePath: '../',
        frameworks: ['jasmine', 'requirejs'],
        reporters: ['progress'],
        autoWatch: false,
        colors: true,
        files: [
            { pattern: 'src/**/**.js', included: false },
            { pattern: 'test/unit/**/*Spec.js', included: true },
            'test/run-tests.js'
        ]
    });
};