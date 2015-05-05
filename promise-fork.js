/**
 * @file Utility for maintaining and joining a set of promises running in parallel.
 * @copyright Ben Mackie 2015
 * @license MIT
 */
'use strict';
var Promise = require('bluebird');

function PromiseFork(parent) {
    var _this = this;

    if (parent && typeof parent.then != 'function')
        throw new Error('Argument specified not a promise.');

    var _promise = parent || Promise.resolve();
    var _isRunning = false;
    var _queue = [];
    var _running = [];

    // Setup promise to trigger the actual running of forked promises.
    _promise = _promise.then(function() {
        _isRunning = true;
        // Kick off queued promises.
        _queue.forEach(function(promiser) {
            _running.push(promiser());
        });
        _queue = [];
    });

    /**
     * Add a promiser to the fork. It'll either be queued or start running
     * straight away depending on if the parent promise has been fulfilled.
     * @param promiser - The promiser function to add.
     */
    _this.addPromiser = function(promiser) {
        if (_isRunning)
            _running.push(promiser());
        else
            _queue.push(promiser);
        return _this;      
    }

    /**
     * Sugar for adding a resolver function, i.e. Function(resolve, reject)
     * @param resolver - The resolver function to add.
     */
    // as a promiser.
    _this.addResolver = function(resolver) {
        return _this.addPromiser(function() { return new Promise(resolver); });
    }

    function doJoin(joinFn) {
        return _promise.then(function() {
            return joinFn(_running);
        });
    }

    // Join all 
    _this.join = function() {
        return doJoin(Promise.all);
    }

    _this.joinAny = function() {
        return doJoin(Promise.any);
    }

    _this.joinSettle = function() {
        return doJoin(Promise.settle);
    }
};

module.exports = PromiseFork;