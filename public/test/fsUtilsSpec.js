"use strict";

var fsUtils = require('filesystem/fs-utils')
    , chai = require('chai')
    , expect = chai.expect
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
        })
    });
});
