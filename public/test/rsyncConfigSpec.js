"use strict";

var RsyncConfig = require('rsync/rsync-command/rsync-config')
    , chai = require('chai')
    , expect = chai.expect
    , path = require('path');

describe('RsyncConfig', function () {
    describe('#clone', function () {
        it('should return a new object with the same values as the original object', function () {
            var original = new RsyncConfig();
            original.rsyncConfigName = 'abc';
            original.dryRun = true;
            original.archive = false;

            var clone = original.clone();
            expect(clone).not.to.be.equal(original);
            expect(clone.rsyncConfigName).to.be.equal('abc');
            expect(clone.dryRun).to.be.equal(true);
            expect(clone.archive).to.be.equal(false);
            expect(clone.clone()).not.to.be.undefined();
        });
    });

});
