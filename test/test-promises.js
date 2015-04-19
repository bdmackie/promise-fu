'use strict';
var expect = require('chai').expect;
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
 * Baseline test to test assumptions about how promises work with serial and parallel behaviour.
 */
describe('promises', function() {
    it('should finish in order when serial', function() {
        tm.reset();
        return new Promise(f1)
            .then(function() { return new Promise(f2); })
            .then(function() { return new Promise(f3); })
            .then(function() {
                expect(tm.logger.all()).to.eql(
                    ['f1 start', 'f1 finish', 'f2 start', 'f2 finish', 'f3 start', 'f3 finish']
                    );
            });
    });

    it('should start promises in parallel when not chained and joined by an all', function() {
        tm.reset();
        var p = [];
        p.push(new Promise(f1));
        p.push(new Promise(f2));
        p.push(new Promise(f3));
        return Promise.all(p)
           .then(function() {
                expect(tm.logger.all()).to.have.members(
                    ['f1 start', 'f1 finish', 'f2 start', 'f2 finish', 'f3 start', 'f3 finish']
                    );
                expect(tm.logger.range(0, 3)).to.have.members(
                    ['f1 start', 'f2 start', 'f3 start']
                    );
            });
    });

    it('should fork and join with appropriate use of then and all', function() {
        tm.reset();
        var p = new Promise(f1);
        p = p.then(function() {
            var promises = [];
            promises.push(new Promise(f2));
            promises.push(new Promise(f3));
           return Promise.all(promises)
        })
        .then(function() { return new Promise(f4); })
        .then(function() {
                expect(tm.logger.all()).to.have.members(
                    ['f1 start', 'f1 finish', 'f2 start', 'f2 finish', 'f3 start', 'f3 finish', 'f4 start', 'f4 finish']
                    );
                expect(tm.logger.range(0, 2)).to.eql(
                    ['f1 start', 'f1 finish']
                    );
                expect(tm.logger.range(2, 4)).to.have.members(
                    ['f2 start', 'f2 finish', 'f3 start', 'f3 finish']
                    );
                expect(tm.logger.range(6, 2)).to.eql(
                    ['f4 start', 'f4 finish']
                    );  
        });
        return p;
    });
});
