module.exports = function (grunt) {
    var karmaBrowsers = grunt.option('browsers') && grunt.option('browsers').split(','),
        reportPath = grunt.option('report-path');

    return {
        unit: {
            configFile: 'test/karma.conf.js',
            autoWatch: false,
            singleRun: true,
            browsers: karmaBrowsers || ['PhantomJS']
        },
        'unit-debug': {
            configFile: 'test/karma.conf.js',
            autoWatch: false,
            singleRun: false,
            browsers: karmaBrowsers || ['PhantomJS']
        },
        coverage: {
            configFile: 'test/karma-coverage.conf.js',
            autoWatch: false,
            singleRun: true,
            browsers: karmaBrowsers || ['PhantomJS'],
            coverageReporter: {
                reporters: [
                    { type: 'html', dir: reportPath || '../build/coverage/' }
                ]
            }
        }
    };
};