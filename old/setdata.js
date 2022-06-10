const fs = require("fs");
const path = require("path");


function convert(origin, target, output) {
    const filePath = path.join(__dirname, origin);
    const file = fs.readFileSync(filePath, "utf-8");
    const lines = file.split("\n");
    const json = lines.map(line => {
        //Remove 1 last characters
        const word = line.slice(0, -1);
        return {
            input: word,
            output: output
        }
    });

    const jsonPath = path.join(__dirname, target);
    fs.writeFileSync(jsonPath, JSON.stringify(json));
    console.log("Model saved");
}

// convert("iphone.txt", "model-iphone.json", {"iphone": 1});
// convert("google.txt", "model-google.json", {"google": 1});