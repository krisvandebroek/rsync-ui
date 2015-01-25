"use strict";

var filterFileParser = require('rsync/rsync-command/filter-file-parser')
    , chai = require('chai')
    , expect = chai.expect
    , path = require('path');

var DIRECTORY = true;
var FILE = false;

describe('FilterFileParser', function () {
    describe('#parseFilterFile', function () {
        it('can parse a rsync filter file', function () {
            var filterFile = filterFileParser.parseFilterFile(path.join(__dirname, 'filterFile.txt'));
            expect(filterFile.filterLines).to.have.lengthOf(4);
            expect(filterFile.filterLines[0].original).to.be.equal('P /Backup Logs');
            expect(filterFile.filterLines[1].original).to.be.equal('+ .DS_Store');
            expect(filterFile.filterLines[2].original).to.be.equal('+ /');
            expect(filterFile.filterLines[3].original).to.be.equal('H /Users/kris/Backup');
        });
    });

    describe('FilterFile#shouldBackup', function () {
        it('should backup if the first matching filterLine results in backup', function () {
            var filterLine1 = filterFileParser.parseFilterLine('+ /Users/kris/Backup');
            var filterLine2 = filterFileParser.parseFilterLine('- /Users/kris/Backup');
            var filterFile = new filterFileParser.FilterFile([filterLine1, filterLine2]);
            expect(filterFile.shouldBackup({path: '/Users/kris/Backup', isDirectory: true}, '/')).to.be.true();
        });
        it('should not backup if the first matching filterLine prevents backup', function () {
            var filterLine1 = filterFileParser.parseFilterLine('- /Users/kris/Backup');
            var filterLine2 = filterFileParser.parseFilterLine('+ /Users/kris/Backup');
            var filterFile = new filterFileParser.FilterFile([filterLine1, filterLine2]);
            expect(filterFile.shouldBackup({path: '/Users/kris/Backup', isDirectory: true}, '/')).to.be.false();
        });
        it('should backup if there is no matching filterLine', function () {
            var filterLine1 = filterFileParser.parseFilterLine('- /Foo');
            var filterFile = new filterFileParser.FilterFile([filterLine1]);
            expect(filterFile.shouldBackup({path: '/Bar', isDirectory: true}, '/')).to.be.true();
        });
    });

    describe('#parseFilterLine', function () {
        it('should backup the matching file when filterType is +', function () {
            var filterLine = filterFileParser.parseFilterLine('+ /Users/kris/Backup');
            expect(filterLine.shouldBackup({path: '/Users/kris/Backup', isDirectory: true}, '/')).to.be.true();
        });
        it('should return null (undecided) for non-matching file when filterType is +', function () {
            var filterLine = filterFileParser.parseFilterLine('+ /Users/kris/Backup');
            expect(filterLine.shouldBackup({path: '/Users/kris/Backups', isDirectory: true}, '/')).to.be.null();
        });
        it('should not backup the matching file when filterType is -', function () {
            var filterLine = filterFileParser.parseFilterLine('- /Users/kris/Backup');
            expect(filterLine.shouldBackup({path: '/Users/kris/Backup', isDirectory: true}, '/')).to.be.false();
        });
        it('should return null (undecided) for non-matching file when filterType is -', function () {
            var filterLine = filterFileParser.parseFilterLine('- /Users/kris/Backup');
            expect(filterLine.shouldBackup({path: '/Users/kris/Backups', isDirectory: true}, '/')).to.be.null();
        });
        it('should not backup the matching file when filterType is H', function () {
            var filterLine = filterFileParser.parseFilterLine('H /Users/kris/Backup');
            expect(filterLine.shouldBackup({path: '/Users/kris/Backup', isDirectory: true}, '/')).to.be.false();
        });
        it('should return null (undecided) for non-matching file when filterType is H', function () {
            var filterLine = filterFileParser.parseFilterLine('H /Users/kris/Backup');
            expect(filterLine.shouldBackup({path: '/Users/kris/Backups', isDirectory: true}, '/')).to.be.null();
        });
        it('should return null (undecide) for matching file when filterType is P', function () {
            var filterLine = filterFileParser.parseFilterLine('P /Users/kris/Backup');
            expect(filterLine.shouldBackup({path: '/Users/kris/Backup', isDirectory: true}, '/')).to.be.null();
        });
        it('should return null (undecided) for non-matching file when filterType is H', function () {
            var filterLine = filterFileParser.parseFilterLine('P /Users/kris/Backup');
            expect(filterLine.shouldBackup({path: '/Users/kris/Backups', isDirectory: true}, '/')).to.be.null();
        });
    });

    describe('#parseFilterRule', function () {
        describe('directory matcher without wildcard', function () {
            it('matches a directory of root as baseDir', function () {
                var matcher = filterFileParser.parseFilterRule('/Foo/');
                expect(matcher.matches('/Foo/', '/', DIRECTORY)).to.be.true();
            });
            it('does not match a subdirectory', function () {
                var matcher = filterFileParser.parseFilterRule('/Foo/');
                expect(matcher.matches('/Foo/Bar', '/', DIRECTORY)).to.be.false();
            });
            it('matches a directory without trailing slash', function () {
                var matcher = filterFileParser.parseFilterRule('/Foo/');
                expect(matcher.matches('/Foo', '/', DIRECTORY)).to.be.true();
            });
            it('does not match a file with the same name', function () {
                var matcher = filterFileParser.parseFilterRule('/Foo/');
                expect(matcher.matches('/Foo', '/', FILE)).to.be.false();
            });
            it('does not match directory that is not a subpath of the baseDir', function () {
                var matcher = filterFileParser.parseFilterRule('/Foo/');
                expect(matcher.matches('/Foo/', '/Base', DIRECTORY)).to.be.false();
            });
            it('matches a relative directory', function () {
                var matcher = filterFileParser.parseFilterRule('/Foo/');
                expect(matcher.matches('/Base/Foo/', '/Base', DIRECTORY)).to.be.true();
            });
            it('matches a relative directory', function () {
                var matcher = filterFileParser.parseFilterRule('/Foo/');
                expect(matcher.matches('/Base/Foo/', '/Base/', DIRECTORY)).to.be.true();
            });
        });
        describe('directory matcher with *** wildcard', function () {
            it('matches the directory itself', function () {
                var matcher = filterFileParser.parseFilterRule('/Foo/***');
                expect(matcher.matches('/Foo/', '/', DIRECTORY)).to.be.true();
            });
            it('matches subdirectories', function () {
                var matcher = filterFileParser.parseFilterRule('/Foo/***');
                expect(matcher.matches('/Foo/Bar/', '/', DIRECTORY)).to.be.true();
            });
            it('matches files in the directory', function () {
                var matcher = filterFileParser.parseFilterRule('/Foo/***');
                expect(matcher.matches('/Foo/Bar', '/', FILE)).to.be.true();
            });
            it('matches files in any subdirectory', function () {
                var matcher = filterFileParser.parseFilterRule('/Foo/***');
                expect(matcher.matches('/Foo/X/Y/Z/Bar', '/', FILE)).to.be.true();
            });
        });
        describe('sub-level matcher without wildcards', function () {
            it('matches a directory with the given name', function () {
                var matcher = filterFileParser.parseFilterRule('Foo');
                expect(matcher.matches('/Foo/', '/', DIRECTORY)).to.be.true();
            });
            it('matches a file with the given name', function () {
                var matcher = filterFileParser.parseFilterRule('Foo');
                expect(matcher.matches('/Foo', '/', FILE)).to.be.true();
            });
            it('matches a directory with the given name in a subdirectory', function () {
                var matcher = filterFileParser.parseFilterRule('Bar');
                expect(matcher.matches('/Foo/X/Y/Z/Bar', '/', DIRECTORY)).to.be.true();
            });
            it('matches a file with the given name in a subdirectory', function () {
                var matcher = filterFileParser.parseFilterRule('Bar');
                expect(matcher.matches('/Foo/X/Y/Z/Bar', '/', FILE)).to.be.true();
            });
            it('does not match with only part of the filename', function () {
                var matcher = filterFileParser.parseFilterRule('oo');
                expect(matcher.matches('/Foo', '/', FILE)).to.be.false();
            });
            it('does not match with only part of the filename', function () {
                var matcher = filterFileParser.parseFilterRule('Foo');
                expect(matcher.matches('/Food', '/', FILE)).to.be.false();
            });
        });
        describe('matcher with special characters', function () {
            it('matches special characters literally', function () {
                var matcher = filterFileParser.parseFilterRule('/Foo/.ar');
                expect(matcher.matches('/Foo/bar', '/', FILE)).to.be.false();
            });
        });
        describe('file or directory with special characters', function () {
            it('matches special characters literally', function () {
                var matcher = filterFileParser.parseFilterRule('/Foo/bar');
                expect(matcher.matches('/Foo/.ar', '/', FILE)).to.be.false();
            });
        });
    });

});
