'use strict';

var fs = require("fs");
var Decoder = require('./decoder.js');

module.exports = Feature;

function Feature () {
    this.X = [];
    this.y = [];
    this.unigramTemplates = [];
    this.bigramTemplates = [];
    this.featureSet = {};
    this.decoder = null;
};


Feature.prototype.load = function (templateFile, trainFile, callback) {
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
	    if (!line) continue;
	    _this.X.push(line);
	}

	var labelIndex = _this.X[0].length - 1;
	var yObj = {};
	var label;
	for (var i = 0, l = _this.X.length; i < l; i++) {
	    label = _this.X[i][labelIndex];
	    if (!label) continue;
	    yObj[label] = 1;
	}
	_this.y = Object.keys(yObj);
	_this.decoder = new Decoder(_this.unigramTemplates
				    , _this.bigramTemplates
				    , _this.y);
	callback(null);
    });
};

Feature.prototype.buildFeatures = function (callback) {
    var features = [];
    var uMacros = [];
    var bMacros = [];
    var i, j, l, len;
    for (i = 0, l = this.X.length; i < l; i++) {
	uMacros = this.decoder.decodeMacrosUnigram(this.X, i);
	bMacros = this.decoder.decodeMacroBigram(this.X, i);
	for (j = 0, len = uMacros.length; j < len; j++)
	    features.push(uMacros[j]);
	for (j = 0, len = bMacros.length; j < len; j++)
	    features.push(bMacros[j]);
    }
//    console.log(features[5748]);
    console.log(features);
    console.log('features:', features.length);

    callback();
};

Feature.prototype.print = function () {
    console.log('unigram:', this.unigramTemplates);
    console.log('bigram:', this.bigramTemplates);
    console.log('corpus X:', this.X.length);
    console.log('labels:', this.y.length);
    console.log('featureSet:', this.featureSet);
};
