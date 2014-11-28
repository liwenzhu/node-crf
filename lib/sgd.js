'use strict';


var sylvester = require("sylvester");

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
 *  "maxIter": number,
 *  "lambda": number
 * }
 */
SGD.prototype.train = function (options) {
    var lambda = options.lambda || 1;
    var thetas = $M(options.initialThetas);
    console.log('start training...');
    console.time('training');
    var costAndGradients;
    for (var i = 0; i < options.maxIter; i++) {
	console.log('train iter:', i);
	costAndGradients = options.costFunction(this.feature, thetas);
	console.log('cost', costAndGradients.cost);
	// gradients ascent.
	thetas = thetas.add(costAndGradients.gradients.x(lambda));
    }
    console.timeEnd('training');
    // training finished.
    // print time after training
    
};
