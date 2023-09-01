export default function (babel) {
    const { types: t } = babel;

    return {
        name: "ast-transform", // not required
        visitor: {
            ReturnStatement(path) {
                const functionDeclaration = path.findParent(
                    (p) => p.isFunctionDeclaration() || p.isArrowFunctionExpression()
                );
                const parentName = getComponentDeclaration(functionDeclaration);
                const argument = path.get("argument");
                if (argument.isJSXElement()) {
                    const children = argument.get("children");
                    if (children.length > 0) {
                        children.forEach((v) => checkAndAddComponent(v, parentName));
                    }
                } else if (argument.isJSXFragment()) {
                    argument.get("children").forEach((v) => checkAndAddComponent(v, parentName));
                }
            },
            FunctionDeclaration(path) {
                if (path.node.id && path.node.id.name.startsWith("use")) {
                    // Skip React hooks
                    return;
                }
                const componentName = getComponentDeclaration(path);
                console.log(componentName);
            },
            ArrowFunctionExpression(path) {
                if (
                    path.parent.type === "VariableDeclarator" &&
                    path.parentPath.parent.type === "VariableDeclaration" &&
                    path.parentPath.parent.kind === "const"
                ) {
                    const componentName = getComponentDeclaration(path);
                    console.log(componentName);
                }
            }
        }
    };
}

function logJSXElement(path) {
    if (path.node.type === "JSXElement") {
        const openingElement = path.node.openingElement;
        console.log(`JSX Element Found: <${openingElement.name.name}>`);
    }
}
function getComponentDeclaration(path) {
    if (path.node.type === "FunctionDeclaration") {
        const componentName = path.node.id.name;
        if (checkIfValidReactComponent(componentName)) return componentName;
    } else if (path.node.type === "ArrowFunctionExpression") {
        const parentVarDeclarator = path.findParent((p) => p.isVariableDeclarator());
        if (parentVarDeclarator) {
            const componentName = parentVarDeclarator.node.id.name;
            if (checkIfValidReactComponent(componentName)) return componentName;
        }
    }
}

function checkIfValidReactComponent(_string) {
    return _string[0] === _string[0].toUpperCase();
}

function checkAndAddComponent(path, parentName) {
    if (path.node.type === "JSXElement") {
        const openingElement = path.node.openingElement;
        if (checkIfValidReactComponent(openingElement.name.name))
            console.log(openingElement.name.name);
    }
}
