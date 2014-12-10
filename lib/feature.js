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
    this.trainDatas = [];
};


Feature.prototype.setThetas = function (thetas) {
    this.thetas = thetas.elements;
};


Feature.prototype.loadModel = function (modelFile) {
    console.log('load model....');
    var data = fs.readFileSync(modelFile, 'utf8');
    var model = JSON.parse(data);
    this.unigramTemplates = model.unigramTemplates;
    this.bigramTemplates = model.bigramTemplates;
    this.featureSet = model.featureSet;
    this.thetas = model.thetas;
    this.y = model.y;
    this.decoder = new Decoder ( this.unigramTemplates
				 , this.bigramTemplates
				 , this.y);
    data = null;
    model = null;
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
		if (line == 'B')
		    _this.bigramTemplates.push('B-1-1:%x[0,0]');
		else
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
    var trainData = "0";
    fs.readFile(trainFile, {encoding: 'utf8'}, function(err, data) {
	if (err || !data) return callback(err);

	var lines = data.split('\n');

	var line;
	for (var i = 0, l = lines.length; i < l; i++) {
	    line = lines[i].split(/[\s\t]/);
	    if (!line[0]) {
		trainData += ','+i;
		_this.trainDatas.push(trainData);
		trainData = i+1+'';
	    }
	    _this.X.push(line);
	}

	// var labelIndex = _this.X[0].length - 1;
	// var yObj = {};
	// var label;
	// for (var i = 0, l = _this.X.length; i < l; i++) {
	//     label = _this.X[i][labelIndex];
	//     if (!label) continue;
	//     yObj[label] = 1;
	// }
	// _this.y = Object.keys(yObj);
	_this.y = extractY(X);
	_this.decoder = new Decoder(_this.unigramTemplates
				    , _this.bigramTemplates
				    , _this.y);
	callback(null);
    });
};

Feature.prototype.buildFeatures = function (callback) {
    var uMacros = [];
    var bMacros = [];
    var i, j, l, len;
    var id = 0;
    for (i = 0, l = this.X.length; i < l; i++) {
	uMacros = this.decoder.decodeMacrosUnigram(this.X, i);
	bMacros = this.decoder.decodeMacrosBigram(this.X, i);
	for (j = 0, len = uMacros.length; j < len; j++) {
	    if (!this.featureSet[uMacros[j]]) {
		this.featureSet[uMacros[j]] = id++;
	    }
	}
	
	for (j = 0, len = bMacros.length; j < len; j++) {
	    if (!this.featureSet[bMacros[j]]) {
		this.featureSet[bMacros[j]] = id++;
	    }
	}
    }

    callback();
};


Feature.prototype.decodeMacro = function (X, curIndex) {
    return this.decoder.getMacros(X, curIndex);
};

Feature.prototype.getRandomX = function () {
    var randomIndex = Math.floor(this.trainDatas.length * Math.random());
    randomIndex = this.trainDatas[randomIndex].split(',');
    var start = parseInt(randomIndex[0]);
    var end = parseInt(randomIndex[1]);
    if (start == end) {
	return [];
    }
    var data = [];
    for(var i = start; i < end; i++) {
	data.push(this.X[i]);
    }
    return data;
};

Feature.prototype.getY = function () {
    return this.y;
};

Feature.prototype.getLabelSize = function () {
    return this.y.length;
};

Feature.prototype.getIndex = function (key) {
    return this.featureSet[key];
};

Feature.prototype.size = function () {
    return Object.keys(this.featureSet).length;
};

Feature.prototype.save = function () {
    var model = {};
    model.y = this.y;
    model.unigramTemplates = this.unigramTemplates;
    model.bigramTemplates = this.bigramTemplates;
    model.featureSet = this.featureSet;
    model.thetas = this.thetas;
    fs.writeFileSync('./model.data', JSON.stringify(model));
    console.log('saving model to file');
};

Feature.prototype.print = function () {
//    console.log('unigram:', this.unigramTemplates);
//    console.log('bigram:', this.bigramTemplates);
    //    console.log('corpus X:', this.X.length);
    //    console.log('labelSet:', this.y);
    console.log('labels:', this.y.length);
    //    console.log('training datas:', this.trainDatas);
    //console.log('featureSet:', this.featureSet);
    console.log('featureSet size:', this.size());
};

function extractY (X) {
    var labelIndex = _this.X[0].length - 1;
    var yObj = {};
    var label;
    for (var i = 0, l = _this.X.length; i < l; i++) {
	label = _this.X[i][labelIndex];
	if (!label) continue;
	yObj[label] = 1;
    }
    return Object.keys(yObj);
};
