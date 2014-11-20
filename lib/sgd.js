'use strict';

module.exports = SGD;

function SGD (featureSet) {
    this.featureSet = featureSet;
};


SGD.prototype.train = function () {
    console.log('start training...');
};
