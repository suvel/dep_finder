const path = require('path');
const fs = require('fs');
const getData = require('./getData');
const sanitiesAndParseForGraphing = require('./sanitiesAndParseForGraphing');

 const filePath = 'test6'; // Path to your React project
let data = getData(filePath, { optimized: 1, useExistingData: 0, absolutePath: false });

data = sanitiesAndParseForGraphing(data);

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
      var data1 =  ${JSON.stringify(data)};

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
      var options = {
        groups: {
          failure: {
              color: {
                  background: 'red'
              }
          },
          state: {
              color: {
                  background: 'lime'
              }
          },
          startstate: {
              font: {
                  size: 33,
                  color: 'white'
              },
              color: {
                  background: 'blueviolet'
              }
          },
          finalstate: {
              font: {
                  size: 33,
                  color: 'white'
              },
              color: {
                  background: 'blue'
              }
          }
      },
      edges: {
          arrows: {
              to: {
                  enabled: true
              }
          },
          smooth: {
              enabled: false,
              type: 'continuous'
          }
      },
      physics: {
          adaptiveTimestep: true,
          barnesHut: {
              gravitationalConstant: -8000,
              springConstant: 0.04,
              springLength: 95
          },
          stabilization: {
              iterations: 987
          }
      },
      layout: {
          randomSeed: 191006,
          improvedLayout: true
      }
      };
      var network = new vis.Network(container, data, options);
    </script>
  </body>
</html>
`;

const htmlFilePath = path.join(__dirname, 'dynamicPage.html');
fs.writeFileSync(htmlFilePath, htmlContent);

const { exec } = require('child_process');
exec(`start ${htmlFilePath}`);