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
    var alpha = [];
    var beta = [];
    var len = lattice.length;
    var i, j;

    for (i = 0, len = lattice.length; i < len; i++) {
	alpha[i] = [];
	beta[i] = [];
    }
    
    // forward
    for (i = 0; i < len; i++) {
	for (j = 0; j < labelSize; j++) {
	    alpha[i][j] = calcAlpha(alpha[i-1], lattice, labelSize, i, j);
	}
    }

    // backward
    for (i = len-1; i >= 0; i--) {
	for (j = 0; j < labelSize; j++) {
	    beta[i][j] = calcBeta(beta[i+1], lattice, labelSize, i, j);
	}
    }

    // compute z
    var Z = calcZ(beta, labelSize);
   
    return {"alpha": alpha
	    , "beta": beta
	    , "Z": Z
	   };
};

function calcAlpha (prevAlpha, lattice, labelSize, i, j) {
    if (!prevAlpha) {
	prevAlpha = [];
	for (var idx = 0; idx < labelSize; idx++) {
	    prevAlpha.push(1);
	}
    }
    var alpha = 0.0;
    for (var k = 0; k < labelSize; k++) {
	alpha = logsumexp(alpha, lattice[i][j][k] *  prevAlpha[k], false);
    }
    return alpha;
};

function calcBeta (nextBeta, lattice, labelSize, i, j) {
    if (!nextBeta) {
	nextBeta = [];
	for (var idx = 0; idx < labelSize; idx++) {
	    nextBeta.push(1);
	}
    }

    var beta = 0.0;
    for (var k = 0; k < labelSize; k++) {
	beta = logsumexp(beta, lattice[i][j][k] * nextBeta[k], false);
    }
    return beta;
};

function calcZ (beta, labelSize) {
    var Z = 0;
    for (var i = 0; i < labelSize; i++) {
	Z = logsumexp(Z, beta[0][i], i == 0);
    }
    return Z;
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




