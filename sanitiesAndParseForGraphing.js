const uniqid = require('uniqid');

const sanitiesAndParseForGraphing = (data) => {
    const parentSet = new Set();
    data?.forEach((component) => {
        const componentName = component[1]?.parentName;
        if (componentName)
            parentSet.add(component[1].parentName)
    });
    const parentList = Array.from(parentSet);

    let validNodeList = [];


    data?.forEach((comp, index) => {
        if (comp[0] !== 'App' && !comp[1]?.parentName) {
            return;
        }
        if (!parentList.includes(comp[0])) {
            //Marking Leaf🍃 Nodes
            data[index][1].leaf = true;
        }
        // Restructuring data for producing graph
        data[index][1].name = data[index][0];
        data[index][0] = uniqid();

        validNodeList.push(data[index]);
    });

    return validNodeList;
}

module.exports = sanitiesAndParseForGraphing;