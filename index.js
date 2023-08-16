const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const fs = require('fs');
const path = require('path');
const searchDirectory = 'C://Users//suvel.ratneswar//Desktop//temp//dep_finder//cute-god-react'; // Path to your React project directory

function traverseDirectory(directoryPath) {
    const files = fs.readdirSync(directoryPath);

    for (const file of files) {
        const filePath = path.join(directoryPath, file);
        const stats = fs.statSync(filePath);

        if (stats.isDirectory()) {
            traverseDirectory(filePath);
        } else if (stats.isFile() && (path.extname(filePath) === '.js' || path.extname(filePath) === '.jsx')) {
            analyzeFile(filePath,'function','handelChangeGod');
        }
    }
}

function analyzeFile(filePath, type, searchText) {
    const fileContent = fs.readFileSync(filePath, 'utf-8');

    try {
        const ast = parser.parse(fileContent, {
            sourceType: 'module',
            plugins: ['jsx'],
        });

        traverse(ast, {
            JSXElement(path) {
                if (type === 'component' && path.node.openingElement.name.name === searchText) {
                    console.log(`Found Button component usage in: ${filePath}`);
                }
            },
            FunctionDeclaration(path) {
                if (type === 'function' && path.node.id.name === searchText) {
                    console.log(`Found function usage in: ${filePath}`);
                }
            },
            FunctionExpression(path) {
                if (type === 'function' && path.parent.id && path.parent.id.name === searchText) {
                    console.log(`Found function usage in: ${filePath}`);
                }
            },
            ArrowFunctionExpression(path) {
                if (type === 'function' && path.parent.id && path.parent.id.name === searchText) {
                    console.log(`Found function usage in: ${filePath}`);
                }
            },
        });
    } catch (error) {
        console.error(`Error analyzing ${filePath}: ${error.message}`);
    }
}

traverseDirectory(searchDirectory);
