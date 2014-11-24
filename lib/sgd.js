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

    // TODO
    console.log('start training...');
    var costAndGradients;
    var thetas = options.initialTheta;
    for (var i = 0; i < options.maxIter; i++) {
	costAndGradients = options.costFunction();
	// change thetas by gradients
	console.log(costAndGradients.cost);
	// need to remove later
	process.exit(0);
	
	thetas = thetas + costAndGradients.gradients.x(lambda);
    }
    
    // training finished.
    // print time after training
    
};



