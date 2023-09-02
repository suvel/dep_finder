const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const errorCollection = require('./constant').errorCollection;
const withTryCatch = require('./utility/functions').withTryCatch;
/*
Data collector 🛒 is module that is responsible for extraction and returning a array of component with necessary meta details to form a graph.
*/

const rootComponentName = "root";
class DataCollector {
    constructor(sourcePath) {
        this.process = withTryCatch(this.process.bind(this));
        this.analyzeFile = withTryCatch(this.analyzeFile.bind(this));
        this.componentNode = new Map();
        this.process(sourcePath);
        const nodeList = this.getComponentNode()
        return nodeList;
    }
    getComponentNode() {
        if (!this.componentNode) return [];
        return Array.from(this.componentNode.entries());
    }
    addToComponentNode(componentName, option) {
        if (!componentName) return
        if (this.componentNode.has(componentName) && this.componentNode?.get(componentName)?.parentName) {
            this.notifyAsDuplicate(componentName);
            return;
        }
        let type = 'main_component';
        let parentName = option?.parentName;
        let background;
        let border;
        let borderWidth;
        if (componentName === 'App') {
            type = rootComponentName;
            parentName = null;
            background = "#ff0000";
            border = "#000000";
            borderWidth = 3;
        }
        this.componentNode.set(componentName, { type, parentName: parentName, background, border, borderWidth })
    }
    notifyAsDuplicate(componentName) {
        //🔔 A ringer to notify us to improve 
        console.log(errorCollection.duplicateName + '\n' + componentName)
    }
    process(sourcePath) {
        const files = fs.readdirSync(sourcePath);
        for (const file of files) {
            const filePath = path.join(sourcePath, file);
            const stats = fs.statSync(filePath);
            if (stats.isDirectory()) {
                this.process(filePath);
            } else if (stats.isFile() && (path.extname(filePath) === '.js' || path.extname(filePath) === '.jsx')) {
                this.analyzeFile(filePath);
            }
        }
    }
    analyzeFile(filePath) {
        const self = this;

        function checkIfValidReactComponent(_string) {
            return _string[0] === _string[0].toUpperCase();
        }

        function checkAndAddComponent(path, parentName) {
            if (path.node.type === "JSXElement") {
                const openingElement = path.node.openingElement;
                if (checkIfValidReactComponent(openingElement.name.name)) {
                    let currentParentName = self.componentNode?.get(openingElement.name.name);
                    if (parentName) currentParentName = parentName;
                    self.addToComponentNode(openingElement.name.name, { parentName: currentParentName })
                }
            }
        }

        function getComponentDeclaration(path) {
            if (path.node.type === "FunctionDeclaration") {
                const componentName = path.node.id.name;
                if (checkIfValidReactComponent(componentName))
                    return componentName;
            } else if (path.node.type === "ArrowFunctionExpression") {
                const parentVarDeclarator = path.findParent((p) =>
                    p.isVariableDeclarator()
                );
                if (parentVarDeclarator) {
                    const componentName = parentVarDeclarator.node.id.name;
                    if (checkIfValidReactComponent(componentName))
                        return componentName;
                }
            }
        }

        const fileContent = fs.readFileSync(filePath, 'utf-8');
        try {
            const ast = parser.parse(fileContent, {
                sourceType: 'module',
                plugins: ['jsx'],
            });
            traverse(ast, {
                ReturnStatement(path) {
                    const functionDeclaration = path.findParent(
                        (p) =>
                            p.isFunctionDeclaration() || p.isArrowFunctionExpression()
                    );
                    const parentName = getComponentDeclaration(functionDeclaration);
                    const argument = path.get("argument");
                    if (argument.isJSXElement()) {
                        const children = argument.get("children");
                        if (children.length > 0) {
                            children.forEach(v => checkAndAddComponent(v, parentName));
                        }
                    } else if (argument.isJSXFragment()) {
                        argument.get("children").forEach(v => checkAndAddComponent(v, parentName));
                    }
                },
                FunctionDeclaration(path) {
                    if (path.node.id && path.node.id.name.startsWith("use")) {
                        // Skip React hooks
                        return;
                    }
                    const componentName = getComponentDeclaration(path);
                    self.addToComponentNode(componentName)
                },
                ArrowFunctionExpression(path) {
                    if (
                        path.parent.type === "VariableDeclarator" &&
                        path.parentPath.parent.type === "VariableDeclaration" &&
                        path.parentPath.parent.kind === "const"
                    ) {
                        const componentName = getComponentDeclaration(path);
                        self.addToComponentNode(componentName)
                    }
                },
                JSXOpeningElement(path) {
                    if (path.node.name.name === 'Route') {
                        let componentName;
                        let routePath;
                        const patElement = path.node.attributes.find(attr => attr.name.name === 'element');
                        const pathAttribute = path.node.attributes.find(attr => attr.name.name === 'path');
                        if (patElement) {
                            componentName = patElement.value.expression.openingElement.name.name;
                        }
                        if (pathAttribute) {
                            routePath = pathAttribute.value.value;
                        }
                        self.addToComponentNode(componentName, { parentName: "Routes" });
                    }
                },
                JSXElement(path) {
                    if (path.node.openingElement.name.name === 'Route' && path.node.openingElement.selfClosing === false) {
                        let parentWrapperComponentName;
                        const parentElementAtt = path.node.openingElement.attributes.find(attr => attr.name.name === 'element');
                        if (parentElementAtt) {
                            parentWrapperComponentName = parentElementAtt.value.expression.openingElement.name.name;
                        }
                        const children = path.node.children;
                        const jsxElement = children.filter(node => node.type === 'JSXElement');
                        jsxElement.forEach(node => {
                            if (path.node.openingElement.name.name === 'Route') {
                                let componentName;
                                let routePath;
                                const attributes = node.openingElement.attributes
                                const elementAtt = attributes.find(attr => attr.name.name === 'element');
                                const pathAtt = attributes.find(attr => attr.name.name === 'path');
                                if (elementAtt) {
                                    componentName = elementAtt.value.expression.openingElement.name.name;
                                }
                                if (pathAtt) {
                                    routePath = pathAtt.value.value;
                                }
                                self.addToComponentNode(componentName, { parentName: parentWrapperComponentName });
                            }
                        });
                    }
                },
            });
        } catch (error) {
            throw error;
        }
    }
}

module.exports = DataCollector;