"use strict";

var config = require('db/config.js');
var IN_MEMORY_DB = '';

config.dbBasePath = IN_MEMORY_DB;

var db = require('db/db.js')
    , chai = require('chai')
    , expect = chai.expect
    , async = require('async')
    , documentRepository = require('document/document-repository');

beforeEach(function clearDatabase(done) {
    db.remove({}, {multi: true}, function (error) {
        expect(error).to.not.exist();
        done();
    });
});

describe('DocumentRepository', function () {
    describe('#save(document, callback)', function () {
        it('can store a document in the repository', function (done) {
            var document = {
                documentType: 'TestDocument',
                key: '1',
                someProperty: 'someValue'
            };
            async.series([
                function (callback) {
                    documentRepository.save(document, function (error) {
                        callback(error);
                    });
                },
                function (callback) {
                    documentRepository.findAll(function (error, loadedDocuments) {
                        expect(loadedDocuments).to.exist();
                        expect(loadedDocuments.length).to.equal(1);
                        loadedDocuments[0].documentType.should.be.equal('TestDocument');
                        loadedDocuments[0].key.should.be.equal('1');
                        loadedDocuments[0].someProperty.should.be.equal("someValue");
                        callback(error);
                    });
                }
            ], function (error) {
                expect(error).to.not.exist();
                done();
            });
        });

        it('can overwrite a document with the same key', function (done) {
            async.series([
                function storeFirstVersion(callback) {
                    var originalDocument = {
                        documentType: 'TestDocument',
                        key: '1',
                        someProperty: 'originalValue'
                    };
                    documentRepository.save(originalDocument, callback);
                },
                function storeSecondVersion(callback) {
                    var updatedDocument = {
                        documentType: 'TestDocument',
                        key: '1',
                        someProperty: 'newValue'
                    };
                    documentRepository.save(updatedDocument, callback);
                },
                function validateNewVersionInRepository(callback) {
                    documentRepository.findAll(function (error, loadedDocuments) {
                        expect(loadedDocuments).to.exist();
                        expect(loadedDocuments.length).to.equal(1);
                        loadedDocuments[0].someProperty.should.be.equal("newValue");
                        callback(error);
                    });
                }
            ], function (error) {
                expect(error).to.not.exist();
                done();
            });
        });

        it('can update a document', function (done) {
            async.waterfall([
                function saveOriginalDocument(callback) {
                    var originalDocument = {
                        documentType: 'TestDocument',
                        key: '1',
                        someProperty: 'originalValue'
                    };
                    documentRepository.save(originalDocument, callback);
                },
                function updateDocument(document, callback) {
                    expect(document).to.exist();
                    expect(document._id).to.exist();
                    document.someProperty = 'newValue';
                    documentRepository.save(document, callback);
                },
                function validateNewVersionInRepository(updatedDocument, callback) {
                    documentRepository.findAll(function (error, loadedDocuments) {
                        expect(loadedDocuments).to.exist();
                        expect(loadedDocuments.length).to.equal(1);
                        loadedDocuments[0].someProperty.should.be.equal("newValue");
                        callback(error);
                    });
                }
            ], function (error) {
                expect(error).to.not.exist();
                done();
            });
        });

        it('cannot save \'undefined\' as a document', function (done) {
            documentRepository.save(undefined, function (error) {
                error.should.equal('Document is required');
                done();
            });
        });

        it('cannot save \'null\' as a document', function (done) {
            documentRepository.save(null, function (error) {
                error.should.equal('Document is required');
                done();
            });
        });

    });

    describe('#getByFilter(filter, callback)', function () {
        it('returns null if there are no matching items', function (done) {
            documentRepository.getByFilter({documentType: 'unknown'}, function (error, document) {
                expect(error).to.not.exist();
                expect(document).to.not.exist();
                done();
            });
        });

        it('returns the document matching the given filter', function (done) {
            async.series([
                function storeMatchingDocument(callback) {
                    var matchingDocument = {
                        documentType: 'TestDocument',
                        key: '1'
                    };
                    documentRepository.save(matchingDocument, callback);
                },
                function storeOtherDocument(callback) {
                    var otherDocument = {
                        documentType: 'TestDocument',
                        key: '2'
                    };
                    documentRepository.save(otherDocument, callback);
                },
                function getByFilter(callback) {
                    documentRepository.getByFilter({
                        documentType: 'TestDocument',
                        key: '1'
                    }, function (error, document) {
                        expect(document).to.exist();
                        expect(document.key).to.equal('1');
                        callback(error);
                    })
                }
            ], function (error) {
                expect(error).to.not.exist();
                done();
            });
        });

        it('returns an error if multiple documents match the given filter', function (done) {
            async.series([
                function storeFirstMatchingDocument(callback) {
                    var firstMatchingDocument = {
                        documentType: 'TestDocument',
                        key: '1'
                    };
                    documentRepository.save(firstMatchingDocument, callback);
                },
                function storeSecondMatchingDocument(callback) {
                    var otherDocument = {
                        documentType: 'TestDocument',
                        key: '2'
                    };
                    documentRepository.save(otherDocument, callback);
                },
                function getByFilter(callback) {
                    documentRepository.getByFilter({documentType: 'TestDocument'}, function (error, document) {
                        expect(error).to.equal('2 documents found for filter');
                        callback(null);
                    })
                }
            ], function (error) {
                expect(error).to.not.exist();
                done();
            });
        });

    });

});
