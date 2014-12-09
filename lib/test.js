
var CRF = require("./crf.js");

var crf = new CRF();

var templateFile = __dirname + '/../tests/template';
var trainFile = __dirname + '/../tests/train.data';
var modelFile = __dirname + '/model.data';
crf.learn(templateFile, trainFile);

crf.test(modelFile, trainFile);
