'use strict';

module.exports = SGD;

function SGD (feature) {
    this.feature = feature;
    this.model = {};
    this.model.unigramTemplates = feature.unigramTemplates;
    this.model.bigramTemplates = feature.bigramTemplates;
    this.model.thetas = [];
    for (var i = 0, l = feature.featureSet.length; i < l; i++) {
	this.model.thetas.push(0);
    }
};


SGD.prototype.train = function () {
    // TODO
    console.log('start training...');
    console.log(this.model.thetas.length);
};


SGD.prototype.costFunction = function () {
    
};

