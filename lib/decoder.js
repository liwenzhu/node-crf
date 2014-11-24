'use strict';

module.exports = Decoder;

function Decoder (unigramTemplates, bigramTemplates, labelSet) {
    this.unigramTemplates = unigramTemplates;
    this.bigramTemplates = bigramTemplates;
    this.unigramIndex = parseIndex(unigramTemplates);
    this.bigramIndex = parseIndex(bigramTemplates);
    this.labelSet = labelSet;
};


Decoder.prototype.decodeMacrosUnigram = function (X, currentPosition) {
    var macros = [];
    var macrosTmp = [];
    var macro;
    var i,j,l,jl;
    for (i = 0, l = this.unigramIndex.length; i < l; i++) {
	macro = this.getIndex(X, this.unigramIndex[i], currentPosition);
	if (!macro) continue;
	macrosTmp.push(macro);
    }
    
    for (i = 0, l = macrosTmp.length; i < l; i++) {
	for (j = 0, jl = this.labelSet.length; j < jl; j++) {
	    macros.push(macrosTmp[i] + '/' + j);
	}
    }
    
    return macros;
};


Decoder.prototype.decodeMacroBigram = function (X, currentPosition) {
    var macros = [];
    var macrosTmp = [];
    var macro;
    var i,j,k,l;
    for (i = 0, l = this.bigramIndex.length; i < l; i++) {
	macro = this.getIndex(X, this.bigramIndex[i], currentPosition);
	if (!macro) continue;
	macrosTmp.push(macro);
    }
    
    var len = this.labelSet.length;
    for (i = 0, l = macrosTmp.length; i < l; i++) {
	for (j = 0; j < len; j++) {
	    for (k = 0; k < len; k++) {
		macros.push(macrosTmp[i]
			    + '/' + j
			    + '/' + k);
	    }
	}
    }

    return macros;
    
};


Decoder.prototype.getIndex = function (X, index, currentPosition) {
    var macro = '';
    var maxRow = X.length-1;
    var row, col;
    for (var i = 1, l = index.length; i < l; i++) {
	row = currentPosition - index[i][0];
	col = index[i][1];
	if (row < 0 || row > maxRow) return null;
	if (!X[row][col]) return null;
	macro += '/' + X[row][col];
    }
    if(!macro)
	return null;
    
    return index[0] + macro;
};

function parseIndex (templates) {
    var indexes = [];
    var terms = null;
    var index;
    for (var i = 0, l = templates.length; i < l; i++) {
    	index = templates[i].split(/\/?%x/);
	for (var j = 1, len = index.length; j < len; j++) {
	    index[j] = JSON.parse(index[j]);
	}
	indexes.push(index);
    }

    return indexes;
};

