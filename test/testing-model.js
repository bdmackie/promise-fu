'use strict';
var TestingLogger = require('./testing-logger');
var logger = new TestingLogger();
var runHash = 0;

function reset() {
    logger.clear();
    // Increment run hash to stop trailing log events from messing
    // with later tests assertions (e.g. when joining 'any' style).
    runHash++;
}

var DELAY = 5;

function f1(resolve, reject) {
    var rh = runHash;
    logger.log("f1 start");
    setTimeout(function() { 
            if (rh == runHash)
                logger.log("f1 finish");
            resolve();
        }, 
        DELAY
    );
}

function f2(resolve, reject) {
    var rh = runHash;
    logger.log("f2 start");
    setTimeout(function() { 
            if (rh == runHash)
                logger.log("f2 finish");
            resolve();
        }, 
        DELAY
    );
}

function f3(resolve, reject) {
    var rh = runHash;
    logger.log("f3 start");
    setTimeout(function() { 
            if (rh == runHash)
                logger.log("f3 finish");
            resolve();
        }, 
        DELAY
    );
}

function f4(resolve, reject) {
    var rh = runHash;
    logger.log("f4 start");
    setTimeout(function() { 
            if (rh == runHash)
                logger.log("f4 finish");
            resolve();
        }, 
        DELAY
    );
}

function f5(resolve, reject) {
    var rh = runHash;
    logger.log("f5 start");
    setTimeout(function() { 
            if (rh == runHash)
                logger.log("f5 finish");
            resolve();
        }, 
        DELAY
    );
}

function f6(resolve, reject) {
    var rh = runHash;
    logger.log("f6 start");
    setTimeout(function() { 
            if (rh == runHash)
                logger.log("f6 finish");
            resolve();
        }, 
        DELAY
    );
}

function l1(resolve, reject) {
    var rh = runHash;
    logger.log("l1 start");
    setTimeout(function() { 
            if (rh == runHash)
                logger.log("l1 finish");
            resolve();
        }, 
        DELAY * 5
    );
}

function e1(resolve, reject) {
    var rh = runHash;
    logger.log("e1 start");
    setTimeout(function() { 
            if (rh == runHash)
                logger.log("e1 finish");
            reject("e1 reject");
        }, 
        DELAY
    );
}

module.exports = {
    "reset": reset,
    "logger": logger,
    "f1": f1,
    "f2": f2,
    "f3": f3,
    "f4": f4,
    "f5": f5,
    "f6": f6,
    "l1": l1,
    "e1": e1
}