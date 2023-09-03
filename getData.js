const DataCollector = require('./DataCollector')
const path = require('path');
const writeArrayToJsonFile = require('./utility/functions').writeArrayToJsonFile;
const readJsonFile = require('./utility/functions').readJsonFile;

const getData = (filePath, options) => {
    let data;
    const optimized = options?.optimized || 1;
    const useExistingData = options?.useExistingData || 0;
    const absolutePath = options?.absolutePath || false;

    if (!useExistingData) {
        let projectDirectory;
        if (absolutePath) projectDirectory = filePath;
        else projectDirectory = path.join(__dirname, filePath);

        const nodes = new DataCollector(projectDirectory);
        data = nodes;
        if (optimized) {
            writeArrayToJsonFile(nodes, 'outputSample1.json')
        }
    }
    if (useExistingData) {
        data = readJsonFile('outputSample1.json')
    }

    return data;
};

module.exports = getData;