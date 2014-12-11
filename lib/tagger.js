'use strict';

var fs = require("fs");

module.exports = Tagger;

function Tagger(feature) {
    this.feature = feature;
};

Tagger.prototype.tag = function (dataFile, callback) {
    var _this = this;
    var viterbi = function (error, data) {
	if (error) return callback(error);
	var macro, sp;
	var labelSize = _this.feature.getLabelSize();
	var scores = [];
	var paths = [];
	for (var i = 0, len = data.length; i < len; i++) {
	    macro = _this.feature.decodeMacro(data, i);
	    sp = calcScoreAndPath(_this.feature, macro, scores[i-1], labelSize);
	    scores.push(sp.score);
	    paths.push(sp.path);
	}

	var tags = tracebackTags(scores, paths);
	tags = restoreLabels(tags, _this.feature.getY());
	return callback(null, tags);
    };
    loadData (dataFile, viterbi);
};

function calcScoreAndPath (feature, macros, prevScores, labelSize) {
    var scores = [];
    var path = [];
    var thetas = feature.getThetas();
    var score, index, max;
    for (var i = 0; i < labelSize; ++i) {
	scores.push([]);
	path.push([]);
    };
    // first one
    for (var currLabel = 0; currLabel < labelSize; ++currLabel) {
	for (var prevLabel = 0; prevLabel < labelSize; ++prevLabel) {
	    score = 0;
	    for (var k = 0, len = macros.length; k < len; k++) {
		// bigram
		index = feature.getIndex(macros[k] + '/' + currLabel + '/' + prevLabel);
		if (index) {
		    score += parseFloat(thetas[index]);
		}

		// unigram
		index = feature.getIndex(macros[k] + '/' + currLabel);
		if (index) {
		    score += parseFloat(thetas[index]);
		}
	    }
	    if (!prevScores) {
		scores[currLabel][prevLabel] = score;
	    } else {
		max = findMax(prevScores);
		scores[currLabel][prevLabel] = score + max.val;
		path[currLabel][prevLabel] = max.j;
	    }
	};
    };
	
    return {'score': scores, 'path': path};
};

function restoreLabels (tags, y) {
    console.log(y);
    var labels = [];
    for (var i = 0, len = tags.legnth; i < len; i++) {
	labels.push(y[tags[i]]);
    }
    console.log('labels:', labels);
    return labels;
};

function tracebackTags (scores, path) {
    if (scores.length == 0) return [];
    var max = findMax(scores[scores.length - 1]);
    for (var i = scores.length-2; i >= 0; --i) {
	// TODO traceback and get the path
    };
    return [];
};

function findMax (array) {
    if (!array) return null;
    var dimensions = getDimensions(array);
    var len = array.length;
    var max = {'val': Number.NEGATIVE_INFINITY, 'i': -1, 'j': -1};
    if (dimensions == 1) {
	for (var i = 0; i < len; ++i) {
	    if (max.val < array[i]) {
		max.val = array[i];
		max.i = i;
	    }
	};
    } else if (dimensions == 2) {
	for (var i = 0; i < len; ++i) {
	    for (var j = 0; j < len; ++j) {
		if (max.val < array[i][j]) {
		    max.val = array[i][j];
		    max.i = i;
		    max.j = j;
		}
	    };
	};
    }

    return max;
};

function getDimensions (array) {
    if (!array)
	return 0;
    if (array.length && array[0].length)
	return 2;
    return 1;
};

function loadData (dataFile, callback) {
    fs.readFile(dataFile, 'utf8', function(error, data){
	if (error || !data) return callback(error);
	var X = [];
	var lines = data.split('\n');

	var line;
	for (var i = 0, len = lines.length; i < len; i++) {
	    line = lines[i].split(/[\s\t]/);
	    X.push(line);
	}
	return callback (null, X);
    });
};



