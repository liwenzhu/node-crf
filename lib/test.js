
var CRF = require("./crf.js");

var crf = new CRF();

var templateFile = __dirname + '/../tests/template';
var trainFile = __dirname + '/../tests/train.data';
var testFile = __dirname + '/../tests/test.data';
var modelFile = __dirname + '/model.data';
//crf.learn(templateFile, trainFile);

crf.test(modelFile, trainFile, function (error, tags) {
    if (error)
	console.log('this is an error:', error);

    console.log('tags:', tags);
});

