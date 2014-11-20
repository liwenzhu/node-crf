
var CRF = require("./crf.js");

var crf = new CRF();

var templateFile = __dirname + '/../tests/template';
var trainFile = __dirname + '/../tests/train.data';
crf.learn(templateFile, trainFile);
