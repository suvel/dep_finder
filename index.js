const filePath = 'test4'; // Path to your React project directoryconst DataCollector = e
const DataCollector = require('./DataCollector')
const path = require('path');
const fs = require('fs');
const writeArrayToJsonFile = require('./utility/functions').writeArrayToJsonFile;
const readJsonFile = require('./utility/functions').readJsonFile;
var uniqid = require('uniqid');
// traverseDirectory(searchDirectory);

let optimized = 1;
let useExistingData = 1;

let data;
if (!useExistingData) {
  const projectDirectory = path.join(__dirname, filePath);
  const nodes = new DataCollector(projectDirectory);
  data = nodes;
  if (optimized) {
    writeArrayToJsonFile(nodes, 'outputSample1.json')
  }
}
if (useExistingData) {
  data = readJsonFile('outputSample1.json')
}

const parentSet = new Set();
data?.forEach((component) => {
  const compName = component[1]?.parentName;
  if (compName)
    parentSet.add(component[1].parentName)
});

const parentComponents = Array.from(parentSet);

data?.forEach((comp, index) => {
  if (!parentComponents.includes(comp[0])) {
    data[index][1].leaf = true;
  }
  data[index][1].name = data[index][0];
  data[index][0] = uniqid();
  return data[index];
});

data = data?.filter(itm => {
  if (itm[1]?.name === 'App') return true;
  return itm[1]?.parentName;
})

const htmlContent = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Network</title>
    <script
      type="text/javascript"
      src="https://unpkg.com/vis-network/standalone/umd/vis-network.min.js"
    ></script>
    <style type="text/css">
      #mynetwork {
        width: 100vw;
        height: 100vh;
        border: 1px solid lightgray;
      }
    </style>
  </head>
  <body>
    <input  id="ST" type="text" placeholder="search component by name"/>
    <button onclick="focusNode()">Search</button>
    </div>
    <div id="mynetwork"></div>
    <script>
      function focusNode() {
      const searchedId = data1?.find(itm=>{
        if(itm[1]?.name === document.getElementById("ST").value )return true;
        return false;
      })
      if(searchedId?.[0])network.focus(searchedId?.[0],{     scale: 2, // You can adjust the zoom level as needed
      animation: {
      duration: 1000, // Animation duration in milliseconds
      easingFunction: 'easeInOutQuart', // You can choose a different easing function
      },})
      }
    </script>
    <script type="text/javascript">
      const data1 =  ${JSON.stringify(data)};

      const nodes = new vis.DataSet();
      const edges = new vis.DataSet();

      for (const [nodeId, nodeAttributes] of data1) {
        let backgroundColor = '#00ff4c';
        if (nodeAttributes.leaf) backgroundColor = '#FFD000';
        nodes.add({
          id: nodeId,
          label: nodeAttributes?.name,
          borderWidth: nodeAttributes?.borderWidth || 1,
          color: {
            background: nodeAttributes?.background || backgroundColor,
          },
        });
        if (nodeAttributes.parentName) {
          const parentData = data1.find(itm=>{
            if(itm[1]?.name === nodeAttributes.parentName) return true;
            return false;
          })
          const parentID = parentData?.[0]||null;
          edges.add({ from: parentID, to: nodeId });
        }
      }

      // create a network
      var container = document.getElementById('mynetwork');
      var data = {
        nodes: nodes,
        edges: edges,
      };
      var options = {};
      var network = new vis.Network(container, data, options);
    </script>
  </body>
</html>
`;

const htmlFilePath = path.join(__dirname, 'dynamicPage.html');
fs.writeFileSync(htmlFilePath, htmlContent);

const { exec } = require('child_process');
exec(`start ${htmlFilePath}`);