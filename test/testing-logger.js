'use strict';
var _ = require('underscore');

function TestingLog() {
	var _this = this;

	var _logs = [];

	_this.log = function(item) {
		_logs.push(item);
	}

	_this.contains = function(x) {
		return _logs.indexOf(x) >= 0;
	}

	_this.all = function() {
		return _logs;
	}

	_this.range = function(start, count) {
		return _logs.slice(start, start + count);
	}

	_this.clear = function() {
		_logs = [];
	}
}

module.exports = TestingLog;