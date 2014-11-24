'use strict';

module.exports = SGD;

function SGD (feature) {
    this.feature = feature;
    this.model = {};
    this.model.unigramTemplates = feature.unigramTemplates;
    this.model.bigramTemplates = feature.bigramTemplates;
};


/**
 * options = {
 *  "costFunction": Function,
 *  "initialTheta": Array,
 *  "maxIter": number
 * }
 */
SGD.prototype.train = function (options) {
    // TODO
    console.log('start training...');
    console.log(options.costFunction);
    console.log(options.initialTheta.length);
    console.log(options.maxIter);
    
};



