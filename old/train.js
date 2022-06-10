const brain = require('brain.js');
const fs = require('fs');
const path = require('path');
var natural = require('natural');

const config = {
    hiddenLayers: [1], 
    activation: 'sigmoid',
    learningRate: 0.1,
    iterations: 100000,
    logPeriod: 10,
    learningRate: 0.3,
    momentum: 0.1,
    propagateToInput: false
};


let google = JSON.parse(fs.readFileSync(path.join(__dirname, 'model-google.json'), 'utf8'));
let iphone = JSON.parse(fs.readFileSync(path.join(__dirname, 'model-iphone.json'), 'utf8'));

//Remove repeated words
function getUniqueWordString(str, delimiter) {
    return str.toLowerCase().split(delimiter).filter(function(e, i, arr) {
        return arr.indexOf(e, i+1) === -1;
    }).join(delimiter);
}

//Remove poncutations
function removePoncutations(str) {
    return str.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?!@]/g,"");
}


const google_shorted = google.map(x => {
    let input = natural.PorterStemmer.stem(
            getUniqueWordString(removePoncutations(x.input), " ")
        )
    let output = x.output
    return {
        input: input,
        output: output
    }
})


const iphone_shorted = iphone.map(x => {
    let input = natural.PorterStemmer.stem(
            getUniqueWordString(removePoncutations(x.input), " ")
        )
    let output = x.output
    return {
        input: input,
        output: output
    }
})


function encode(str){
    return str.split('').map(x => (x.charCodeAt(0) / 256));
}

function decode(str){
    return decoded = str.map(x => String.fromCharCode(x * 256));
}

function processData(data) {
    return data.map(x => {
        return {
            input: encode(x.input),
            output: x.output
        }
    });
}


const dataset = processData(google_shorted.concat(iphone_shorted));

function saveModel(model) {
    const modelPath = path.join(__dirname, 'model.json');
    fs.writeFileSync(modelPath, JSON.stringify(model));
    console.log("Model saved");
}


let testdata = [
    { input: [
        0.3828125,0.37890625,0.421875,0.421875,0.4453125,0.43359375,0.43359375,0.42578125,0.125,0.390625,0.125,0.42578125
    ], output: [1] }
]

const net = new brain.NeuralNetwork(config);




net.train(testdata, {
    iterations: 100000,
    log: true,
    errorThresh: 0.005
});
