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
	var macro;
	var labelSize = _this.feature.getLabelSize();
	var scores = [];
	var path = [];
	// TODO compute best set of tag by viterbi algorithm
	for (var i = 0, len = data.length; i < len; i++) {
	    macro = _this.feature.decodeMacro(data, i);
	    //	    console.log(macro);
	    // compute ever matrix
	    
	}
	// TODO return tags
	var tags = tracebackTags(scores);
	tags = restoreLabels(tags, _this.feature.getY());
	// TEST restoreLabels
//	tags = restoreLabels([1,2,3,5,3,4,2,1,3,8,5], _this.feature.getY());
	callback(null, tags);
    }
    loadData (dataFile, viterbi);
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

function tracebackTags (scores) {
    // TODO restore labels by index
    
    return [];
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
	callback (null, X);
    });
};



