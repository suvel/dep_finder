const fs = require('fs');

function withTryCatch(fn) {
    return function (...args) {
        try {
            return fn.apply(this, args);
        } catch (error) {
            console.error("An error occurred😲:", error.message);
        }
    };
}

function writeArrayToJsonFile(array, filePath) {
    const jsonData = JSON.stringify(array, null, 2); // Use 2 spaces for indentation
    fs.writeFileSync(filePath, jsonData, 'utf8');
    console.log(`Array data written to ${filePath}`);
}

function readJsonFile(filePath) {
    try {
        const jsonData = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(jsonData);
    } catch (error) {
        console.error(`Error reading JSON file: ${error.message}`);
        return null;
    }
}

module.exports = { withTryCatch, writeArrayToJsonFile, readJsonFile }