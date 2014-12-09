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
    var thetaCount;
    for (var i = 0; i < options.maxIter; i++) {
	console.log('train iter:', i);
	costAndGradients = options.costFunction(this.feature, thetas);
	if (!costAndGradients.gradients) {
	    console.log('Training error, continue next iteration.');
	    continue;
	}
	// gradients ascent.
	thetas = thetas.add(costAndGradients.gradients.x(lambda));

	// TEST
	thetaCount = 0;
	var len = thetas.dimensions()['rows']
	for (var j = 1; j < len; ++j) {
	    if (thetas.e(j,1) != 1)
		thetaCount++;
	};
	console.log('theta count:', thetaCount);
    }
    console.timeEnd('training');
    // training finished.
    this.feature.setThetas(thetas);
    // print time after training
    
};
