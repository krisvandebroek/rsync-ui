"use strict";

var fsUtils = require('filesystem/fs-utils')
    , chai = require('chai')
    , async = require('async')
    , expect = chai.expect
    , fs = require('fs')
    , path = require('path');

describe('fs-utils', function () {
    describe('#getDrives()', function () {
        it('can retrieve the locally mounted drives on the system', function (done) {
            fsUtils.getDrives(function (error, drives) {
                expect(error).to.not.exist();
                expect(drives).to.exist();
                expect(drives.length).to.be.greaterThan(0);
                expect(drives[0].used).to.exist();
                expect(drives[0].available).to.exist();
                expect(drives[0].mountpoint).to.exist();
                expect(drives[0].freePer).to.exist();
                expect(drives[0].usedPer).to.exist();
                expect(drives[0].total).to.exist();
                expect(drives[0].drive).to.exist();
                done();
            });
        });
        it('can retrieve the details of one locally mounted drive', function (done) {
            fsUtils.getDrives(function (error, drives) {
                fsUtils.getDriveDetail(drives[0], function (error, info) {
                    expect(error).to.not.exist();
                    expect(info).to.exist();
                    expect(info.used).to.exist();
                    expect(info.available).to.exist();
                    expect(info.mountpoint).to.exist();
                    expect(info.freePer).to.exist();
                    expect(info.usedPer).to.exist();
                    expect(info.total).to.exist();
                    expect(info.drive).to.exist();
                    done();
                });
            });
        });
        it('can retrieve the drive containing a certain path', function (done) {
            fsUtils.getDriveForPath('/', function (error, drive) {
                expect(error).to.not.exist();
                expect(drive).to.exist();
                done();
            })
        });
        it('cannot retrieve the drive for a path that is not mounted', function (done) {
            fsUtils.getDriveForPath('/Volumes/unmountedVolume', function (error, drive) {
                expect(error).to.exist();
                expect(drive).to.not.exist();
                done();
            })
        });
    });

    describe('#getSize()', function () {
        it('can retrieve the size of a file', function (done) {
            var filePath = path.resolve(__dirname, './tmpFile');
            async.series([
                function (callback) {
                    fs.writeFile(filePath, "fileContents", {}, callback);
                },
                function (callback) {
                    fsUtils.getSize(filePath, function (error, size) {
                        expect(size).to.be.greaterThan(0);
                        callback(error);
                    })
                },
                function (callback) {
                    fs.unlink(filePath, callback);
                }
            ], function (error) {
                expect(error).to.not.exist();
                done();
            });
        });
        it('can retrieve the size of a directory', function (done) {
            var dirPath = path.resolve(__dirname, './tmpDir');
            var filePath1 = path.resolve(dirPath, './tmpFile1');
            var filePath2 = path.resolve(dirPath, './tmpFile2');
            async.series([
                function (callback) {
                    fs.mkdir(dirPath, callback);
                },
                function (callback) {
                    fs.writeFile(filePath1, "fileContents1", {}, callback);
                },
                function (callback) {
                    fs.writeFile(filePath2, "fileContents2", {}, callback);
                },
                function (callback) {
                    fsUtils.getSize(dirPath, callback);
                },
                function (callback) {
                    fs.lstat(dirPath, callback);
                },
                function (callback) {
                    fs.lstat(filePath1, callback);
                },
                function (callback) {
                    fs.lstat(filePath2, callback);
                },
                function (callback) {
                    fs.unlink(filePath1, callback);
                },
                function (callback) {
                    fs.unlink(filePath2, callback);
                },
                function (callback) {
                    fs.rmdir(dirPath, callback);
                }
            ], function (error, results) {
                expect(error).to.not.exist();
                var calculatedSize = results[3];
                var dirSize = 512 * results[4].blocks;
                var file1Size= 512 * results[5].blocks;
                var file2Size = 512 * results[6].blocks;
                expect(calculatedSize).to.equal(dirSize + file1Size + file2Size);
                done();
            });
        });
    });
});
