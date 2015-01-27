//----------------------------------------------------------------------------------------------------------------------
// RPGKeeper DnD4e (Old) Gruntfile.
//----------------------------------------------------------------------------------------------------------------------

module.exports = function(grunt)
{
    // Project configuration.
    grunt.initConfig({
        project: {
            less: ['client/less/**/*.less', 'client/components/**/*.less']
        },
        less: {
            min: {
                options: {
                    compress: true
                },
                files: {
                    'client/css/tome.min.css': ['<%= project.less %>']
                }
            }
        },
        watch: {
            less: {
                files: ['<%= project.less %>'],
                tasks: ['less'],
                options: {
                    atBegin: true
                }
            }
        }
    });

    // Grunt Tasks.
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Setup the build task.
    grunt.registerTask('build', ['less']);
}; // module.exports

// ---------------------------------------------------------------------------------------------------------------------