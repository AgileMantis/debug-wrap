module.exports = function Gruntfile(grunt) {
    var path = require('path'),
        fs = require('fs');

    require('load-grunt-config')(grunt, {
        configPath: path.join(process.cwd(), 'grunt/config'),
        init: true,
        data: {},
        loadGruntTasks: {
            pattern: 'grunt-*',
            config: require('./package.json'),
            scope: 'devDependencies'
        },
        postProcess: function postProcess() {
            if (fs.existsSync('./grunt/task')) {
                fs.readdirSync('./grunt/task').forEach(function (file) {
                    var name = file.replace(/\.js/, '');
                    grunt.registerTask(name, function () {
                        return require('./grunt/task/' + name).call(this, grunt);
                    });
                });
            }
        }
    });

    grunt.registerTask('test', ['karma:unit']);
};