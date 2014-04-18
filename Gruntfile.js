module.exports = function (grunt) {

    grunt.initConfig({
        nodewebkit: {
            options: {
                build_dir: './build', // Where the build version of my node-webkit app is saved
                credits: './public/credits.html',
                mac: true,
                win: false,
                linux32: false,
                linux64: false
            },
            src: './public/**/*' // Your node-webkit app
        }
    });

    grunt.loadNpmTasks('grunt-node-webkit-builder');
    grunt.registerTask('default', ['nodewebkit']);

};
