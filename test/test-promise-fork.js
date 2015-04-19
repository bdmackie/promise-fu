'use strict';
var expect = require('chai').expect;
var PromiseFork = require('../promise-fork');
var tm = require('./testing-model');

// Copy test func data locally.
var f1 = tm.f1;
var f2 = tm.f2;
var f3 = tm.f3;
var f4 = tm.f4;
var f5 = tm.f5;
var f6 = tm.f6;
var l1 = tm.l1;
var e1 = tm.e1;

/**
 * Test the promise-fork module.
 */
describe('promise-fork', function() {
    it('should start promises in parallel when not chained and joined by an all', function() {
        tm.reset();
        var f = new PromiseFork();

        f.addResolver(f1);
        f.addPromiser(function() { return new Promise(f2) });
        f.addResolver(f3);
        return f.join()
           .then(function() {
                expect(tm.logger.all()).to.have.members(
                    ['f1 start', 'f1 finish', 'f2 start', 'f2 finish', 'f3 start', 'f3 finish']
                    );
                expect(tm.logger.range(0, 3)).to.have.members(
                    ['f1 start', 'f2 start', 'f3 start']
                    );
            });
    });

    it('should start promises in parallel when not chained and joined by an all from parent', function() {
        tm.reset();

        var p = new Promise(f1);
        var f = new PromiseFork(p);

        f.addPromiser(function() { return new Promise(f2) });
        f.addResolver(f3);
        return f.join()
           .then(function() {
                expect(tm.logger.all()).to.have.members(
                    ['f1 start', 'f1 finish', 'f2 start', 'f2 finish', 'f3 start', 'f3 finish']
                    );
                expect(tm.logger.range(0, 2)).to.eql(
                    ['f1 start', 'f1 finish']
                    );
                expect(tm.logger.range(2, 2)).to.have.members(
                    ['f2 start', 'f3 start']
                    );
            });
    });

    it('should start promises in parallel when not chained and joined by an all from long parent', function() {
        tm.reset();

        var p = new Promise(l1);
        var f = new PromiseFork(p);

        f.addPromiser(function() { return new Promise(f2) });
        f.addResolver(f3);
        return f.join()
           .then(function() {
                expect(tm.logger.all()).to.have.members(
                    ['l1 start', 'l1 finish', 'f2 start', 'f2 finish', 'f3 start', 'f3 finish']
                    );
                expect(tm.logger.range(0, 2)).to.eql(
                    ['l1 start', 'l1 finish']
                    );
                expect(tm.logger.range(2, 2)).to.have.members(
                    ['f2 start', 'f3 start']
                    );
            });
    });

    it('should join on any', function() {
        tm.reset();

        var f = new PromiseFork();
        f.addResolver(f1);
        f.addResolver(f2);
        f.addResolver(l1);
        return f.joinAny()
           .then(function() {
                expect(tm.logger.all()).to.have.members(
                    ['f1 start', 'f1 finish', 'f2 start', 'f2 finish', 'l1 start']
                    );
                expect(tm.logger.range(0, 3)).to.have.members(
                    ['f1 start', 'f2 start', 'l1 start']
                    );
            });
    });

    it('should throw when joining on all with errors', function() {
        tm.reset();

        var f = new PromiseFork();
        f.addResolver(f1);
        f.addResolver(f2);
        f.addResolver(e1);
        return f.join()
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

        var f = new PromiseFork();
        f.addResolver(f1);
        f.addResolver(f2);
        f.addResolver(e1);
        return f.joinSettle()
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
