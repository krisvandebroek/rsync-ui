"use strict";

var config = require('db/config.js');
var IN_MEMORY_DB = '';

config.dbBasePath = IN_MEMORY_DB;

var db = require('db/db.js')
    , _ = require('underscore')
    , chai = require('chai')
    , should = chai.should()
    , expect = chai.expect
    , async = require('async')
    , RsyncConfig = require('rsync/rsync-command/rsync-config')
    , rsyncRepository = require('rsync/rsync-command/rsync-repository');

beforeEach(function clearDatabase(done) {
    db.remove({}, {multi: true}, function (error) {
        expect(error).to.not.exist();
        done();
    });
});

describe('RsyncRepository', function () {
    describe('#save(rsyncConfig, callback)', function () {
        it('can store a rsync config in the repository (without async)', function (done) {
            var rsyncConfig = new RsyncConfig();
            rsyncConfig.rsyncConfigName = "dummyConfig";
            rsyncRepository.save(rsyncConfig, function (error, savedRsyncConfig) {
                expect(error).to.not.exist();
                expect(savedRsyncConfig).to.exist();
                expect(savedRsyncConfig._id).to.not.be.empty();
                rsyncRepository.getByRsyncConfigName("dummyConfig", function (error, loadedRsyncConfig) {
                    should.exist(loadedRsyncConfig);
                    should.exist(loadedRsyncConfig.rsyncConfigName);
                    loadedRsyncConfig.rsyncConfigName.should.be.equal("dummyConfig");
                    done();
                });
            });
        });

        it('can store a rsync config in the repository (using async)', function (done) {
            var rsyncConfig = new RsyncConfig();
            rsyncConfig.rsyncConfigName = "dummyConfig";
            async.series([
                function (callback) {
                    rsyncRepository.save(rsyncConfig, function (error) {
                        expect(error).to.not.exist();
                        callback();
                    });
                },
                function (callback) {
                    rsyncRepository.getByRsyncConfigName("dummyConfig", function (error, loadedRsyncConfig) {
                        should.exist(loadedRsyncConfig);
                        should.exist(loadedRsyncConfig.rsyncConfigName);
                        loadedRsyncConfig.rsyncConfigName.should.be.equal("dummyConfig");
                        callback();
                    });
                }
            ], function (error) {
                expect(error).to.not.exist();
                done();
            });
        });

        it('can update a rsync config', function (done) {
            var rsyncConfig = aRsyncConfig().rsyncConfigName('firstName').build();
            rsyncRepository.save(rsyncConfig, function (error, savedRsyncConfig) {
                expect(error).to.not.exist();
                savedRsyncConfig.rsyncConfigName = 'secondName';
                rsyncRepository.save(savedRsyncConfig, function (error, secondSavedRsyncConfig) {
                    expect(error).to.not.exist();
                    expect(secondSavedRsyncConfig.rsyncConfigName).to.equal('secondName');
                    done();
                });
            });
        });

        it('can update a loaded rsync config', function (done) {
            var rsyncConfig = aRsyncConfig().rsyncConfigName('firstName').build();
            rsyncRepository.save(rsyncConfig, function (error, savedRsyncConfig) {
                expect(error).to.not.exist();
                expect(savedRsyncConfig).to.exist();
                rsyncRepository.getByRsyncConfigName('firstName', function (error, loadedRsyncConfig) {
                    loadedRsyncConfig.rsyncConfigName = 'secondName';
                    rsyncRepository.save(loadedRsyncConfig, function (error, updatedRsyncConfig) {
                        expect(error).to.not.exist();
                        expect(updatedRsyncConfig.rsyncConfigName).to.equal('secondName');
                        done();
                    });
                })
            });
        });

        it('a rsync config is mandatory for saving (without async)', function (done) {
            rsyncRepository.save(undefined, function (error) {
                error.should.equal('RsyncConfig is required');
                rsyncRepository.save(null, function (error) {
                    error.should.equal('RsyncConfig is required');
                    rsyncRepository.save(null, function (error) {
                        expect(error).to.equal('RsyncConfig is required');
                        done();
                    });
                });
            });
        });

        it('a rsync config is mandatory for saving (with async)', function (done) {
            async.parallel([
                function (callback) {
                    rsyncRepository.save(undefined, function (error) {
                        error.should.equal('RsyncConfig is required');
                        callback();
                    });
                },
                function (callback) {
                    rsyncRepository.save(null, function (error) {
                        error.should.equal('RsyncConfig is required');
                        callback();
                    });
                },
                function (callback) {
                    rsyncRepository.save(null, function (error) {
                        expect(error).to.equal('RsyncConfig is required');
                        callback();
                    });
                }
            ], function (error) {
                expect(error).to.not.exist();
                done();
            })
        });

        it('requires the rsync config name to be unique (without async)', function (done) {
            var firstRsyncConfig = aRsyncConfig().rsyncConfigName("myConfig").build();
            rsyncRepository.save(firstRsyncConfig, function (error) {
                expect(error).to.not.exist();
                var violatingUniquenesssRsyncConfig = aRsyncConfig().rsyncConfigName("myConfig").build();
                rsyncRepository.save(violatingUniquenesssRsyncConfig, function (error) {
                    expect(error).to.equal('A rsync config with name \'myConfig\' already exists');
                    expect(error).to.equal("A rsync config with name 'myConfig' already exists");
                    done();
                });
            });
        });

        it('requires the rsync config name to be unique (with async)', function (done) {
            var firstRsyncConfig = aRsyncConfig().rsyncConfigName("myConfig").build();
            async.series([
                function (callback) {
                    rsyncRepository.save(firstRsyncConfig, function (error) {
                        expect(error).to.not.exist();
                        callback();
                    });
                },
                function (callback) {
                    var violatingUniquenesssRsyncConfig = aRsyncConfig().rsyncConfigName("myConfig").build();
                    rsyncRepository.save(violatingUniquenesssRsyncConfig, function (error) {
                        expect(error).to.equal('A rsync config with name \'myConfig\' already exists');
                        expect(error).to.equal("A rsync config with name 'myConfig' already exists");
                        callback();
                    });
                }
            ], function (error) {
                expect(error).to.not.exist();
                done();
            });
        });
    });

    describe('#findAll(callback)', function () {
        it('finds all rsync configs and provides them to the callback (without async)', function (done) {
            var rsyncConfig1 = aRsyncConfig().rsyncConfigName("dummyConfig1").build();
            var rsyncConfig2 = aRsyncConfig().rsyncConfigName("dummyConfig2").build();
            rsyncRepository.save(rsyncConfig1, function (error) {
                expect(error).to.not.exist();
                rsyncRepository.save(rsyncConfig2, function (error) {
                    expect(error).to.not.exist();
                    rsyncRepository.findAll(function (error, loadedRsyncConfigs) {
                        expect(error).to.not.exist();
                        expect(loadedRsyncConfigs).to.exist();
                        expect(loadedRsyncConfigs).to.have.length(2);
                        var sortedRsyncConfigs = _.sortBy(loadedRsyncConfigs, 'rsyncConfigName');
                        expect(sortedRsyncConfigs[0].rsyncConfigName).to.equal('dummyConfig1');
                        expect(sortedRsyncConfigs[1].rsyncConfigName).to.equal('dummyConfig2');
                        done();
                    });
                });
            });
        });

        it('finds all rsync configs and provides them to the callback (with async)', function (done) {
            var rsyncConfig1 = aRsyncConfig().rsyncConfigName("dummyConfig1").build();
            var rsyncConfig2 = aRsyncConfig().rsyncConfigName("dummyConfig2").build();
            async.series([
                function (callback) {
                    rsyncRepository.save(rsyncConfig1, function (error) {
                        expect(error).to.not.exist();
                        callback();
                    });
                },
                function (callback) {
                    rsyncRepository.save(rsyncConfig2, function (error) {
                        expect(error).to.not.exist();
                        callback();
                    });
                },
                function (callback) {
                    rsyncRepository.findAll(function (error, loadedRsyncConfigs) {
                        expect(error).to.not.exist();
                        expect(loadedRsyncConfigs).to.exist();
                        expect(loadedRsyncConfigs).to.have.length(2);
                        var sortedRsyncConfigs = _.sortBy(loadedRsyncConfigs, 'rsyncConfigName');
                        expect(sortedRsyncConfigs[0].rsyncConfigName).to.equal('dummyConfig1');
                        expect(sortedRsyncConfigs[1].rsyncConfigName).to.equal('dummyConfig2');
                        callback();
                    });
                }
            ], function (error) {
                expect(error).to.not.exist();
                done();
            })
        });

        it('returns an empty array when there are no results', function (done) {
            rsyncRepository.findAll(function (error, loadedRsyncConfigs) {
                expect(error).to.not.exist();
                expect(loadedRsyncConfigs).to.exist();
                expect(loadedRsyncConfigs).to.have.length(0);
                done();
            });
        });
    });

    describe('#getByRsyncConfigName(rsyncConfigName, callback)', function () {
        it('returns null if there are no matching items', function (done) {
            rsyncRepository.getByRsyncConfigName('nonExistingName', function (error, loadedRsyncConfig) {
                expect(error).to.not.exist();
                expect(loadedRsyncConfig).to.not.exist();
                done();
            });
        });

        it('returns the rsync config with the given name (without async)', function (done) {
            var rsyncConfig1 = aRsyncConfig().rsyncConfigName("dummyConfig1").build();
            rsyncRepository.save(rsyncConfig1, function (error) {
                expect(error).to.not.exist();
                rsyncRepository.getByRsyncConfigName('dummyConfig1', function (error, loadedRsyncConfig) {
                    expect(error).to.not.exist();
                    expect(loadedRsyncConfig.rsyncConfigName).to.equal('dummyConfig1');
                    done();
                });
            });
        });

        it('returns the rsync config with the given name (with async)', function (done) {
            var rsyncConfig1 = aRsyncConfig().rsyncConfigName("dummyConfig1").build();
            async.series([
                function (callback) {
                    rsyncRepository.save(rsyncConfig1, function (error) {
                        expect(error).to.not.exist();
                        callback();
                    });
                },
                function (callback) {
                    rsyncRepository.getByRsyncConfigName('dummyConfig1', function (error, loadedRsyncConfig) {
                        expect(error).to.not.exist();
                        expect(loadedRsyncConfig.rsyncConfigName).to.equal('dummyConfig1');
                        callback();
                    });
                }
            ], function (error) {
                expect(error).to.not.exist();
                done();
            })
        });
    });

    describe('#getById(id)', function () {
        it('returns the rsync config with the given id', function (done) {
            var rsyncConfig = aRsyncConfig().rsyncConfigName("dummyConfig").build();
            async.series([
                function (callback) {
                    rsyncRepository.save(rsyncConfig, verifyAsync(callback, function (error, persistedRsyncConfig) {
                        expect(error).to.not.exist();
                        expect(persistedRsyncConfig).to.exist();
                        expect(persistedRsyncConfig._id).to.exist();
                        rsyncConfig = persistedRsyncConfig;
                    }))
                },
                function (callback) {
                    rsyncRepository.getById(rsyncConfig._id, verifyAsync(callback, function (error, loadedRsyncConfig) {
                        expect(error).to.not.exist();
                        expect(loadedRsyncConfig).to.exist();
                        expect(loadedRsyncConfig._id).to.equal(rsyncConfig._id);
                    }));
                }
            ], function (error) {
                done(error);
            })
        });
        it('returns null if there is no matching item found', function (done) {
            rsyncRepository.getById('1234567890', verifyAsync(done, function (error, loadedRsyncConfig) {
                expect(error).to.not.exist();
                expect(loadedRsyncConfig).to.not.exist();
            }));
        });
    });

    describe('#remove(id)', function () {
        it('removes the rsync config with the given id from the repository', function (done) {
            var rsyncConfig = aRsyncConfig().rsyncConfigName("dummyConfig").build();
            async.series([
                function (callback) {
                    rsyncRepository.save(rsyncConfig, verifyAsync(callback, function (error, persistedRsyncConfig) {
                        expect(error).to.not.exist();
                        expect(persistedRsyncConfig).to.exist();
                        expect(persistedRsyncConfig._id).to.exist();
                        rsyncConfig = persistedRsyncConfig;
                    }));
                },
                function (callback) {
                    rsyncRepository.remove(rsyncConfig._id, verifyAsync(callback, function (error) {
                        expect(error).to.not.exist();
                    }));
                },
                function (callback) {
                    rsyncRepository.getById(rsyncConfig._id, verifyAsync(callback, function (error, loadedRsyncConfig) {
                        expect(error).to.not.exist();
                        expect(loadedRsyncConfig).to.not.exist();
                    }));
                }
            ], function (error) {
                done(error);
            })
        });
        it('does not throw error is the object to delete does not exist', function (done) {
            rsyncRepository.remove('1234567890', function (error) {
                expect(error).to.not.exist();
                done();
            });
        })
    });

    function verifyAsync(doneCallback, callback) {
        return function () {
            try {
                callback.apply(this, arguments);
                doneCallback();
            } catch (error) {
                doneCallback(error);
            }
        }
    }

    function aRsyncConfig() {
        var rsyncConfig = new RsyncConfig();
        return {
            rsyncConfigName: function (rsyncConfigName) {
                rsyncConfig.rsyncConfigName = rsyncConfigName;
                return this;
            },
            build: function () {
                return rsyncConfig;
            }
        }
    }
});
