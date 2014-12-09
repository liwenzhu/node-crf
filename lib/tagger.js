'use strict';

module.exports = Tagger;

function Tagger(feature) {
    this.feature = feature;
};

Tagger.prototype.tag = function (dataFile, callback) {
    console.log('Start tagging ...');
    console.log(this.feature.unigramTemplates);
};

// TODO viterbi algorithm
function viterbi () {
    // use viterbi compute max properbility tags
};

