'use strict';

var Feature = require("./feature.js");

module.exports = CRF;

function CRF () {
    this.feature = new Feature();
};

CRF.prototype.learn = function (templateFile, trainFile, modelFile) {
    var _this = this;
    this.feature.load(templateFile, trainFile, function(err){
	if (err) console.log(err);
	_this.feature.print();
    });
};

CRF.prototype.test = function (modelFile) {
	
};
