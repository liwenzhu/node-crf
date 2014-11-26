'use strict';

module.exports = Decoder;

function Decoder (unigramTemplates, bigramTemplates, labelSet) {
    this.unigramTemplates = unigramTemplates;
    this.bigramTemplates = bigramTemplates;
    this.unigramIndex = parseIndex(unigramTemplates);
    this.bigramIndex = parseIndex(bigramTemplates);
    this.labelSet = labelSet;
};


Decoder.prototype.getMacros = function (X, curIndex) {
    var macros;
    macros = decode(this.unigramIndex, X, curIndex);
    macros = macros.concat(decode(this.bigramIndex, X, curIndex));
    return macros;
};

Decoder.prototype.decodeMacrosUnigram = function (X, currentPosition) {
    var macros = [];
    var macrosTmp = [];
    var macro;
    var i,j,l,jl;
    macrosTmp = decode(this.unigramIndex, X, currentPosition);
    
    for (i = 0, l = macrosTmp.length; i < l; i++) {
	for (j = 0, jl = this.labelSet.length; j < jl; j++) {
	    macros.push(macrosTmp[i] + '/' + j);
	}
    }
    
    return macros;
};


Decoder.prototype.decodeMacrosBigram = function (X, currentPosition) {
    var macros = [];
    var macrosTmp = [];
    var macro;
    var i,j,k,l;
    macrosTmp = decode(this.bigramIndex, X, currentPosition);
    
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


function getIndex (X, index, currentPosition) {
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

function decode (templates, X, curIndex) {
    var macros = [];
    var macro;
    for (var i = 0, len = templates.length; i < len; i++) {
	macro = getIndex(X, templates[i], curIndex);
	if (macro) {
	    macros.push(macro);
	}
    }
    return macros;
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

