//----------------------------------------------------------------------------------------------------------------------
// RPGKeeper DnD4e (Old) Gruntfile.
//----------------------------------------------------------------------------------------------------------------------

module.exports = function(grunt)
{
    // Project configuration.
    grunt.initConfig({
        project: {
            //js: ['client/js/**/*.js', 'client/widgets/**/*.js'],
            less: ['client/less/**/*.less', 'client/directives/**/*.less']
        },
        less: {
            min: {
                options: {
                    //paths: ['../rpgkeeper2', '../rpgkeeper2/client/vendor'],
                    compress: true
                },
                files: {
                    'client/css/tome.min.css': ['<%= project.less %>']
                }
            }
        },
        /*
        concat: {
            js: {
                files: {
                    'client/js/tome.js': ['<%= project.js %>', '!client/js/tome.js']
                }
            }
        },
        */
        watch: {
            less: {
                files: ['<%= project.less %>'],
                tasks: ['less'],
                options: {
                    atBegin: true
                }
            },
            /*
            js: {
                files: ['<%= project.js %>'],
                tasks: ['concat'],
                options: {
                    atBegin: true
                }
            }
            */
        }
    });

    // Grunt Tasks.
    grunt.loadNpmTasks('grunt-contrib-less');
    //grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Setup the build task.
    grunt.registerTask('build', ['less']);//, 'concat']);
}; // module.exports

// ---------------------------------------------------------------------------------------------------------------------