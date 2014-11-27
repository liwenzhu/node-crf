'use strict';

var sylvester = require("sylvester");
var Decoder = require('./decoder.js');

var MINUS_LOG_EPSILON = 50;

exports.calcGradients = function (feature, thetas) {
    var X = feature.getRandomX();
    var y = feature.getY();
    var result = {};
    var gradients = [];
    
    result.cost = 0;
    result.gradients = $M(thetas);
    var wordLattice = buildLattice(feature, X, y.length, thetas);
    
    // TODO compute gradients
    
    // TODO compute alpha and beta
    forwardbackward(wordLattice, y.length);
    
    return result;
}

// return log (exp (x) + exp (y))
// this can be used recursivly
// e.g.
// log( exp(log(exp(x) + exp(y))) + exp(z)) = log (exp (x) + exp (y) + exp (z))
function logsumexp (x, y, isInit) {
    if (isInit) return y;
    var min = Math.min(x,y);
    var max = Math.max(x,y);
    if (max > min + MINUS_LOG_EPSILON) {
	return max;
    } else {
	return max + Math.log (Math.exp (min-max) + 1.0);
    }
}

function forwardbackward (lattice, labelSize) {
    // compute forward
    var alpha = calcAlpha(lattice, labelSize);
    // compute backward
    var beta = calcBeta();
    // compute z
    var z = calcZ();
    return {"alpha": alpha
	    , "beta": beta
	    , "z": z
	   };
};

function calcAlpha (lattice, labelSize) {
    // TODO compute alpha
    var alpha = [];
    var len = lattice.length;
    for (var i = 0; i < len; i++) {
	alpha[i] = [];
    }

    for (var i = 0; i < len; i++) {
	// compute alpha
    }
};

function calcBeta () {
    // TODO compute beta
};

function calcZ () {
    // TODO compute Z
};

function buildLattice (feature, X, labelSize, thetas) {
    var wordLattice = [];
    var lattice = [];
    var macros = [];
    for (var i = 0, len = X.length; i < len; i++) {
	macros = feature.decodeMacro(X, i);
	lattice = buildWordLattice(feature, macros, labelSize, thetas);
	wordLattice.push(lattice);
    }
    return wordLattice;
}

function buildWordLattice (feature, macros, labelSize, thetas) {
    var lattice = [];
    var val,index;
    
    // initialize lattice
    for (var i = 0; i < labelSize; i++) {
	lattice[i] = [];
    }
    
    for (var i = 0; i < labelSize; i++) {
	for (var j = 0; j < labelSize; j++) {
	    val = 0;
	    for (var k = 0, len = macros.length; k < len; k++) {
		// decode bigram
		index = feature.getIndex(macros[k] + '/' + i + '/' + j);
		if (index) {
		    val += thetas.e(index,1);
		}

		// decode unigram
		index = feature.getIndex(macros[k] + '/' + j);
		if (index) {
		    val += thetas.e(index,1);
		}
	    }
	    // TODO use logsumexp
//	    lattice[i][j] = Math.exp(val);
	    lattice[i][j] = val;
	}
    }
    return lattice;
}




