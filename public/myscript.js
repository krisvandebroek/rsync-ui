var fs = require('fs');
angular.module('rsync-ui-app', [])
    .controller('rsync-ui-app-controller', ['$scope', function ($scope) {

        // Test to read files from the filesystem
        $scope.filenames = fs.readdirSync('/opt/');

        console.log('Next: Reading file');
        // Test reading the contents of a file on the filesystem
        $scope.fileContents = fs.readFileSync('/etc/bashrc').toString('utf8');
    }]);
