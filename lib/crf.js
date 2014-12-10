'use strict';

var Feature = require("./feature.js");
var SGD = require("./sgd.js");
var Cost = require('./crfCostFunction.js');
var Tagger = require("./tagger.js");


module.exports = CRF;

function CRF () {
    this.feature = new Feature();
    console.time('generate-features');
};

CRF.prototype.tag = function (modelFile, dataFile, callback) {
    this.feature.loadModel(modelFile);
    console.time('tag time:');
    var tagger = new Tagger(this.feature);
    tagger.tag(dataFile, function (error, tags) {
	callback(error, tags);
	console.timeEnd('tag time:');
    });
};

CRF.prototype.learn = function (templateFile, trainFile, modelFile) {
    var _this = this;
    this.modelFile = modelFile;
    
    console.log('Loading data...');
    this.feature.load(templateFile, trainFile, function(error){
	if (error) return console.log(error);
	console.log('done.');
	_this.buildFeatures();
    });
};

CRF.prototype.buildFeatures = function () {
    var _this = this;
    this.feature.buildFeatures(function(error){
	if (error) return console.log(error);
	_this.feature.print();
	console.timeEnd('generate-features');
	_this.sgdTrain();
    });
};

CRF.prototype.sgdTrain = function () {
    var sgd = new SGD(this.feature);
    var initialThetas = optimizedInitialThetas(this.feature.size());
    var options = {
	"costFunction": Cost.calcGradients,
	"initialThetas": initialThetas,
	"maxIter": 3
    }
    
    // train a model in feature
    sgd.train(options);
    this.feature.save();
};

function optimizedInitialThetas (length) {
    var initialThetas = [];
    for(var i = 0; i < length ; i++) {
	initialThetas.push(1);
    }
    return initialThetas;
}

CRF.prototype.test = function (modelFile, dataFile, callback) {
    this.tag(modelFile, dataFile, callback);
};





