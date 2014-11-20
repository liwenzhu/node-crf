'use strict';

var Feature = require("./feature.js");
var SGD = require("./sgd.js");

module.exports = CRF;

function CRF () {
    this.feature = new Feature();
};

CRF.prototype.learn = function (templateFile, trainFile, modelFile) {
    var _this = this;
    this.modelFile = modelFile;
    
    console.log('Loading data...');
    this.feature.load(templateFile, trainFile, function(error){
	if (error) return console.log(error);
	console.log('done.');
	_this.feature.print();
	_this.buildFeatures();
    });
};

CRF.prototype.buildFeatures = function () {
    var _this = this;
    this.feature.buildFeatures(function(error){
	if (error) return console.log(error);
	_this.sgdTrain();
    });
};

CRF.prototype.sgdTrain = function () {
    var sgd = new SGD(this.feature);
    var model = sgd.train();
    this.save(model);
};


CRF.prototype.save = function (model) {
    // save model to file
};

CRF.prototype.test = function (modelFile) {
	
};
