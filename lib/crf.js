'use strict';

var Feature = require("./feature.js");
var SGD = require("./sgd.js");
var Cost = require('./crfCostFunction.js');

module.exports = CRF;

function CRF () {
    this.feature = new Feature();
    console.time('generate-features');
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
    var initialTheta = optimizedInitialTheta(this.feature.size());
    var options = {
	"costFunction": Cost.calcGradients,
	"initialTheta": initialTheta,
	"maxIter": 100,
    }
    var model = sgd.train(options);
    this.feature.save(model);
};

function optimizedInitialTheta (length) {
    var initialTheta = [];
    for(var i = 0; i < length ; i++) {
	initialTheta.push(1);
    }
    return initialTheta;
}

CRF.prototype.test = function (modelFile) {
    console.log('test and cross validation...');
};


CRF.prototype.predict = function (modelFile, dataFile) {
    console.log('predict labeling...');
};
