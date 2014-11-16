module.exports = function (grunt) {

    grunt.initConfig({
        nodewebkit: {
            options: {
                buildDir: './build', // This is where the releases are saved.
                cacheDir: './cache', // This is where the cached node-webkit downloads are
                macIcns: './public/images/backup.icns',
                macZip: false, // Better performance on Mac
                winIco: './public/images/backup.ico',
                platforms: ['osx'] // Possible values: win,osx,linux32,linux64
            },
            src: './public/**/*' // Your node-webkit app
        }
    });

    grunt.loadNpmTasks('grunt-node-webkit-builder');
    grunt.registerTask('default', ['nodewebkit']);

};
