
const input = document.querySelector('.calc__display input');

function clear(){
    input.value = '';
}

function setFocus(){
    document.querySelector('.calc__display input').focus();
}


function answer(expression){
    let expressionArray = parseExpression(expression);
    let startNode = new Node(expressionArray);
    createTree(startNode);
    return calcTree(startNode);
}
function Node (nodeValue) {
    nodeValue = nodeValue || '';

    const children = [];

    return {
        value : function (value) {
            if (arguments.length) {
                nodeValue = value;
                return this;
            } else {
                return nodeValue;
            }
        },

        child : function (id) {
            return children[id];
        },

        addChild : function (node) {
            children.push(node);
            return this;
        }
    };
}

function getClosingBracket(expr, pos) {
    let counter = 0;
    for (let len = expr.length; pos < len; pos++) {
        let char = expr[pos];

        if (char === '(') {
            counter++;
        } else if (char === ')') {
            if (!--counter) return pos;
        }
    }

    return 0;
}

function isOperator(char) {
    return  char === '+' ||
        char === '-' ||
        char === '*' ||
        char === '/';
}

function getLowPriorityOp(expArr) {
    let len = expArr.length,
        i, val,
        lowOp = '',
        lowPos = 0;

    for (i = 0; i < len; i++) {
        val = expArr[i];

        if (val === '(') {
            i = getClosingBracket(expArr, i);
            continue;
        }

        if (isOperator(val)) {
            if (!lowOp ||
                (lowOp === '*' || lowOp === '/' &&
                    val === '+' || val === '-')) {

                lowOp = val;
                lowPos = i;
            }
        }
    }

    return lowPos;
}

function parseExpression(str){
    return str.replace(/\s/g, '').replace(/([+-\/*]|^|\()-([\d.]+)/g, '$1(0-$2)').match(/[\d.]+|[+-\/*\(\)]/g);
}
function isString(obj) {
    return Object.prototype.toString.call(obj) === '[object String]';
}

function isArray(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
}

function isExpression(expArr) {
    return isArray(expArr) && expArr.join('').search(/[+\-\/*]/) !== -1;
}

function trimBrackets(exprArr) {
    while (true) {
        if (exprArr[0] === '(' &&
            getClosingBracket(exprArr, 0) === exprArr.length -1 ) {

            exprArr = exprArr.slice(1, exprArr.length -1);
        } else {
            return exprArr;
        }
    }
}

function createTree(node) {
    let expArr = trimBrackets(node.value()),
        divPos = 0,
        opChar = '',
        nodeA, nodeB;

    if (!isExpression(expArr)) return;

    divPos = getLowPriorityOp(expArr);
    opChar = expArr[divPos];

    nodeA = new Node(expArr.slice(0, divPos));
    nodeB = new Node(expArr.slice(divPos + 1));

    node.addChild(nodeA).addChild(nodeB);
    node.value(opChar);

    createTree(nodeA);
    createTree(nodeB);
}
function calcTree(rootNode) {
    let val = rootNode.value();

    if (isString(val) && val.search(/[+\-\/*]/) !== -1) {
        let childA = rootNode.child(0),
            childB = rootNode.child(1),
            valA = calcTree(childA),
            valB = calcTree(childB);

        switch(val) {
            case '+' : return valA + valB;
            case '-' : return valA - valB;
            case '*' : return valA * valB;
            case '/' : return valA / valB;
        }
    } else {
        return Number(val);
    }
}



document.querySelector('.buttons').onclick = event => {
    if (!event.target.classList.contains('btn')) return;

    if (event.target.classList.contains('ac')){
        clear();
        return;
    }
    const key = event.target.textContent;


    if (key==="="){
        const answ =  answer(input.value);
        clear();
        input.value = answ;
        return;
    }

    input.value += key;
    setFocus();

}

document.querySelector('.calc__display input').addEventListener('input', () => {
    if (input.value.length > 10){
        input.style.fontSize = '3rem';
    }
})

document.querySelector('.calc__display input').addEventListener('keyup', (e) => {
    if (e.keyCode === 13){
        const answ =  answer(input.value);
        clear();
        input.value = answ;
    }


})