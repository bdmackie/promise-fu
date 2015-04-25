'use strict';
var expect = require('chai').expect;
var PromiseChain = require('../index').PromiseChain;
var tm = require('./testing-model');

// Copy test func data locally.
var f1 = tm.f1;
var f2 = tm.f2;
var f3 = tm.f3;
var f4 = tm.f4;
var f5 = tm.f5;
var f6 = tm.f6;
var p1 = tm.p1;
var p2 = tm.p2;
var p3 = tm.p3;
var p4 = tm.p4;
var p5 = tm.p5;
var p6 = tm.p6;
var l1 = tm.l1;
var e1 = tm.e1;

/**
 * Test the promise-chain module.
 */
describe('promise-chain', function() {
    it('should finish in order when serial', function() {
        tm.reset();
        var c = new PromiseChain();

        return c.addResolver(f1)
            .addResolver(f2)
            .addResolver(f3)
            .then(function() {
                expect(tm.logger.all()).to.eql(
                    ['f1 start', 'f1 finish', 'f2 start', 'f2 finish', 'f3 start', 'f3 finish']
                    );
            });
    });

    it('should finish in order when serial from parent', function() {
        tm.reset();
        var p = new Promise(f1);

        var c = new PromiseChain(p);

        return c.addResolver(f2)
            .addResolver(f3)
            .then(function() {
                expect(tm.logger.all()).to.eql(
                    ['f1 start', 'f1 finish', 'f2 start', 'f2 finish', 'f3 start', 'f3 finish']
                    );
            });
    });

    it('should start promises in parallel when forked immediately and joined by an all', function() {
        tm.reset();

        var c = new PromiseChain();
        return c.fork().addResolver(f1)
            .addResolver(f2)
            .addPromiser(p3)
            .join()
            .then(function() {
                expect(tm.logger.all()).to.have.members(
                    ['f1 start', 'f1 finish', 'f2 start', 'f2 finish', 'f3 start', 'f3 finish']
                    );
                expect(tm.logger.range(0, 3)).to.have.members(
                    ['f1 start', 'f2 start', 'f3 start']
                    );
            });
    });

    it('should start promises in parallel when forked immediately and implicitly joined with a then', function() {
        tm.reset();

        var c = new PromiseChain();
        return c.fork().addResolver(f1)
            .addPromiser(p2)
            .addResolver(f3)
            .then(function() {
                expect(tm.logger.all()).to.have.members(
                    ['f1 start', 'f1 finish', 'f2 start', 'f2 finish', 'f3 start', 'f3 finish']
                    );
                expect(tm.logger.range(0, 3)).to.have.members(
                    ['f1 start', 'f2 start', 'f3 start']
                    );
            });
    });

    it('should join on all when adding multiple resolvers.', function() {
        tm.reset();

        var c = new PromiseChain();
        return c
            .addResolvers([f1, f2, f3])
            .addResolver(f4)
            .then(function() {
                expect(tm.logger.all()).to.include.members(
                    ['f1 start', 'f1 finish', 'f2 start', 'f2 finish', 'f3 start', 'f3 finish', 'f4 start', 'f4 finish']
                    );
                expect(tm.logger.range(0, 3)).to.have.members(
                    ['f1 start', 'f2 start', 'f3 start']
                    );
                expect(tm.logger.range(6, 2)).to.have.members(
                    ['f4 start', 'f4 finish']
                    );
                },
                function(error) {
                    throw new Error("Shouldn't get here: " + error);
                }
                );
    });

    it('should join on all when adding multiple promisers.', function() {
        tm.reset();

        var c = new PromiseChain();
        return c
            .addPromisers([p1, p2, p3])
            .addResolver(f4)
            .then(function() {
                expect(tm.logger.all()).to.include.members(
                    ['f1 start', 'f1 finish', 'f2 start', 'f2 finish', 'f3 start', 'f3 finish', 'f4 start', 'f4 finish']
                    );
                expect(tm.logger.range(0, 3)).to.have.members(
                    ['f1 start', 'f2 start', 'f3 start']
                    );
                expect(tm.logger.range(6, 2)).to.have.members(
                    ['f4 start', 'f4 finish']
                    );
                },
                function(error) {
                    throw new Error("Shouldn't get here: " + error);
                }
                );
    });

    it('should appropriately serliase, fork and join promises', function() {
        tm.reset();

        var c = new PromiseChain();
        return c.addResolver(f1)
            .fork()
            .addResolver(f2)
            .addResolver(f3)
            .join()
            .addResolver(f4)
            .then(function() {
                expect(tm.logger.all()).to.have.members(
                    ['f1 start', 'f1 finish', 'f2 start', 'f2 finish', 'f3 start', 'f3 finish', 'f4 start', 'f4 finish']
                    );
                expect(tm.logger.range(0, 2)).to.eql(
                    ['f1 start', 'f1 finish']
                    );
                expect(tm.logger.range(2,4)).to.have.members(
                    ['f2 start', 'f2 finish', 'f3 start', 'f3 finish']
                    );
                expect(tm.logger.range(2,2)).to.have.members(
                    ['f2 start', 'f3 start']
                    );
                expect(tm.logger.range(6, 2)).to.eql(
                    ['f4 start', 'f4 finish']
                    );
            });
    });

    it('should appropriately serliase, fork and join promises more than once', function() {
        tm.reset();

        var c = new PromiseChain();
        return c.addResolver(f1)
            .fork()
            .addResolver(f2)
            .join()
            .addResolver(f3)
            .fork()
            .addResolver(f4)
            .addResolver(f5)
            .join()
            .addResolver(f6)
            .then(function() {
                expect(tm.logger.all()).to.have.members(
                    ['f1 start', 'f1 finish', 'f2 start', 'f2 finish', 'f3 start', 'f3 finish', 
                        'f4 start', 'f4 finish', 'f5 start', 'f5 finish', 'f6 start', 'f6 finish']
                    );
                expect(tm.logger.range(0, 2)).to.eql(
                    ['f1 start', 'f1 finish']
                    );
                expect(tm.logger.range(2, 2)).to.eql(
                    ['f2 start', 'f2 finish']
                    );
                expect(tm.logger.range(4, 2)).to.eql(
                    ['f3 start', 'f3 finish']
                    );
                expect(tm.logger.range(6,4)).to.have.members(
                    ['f4 start', 'f4 finish', 'f5 start', 'f5 finish']
                    );
                expect(tm.logger.range(6,2)).to.have.members(
                    ['f4 start', 'f5 start']
                    );
                expect(tm.logger.range(10, 2)).to.eql(
                    ['f6 start', 'f6 finish']
                    );
            });
    });

    it('should appropriately join on any', function() {
        tm.reset();

        var c = new PromiseChain();
        return c.addResolver(f1)
            .fork()
            .addResolver(f2)
            .addResolver(l1)
            .joinAny()
            .then(function() {
                expect(tm.logger.all()).to.have.members(
                    ['f1 start', 'f1 finish', 'f2 start', 'f2 finish', 'l1 start']
                    );
                expect(tm.logger.range(0, 2)).to.eql(
                    ['f1 start', 'f1 finish']
                    );
                expect(tm.logger.range(2,3)).to.have.members(
                    ['f2 start', 'f2 finish', 'l1 start']
                    );
                expect(tm.logger.range(2,2)).to.have.members(
                    ['f2 start', 'l1 start']
                    );
            });
    });

    it('should throw when joining on all with errors', function() {
        tm.reset();

        var c = new PromiseChain();
        return c.addResolver(f1)
            .fork()
            .addResolver(f2)
            .addResolver(e1)
            .join()
            .then(
                function() {
                    throw new Error("Shouldn't get here");
                },
                function(error) {
                    expect(error).to.equal("e1 reject");
                }
                );
    });

    it('should work when joining on settle with errors', function() {
        tm.reset();

        var c = new PromiseChain();
        return c
            .fork()
            .addResolver(f1)
            .addResolver(f2)
            .addResolver(e1)
            .joinSettle()
            .then(
                function() {
                expect(tm.logger.all()).to.have.members(
                    ['f1 start', 'f1 finish', 'f2 start', 'f2 finish', 'e1 start', 'e1 finish']
                    );
                expect(tm.logger.range(0, 3)).to.have.members(
                    ['f1 start', 'f2 start', 'e1 start']
                    );
                },
                function(error) {
                    throw new Error("Shouldn't get here");
                }
                );
    });
});
