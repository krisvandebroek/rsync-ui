var filterFileParser = require('rsync/rsync-command/filter-file-parser')
    , chai = require('chai')
    , expect = chai.expect
    , path = require('path');

var DIRECTORY = true;
var FILE = false;

describe.only('FilterFileParser', function () {
    describe('#parseFilterFile', function () {
        it('can parse a rsync filter file', function () {
            filterFileParser.parseFilterFile(path.join(__dirname, 'filterFile.txt'));
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
    });

});
