'use strict';

var sylvester = require("sylvester");

exports.calcGradients = function (X, featureSet) {
    // crf cost function return cost/likelihood
    // and graident
    console.log('X random selected:', X);
    var result = {};
    result.cost = 0;
    result.gradients = [];
    console.log('start compute the gradients');
    var gradients = [];
    var wordLattice = buildLattice(X);
    // TODO
    return result;
}

function buildLattice (X) {
    return [];
}




