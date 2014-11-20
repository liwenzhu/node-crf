'use strict';

var fs = require("fs");

module.exports = Feature;

function Feature () {
    this.X = [];
    this.y = [];
    this.unigramTemplates = [];
    this.bigramTemplates = [];
};


Feature.prototype.load = function (templateFile, trainFile, callback) {
    console.log('load templates and train data,', templateFile, trainFile);
    this.loadTemplate(templateFile, trainFile, callback);    
};

Feature.prototype.loadTemplate = function (templateFile, trainFile, callback) {
    var _this = this;
    fs.readFile(templateFile, {encoding: 'utf8'}, function(err, data){
	if (err || !data) return callback(err);
	
	var lines = data.split('\n');

	var line;
	for (var i = 0, l = lines.length; i < l; i++) {
	    line = lines[i];
	    if (!line || line[0] == '#') continue;
	    if (line[0] == 'U') {
		_this.unigramTemplates.push(line);
	    } else if (line[0] == 'B') {
		_this.bigramTemplates.push(line);
	    } else {
		return callback('unknown type:' + line);
	    }
	}

	_this.loadTrain(trainFile, callback)
    });
};

Feature.prototype.loadTrain = function (trainFile, callback) {
    var _this = this;
    fs.readFile(trainFile, {encoding: 'utf8'}, function(err, data) {
	if (err || !data) return callback(err);

	var lines = data.split('\n');

	var line;
	for (var i = 0, l = lines.length; i < l; i++) {
	    line = lines[i].split(/[\s\t]/);
	    _this.X.push(line);
	}

	var labelIndex = _this.X[0].length - 1;
	for (var i = 0, l = _this.X.length; i < l; i++) {
	    _this.y.push(_this.X[i][labelIndex]);
	}

	callback(null);
    });
};

Feature.prototype.buildFeatures = function () {
    
};

Feature.prototype.print = function () {
    console.log(this.unigramTemplates);
    console.log(this.bigramTemplates);
    console.log(this.X);
    console.log(this.y);
};
