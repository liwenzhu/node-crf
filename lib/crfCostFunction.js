'use strict';

var sylvester = require("sylvester");
var Matrix = sylvester.Matrix;
var Decoder = require('./decoder.js');

var MINUS_LOG_EPSILON = 50;

exports.calcGradients = function (feature, thetas) {
    var X = feature.getRandomX();
    var y = feature.getY();
    var yIndex = {};
    for (var i = 0; i < y.length; i++) {
	yIndex[y[i]] = i; 
    }
    var gradients = [];
    var wordLattice = buildLattice(feature, X, y.length, thetas);
    var options = forwardbackward(wordLattice, y.length);
    var expectations = calcExpectation(X, y, feature, wordLattice, options);
    var gradients = getGradients(X, feature, expectations, yIndex);
    var result = {};
    result.cost = 0;
    result.gradients = gradients;
    return result;
}

function getGradients (X, feature, expectations, yIndex) {
    var scores = [];
    var Y = $M(X);
    var cols = Y.dimensions()['cols'];
    Y = Y.col(cols);
    Y = changeToIndex(Y, yIndex);
    
    for (var i = 0, len = feature.size(); i < len; i++) {
	scores.push(0);
    }

    var macros, index;
    for (var i = 0, len = X.length; i < len; i++) {
	macros = feature.decodeMacro(X, i);
	// unigrams
	for (var j = 0, jlen = macros.length; j < jlen; j++) {
	    index = feature.getIndex(macros[j] + '/' + Y[i])
	    if (index)
		scores[index] += 1;
	}

	// bigrams
	if (i > 0) {
	    for (var j = 0, jlen = macros.length; j < jlen; j++) {
		index = feature.getIndex(macros[j] + '/' + Y[i-1] + '/' + Y[i]);
		if (index)
		    scores[index] += 1;
	    }
	}
    }
    
    // for (var i = 0, len = scores.length; i < len; i++) { 
    // 	if (scores[i] != 0)
    // 	    console.log(i + ': ' + scores[i]);
    // }
        
    scores = $M(scores);
    return scores.subtract(expectations);
};

function changeToIndex (Y, yIndex) {
    var y = [];
    var rows = Y.dimensions()['rows'];
    for (var i = 1; i <= rows; i++) {
	y.push(yIndex[Y.e(i, 1)]);
    }
    return y;
};

/*
 * compute expectation of kth feature function
 * options = {alpha: array
 *            , beta: array
 *            , Z: number
 *            }
 *
 */
function calcExpectation (X, y, feature, wordLattice, options) {
    // TODO need code refactor
    var expectations = [];
    
    var alpha = $M(options.alpha);
    var beta = $M(options.beta);
    var Z = options.Z;
    var a, m, b;
    for (var i = 0, len = feature.size(); i < len; i++) {
	expectations.push(0);
    }
    console.log('X length:', X.length);
      // TODO warning: this loop take 95% running time

    return expectations;
};

function getAlpha (alpha, i) {
    if (i !== 0) 
	return $M(alpha.row(i)).transpose();
    var cols = alpha.dimensions()['cols'];
    return Matrix.Zero(1, cols).add(1);
};

function getBeta (beta, i) {
    return $M(beta.row(i));
};

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
};

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
    if (!beta) {
	console.log('there is no beta');
	return 1;
    }
    var Z = 1;
    for (var i = 0; i < labelSize; i++) {
	// TODO remove try catch
	try {
	    Z = logsumexp(Z, beta[0][i], i == 0);
	} catch(e) {
	    console.log(beta[0]);
	}
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
};

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
//	    lattice[i][j] = Math.exp(val);
	    lattice[i][j] = val;
	}
    }
    return lattice;
};




