"use strict";

var fileBrowser = require('rsync/file-browser')
    , chai = require('chai')
    , expect = chai.expect
    , path = require('path');

describe('FileBrowser', function () {
    describe('#getRootNode(path, callback)', function () {
        it('can load a directory as a rootNode', function (done) {
            var currentDirPath = __dirname;
            var dummyDirPath = path.join(currentDirPath, 'dummyDir');
            fileBrowser.getRootNode(dummyDirPath, function (error, node) {
                expect(error).to.not.exist();
                expect(node).to.exist();
                expect(node.path).to.equal(dummyDirPath);
                expect(node.isDirectory).to.equal(true);
                expect(node.bytes).to.be.greaterThan(0);
                expect(node.collapsed).to.equal(true);
                expect(node.parent).to.not.exist();
                done();
            });
        });

        it('can load a directory as a childNode', function (done) {
            var currentDirPath = __dirname;
            var dummyDirPath = path.join(currentDirPath, 'dummyDir');
            fileBrowser.getChildNode(currentDirPath, dummyDirPath, function (error, node) {
                expect(error).to.not.exist();
                expect(node).to.exist();
                expect(node.path).to.equal(dummyDirPath);
                expect(node.isDirectory).to.equal(true);
                expect(node.bytes).to.be.greaterThan(0);
                expect(node.collapsed).to.equal(true);
                expect(node.parent).to.equal(currentDirPath);
                done();
            });
        });

        it('can load a file as a rootNode', function (done) {
            var currentDirPath = __dirname;
            var filePath = path.join(currentDirPath, 'dummyNode.txt');
            fileBrowser.getRootNode(filePath, function (error, node) {
                expect(error).to.not.exist();
                expect(node).to.exist();
                expect(node.path).to.equal(filePath);
                expect(node.isDirectory).to.equal(false);
                expect(node.bytes).to.be.greaterThan(0);
                expect(node.collapsed).to.equal(true);
                expect(node.parent).to.not.exist();
                done();
            });
        });

        it('can load a file as a childNode', function (done) {
            var currentDirPath = __dirname;
            var filePath = path.join(currentDirPath, 'dummyNode.txt');
            fileBrowser.getChildNode(currentDirPath, filePath, function (error, node) {
                expect(error).to.not.exist();
                expect(node).to.exist();
                expect(node.path).to.equal(filePath);
                expect(node.isDirectory).to.equal(false);
                expect(node.bytes).to.be.greaterThan(0);
                expect(node.collapsed).to.equal(true);
                expect(node.parent).to.equal(currentDirPath);
                done();
            });
        });
    });

    describe('#loadChildren(node, callback)', function () {
        it('can load the children of a directory', function (done) {
            var currentDirPath = __dirname;
            var dummyDirPath = path.join(currentDirPath, 'dummyDir');
            fileBrowser.getRootNode(dummyDirPath, function (error, node) {
                expect(error).to.not.exist();
                expect(node).to.exist();
                fileBrowser.loadChildren(node, function (error, node) {
                    expect(error).to.not.exist();
                    expect(node).to.exist();
                    expect(node.children).to.have.length(2);
                    expect(node.children[0].path).to.equal(path.join(dummyDirPath, 'dummyFile1.txt'));
                    expect(node.children[0].isDirectory).to.equal(false);
                    expect(node.children[0].bytes).to.be.equal(0);
                    expect(node.children[0].collapsed).to.equal(true);
                    expect(node.children[1].path).to.equal(path.join(dummyDirPath, 'dummySubdir1'));
                    expect(node.children[1].isDirectory).to.equal(true);
                    expect(node.children[1].bytes).to.be.greaterThan(0);
                    expect(node.children[1].collapsed).to.equal(true);
                    done();
                })
            });
        });

        it('can load a file', function (done) {
            var currentDirPath = __dirname;
            var filePath = path.join(currentDirPath, 'dummyNode.txt');
            fileBrowser.getRootNode(filePath, function (error, node) {
                expect(error).to.not.exist();
                expect(node).to.exist();
                expect(node.path).to.equal(filePath);
                expect(node.isDirectory).to.equal(false);
                expect(node.bytes).to.be.greaterThan(0);
                expect(node.collapsed).to.equal(true);
                expect(node.parent).to.not.exist();
                done();
            });
        });
    });
});
