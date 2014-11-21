'use strict';

module.exports = Encoder;

function Encoder (labelSet) {
    this.labelSet = labelSet;
};


Encoder.prototype.encodeKey = function () {
    console.log('encode keys');
};
