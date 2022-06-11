const brain = require('brain.js');
const natural = require('natural');
const fs = require('fs');


function modelFactory(dictionary, output) {
    const model = {
        input: dictionary,
        output: output
    }
    return model;
}

function stemmer(word) {
    return natural.PorterStemmer.stem(word);
}

function tokenizer(text) {
    return text.split(/\W+/);
}

function poncutationsRemover(word) {
    return word.replace(/[^a-zA-Z0-9]/g, '');
}

function readData(path) {
    const data = fs.readFileSync(path, 'utf8');
    return data.split('\n');
}

function readWords(path){
    let words = [];
    const data = readData(path);
    data.forEach(element => {
        const word = element.split(' ');
        word.forEach(element => {
            words.push(stemmer(poncutationsRemover(element)));
        });
    });
    return words;
}

function createBoW(sentence, words) {
    const bow = new Array(words.length).fill(0);
    const processed = tokenizer(sentence).map(stemmer).map(poncutationsRemover);
    processed.forEach(word => {
        if (words.includes(word)) {
            bow[words.indexOf(word)]++;
        }
    });
    return bow;
}


const googlDictionary = readWords("google.txt");
const iphoneDictionary = readWords("iphone.txt");

//Join all the data in google and iphone into the dictionary
const dictionary = googlDictionary.concat(iphoneDictionary);


//Save dictionary to json file
// fs.writeFileSync('dictionary.json', JSON.stringify(dictionary));



function createDataset(texts, tag, dictionary){
    const dataset = [];
    texts.map(text => {
        
        const bow = createBoW(text, dictionary);
        console.log(bow);
        dataset.push(modelFactory(bow, tag));
    });
    return dataset;
}

let googleTexts = [
    "ballroom d: #marissagoogle talking about some cool projects (obv). love the Google Art Project. #sxsw",
    "It's pie day at the google booth at #sxsw #mylunch",
    "Having a drink called an Alan Turing and making a Lego robot. Oh, Google :) #sxsw  @mention Speakeasy {link}",
    "Kinda giddy about #TheIndustryParty with #Google (&amp; more) at #GSDM. Finally, the fun comes to us non #SWSurrogates. #sxsw #notpouting",
    "Off to see @mention in &quot;Left Brain Search = Google. Right Brain Search = X&quot; panel at #SXSW #BetterSearch",
    "The Google / ACLU party tonight at #sxsw is the best thing ever. (And apparently, the Spazmatics are a franchised band. But they rock.)",
    "Loving the 80s music at aclu google party!!! #sxsw",
    "Any Google Analytics and DFP experts at #SXSW? Would love some insight on managing DFP campaigns, ad management/measurement. DM me! #HISXSW",
    "I'm at the google party. @mention Rocks! #sxsw",
    "Man, these hipsters are getting crazy at the Google party #SXSW  {link}",
    "the future is about networks, not just data. that's why google may not win long term #SXSW #web3 #SaatchiNY",
    "The volume is overwhelming but the market will self-police. That's why users picked Google over Bing.  #curatedebate #SXSW",
    "The Google party line starts behind me. Ha! The Germ has put her towel down early... #sxsw"
];

let appleText = [
    "I just noticed DST is coming this weekend. How many iPhone users will be an hour late at SXSW come Sunday morning? #SXSW #iPhone",
    "I love my @mention iPhone case from #Sxsw but I can't get my phone out of it #fail",
    "What !?!? @mention  #SXSW does not provide iPhone chargers?!?  I've changed my mind about going next year!",
    "Yai!!! RT @mention New #UberSocial for #iPhone now in the App Store includes UberGuide to #SXSW sponsored by (cont) {link}",
    "Take that #SXSW ! RT @mention Major South Korean director gets $130,000 to make a movie entirely with his iPhone. {link}",
    "Behind on 100s of emails? Give them all 1 line iPhone composed replies. #SXSW #protip",
    "Picked up a Mophie battery case 4 my iPhone in prep for #SXSW. Not lugging around a laptop &amp; only using my phone was a huge win last year.",
    "If iPhone alarms botch the timechange, how many #SXSW'ers freak? Late to flights, missed panels, behind on bloody marys...",
    "I meant I also wish I  at #SXSW #dyac stupid iPhone!",
    "Do I need any more for #sxsw! ipad, iphone, laptop, dictaphone, vid.camera.... Wow! Love to  meet the REAL 'cerebellum' charged people:)",
    "Overheard at #sxsw interactive: &quot;Arg! I hate the iphone! I want my blackberry back&quot; #shocked",
    "overheard at MDW (and I'll second it) &quot;halfway through my iPhone battery already and I haven't even boarded the plane to #sxsw&quot; #amateurhour",
    "My iPhone battery at 100%. #winning at #SXSW"
]

let dataset = createDataset(googleTexts, {google: 1}, dictionary)
.concat(createDataset(appleText, {apple: 1}, dictionary));

//Save dataset to file
fs.writeFileSync('dataset.json', JSON.stringify(dataset));

const network = new brain.NeuralNetwork({hiddenLayers: [3, 3]});

network.train(dataset, {
    errorThresh: 0.005,
    iterations: 20000,
    log: true,
});


const output = network.run(
    createBoW("$130,000", dictionary)
);

console.log(output);
if (output.apple > output.google) {
    console.log("Apple");
} else if (output.apple < output.google) {
    console.log("Google");
} else {
    console.log("Confused");
}

//save network to file and log if it is successful
function saveNetwork(network, fileName) {
    fs.writeFileSync(fileName, JSON.stringify(network));
    console.log("Saved network to " + fileName);
}

