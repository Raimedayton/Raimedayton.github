// Global Variables
let memory = 0;
let currentInput = "0";
let currentOperator = null;
let leftOperand = null;
let waitingForRightOperand = false;
let lastOperation = "";
let calculationDone = false;

// DOM Elements
const display = document.getElementById('display');
const history = document.getElementById('history');

// Initialize display
display.value = "0";

// Display Functions
function appendToDisplay(value) {
    if (calculationDone && !isNaN(value)) {
        clearDisplay();
        calculationDone = false;
    } else if (calculationDone) {
        calculationDone = false;
    }

    if (waitingForRightOperand) {
        display.value = value;
        waitingForRightOperand = false;
    } else {
        if (display.value === "0" && value !== ".") {
            display.value = value;
        } else {
            display.value += value;
        }
    }

    currentInput = display.value;
}

function clearDisplay() {
    display.value = "0";
    currentInput = "0";
}

function clearAll() {
    clearDisplay();
    history.textContent = "";
    leftOperand = null;
    currentOperator = null;
    waitingForRightOperand = false;
    lastOperation = "";
}

function deleteLast() {
    if (display.value.length > 1) {
        display.value = display.value.slice(0, -1);
    } else {
        display.value = "0";
    }
    currentInput = display.value;
}

// Memory Functions
function clearMemory() {
    memory = 0;
}

function recallMemory() {
    display.value = memory;
    currentInput = display.value;
}

function addToMemory() {
    try {
        memory += parseFloat(display.value);
    } catch (e) {
        display.value = "Error";
    }
}

function subtractFromMemory() {
    try {
        memory -= parseFloat(display.value);
    } catch (e) {
        display.value = "Error";
    }
}

// Evaluate Function
function evaluateExpression(expression) {
    if (!isNaN(parseFloat(expression)) && isFinite(expression)) {
        return parseFloat(expression);
    }

    const tokens = [];
    let currentNumber = '';

    for (let i = 0; i < expression.length; i++) {
        const char = expression[i];
        if (char === '+' || char === '-' || char === '*' || char === '/') {
            if (currentNumber) {
                tokens.push(parseFloat(currentNumber));
                currentNumber = '';
            }
            tokens.push(char);
        } else if (!isNaN(parseInt(char)) || char === '.') {
            currentNumber += char;
        }
    }

    if (currentNumber) {
        tokens.push(parseFloat(currentNumber));
    }

    for (let i = 1; i < tokens.length; i += 2) {
        if (tokens[i] === '*') {
            tokens[i - 1] = tokens[i - 1] * tokens[i + 1];
            tokens.splice(i, 2);
            i -= 2;
        } else if (tokens[i] === '/') {
            tokens[i - 1] = tokens[i - 1] / tokens[i + 1];
            tokens.splice(i, 2);
            i -= 2;
        }
    }

    let result = tokens[0];
    for (let i = 1; i < tokens.length; i += 2) {
        if (tokens[i] === '+') {
            result += tokens[i + 1];
        } else if (tokens[i] === '-') {
            result -= tokens[i + 1];
        }
    }

    return result;
}

// Calculation Function
function calculate() {
    try {
        if (currentOperator === "pow" && leftOperand !== null) {
            const rightOperand = parseFloat(display.value);
            history.textContent = `${leftOperand}^${rightOperand}`;
            display.value = Math.pow(leftOperand, rightOperand);
            leftOperand = null;
            currentOperator = null;
        } else {
            history.textContent = display.value;
            display.value = evaluateExpression(display.value);
        }
        calculationDone = true;
    } catch (e) {
        display.value = "Error";
    }
}

// Scientific Function Handler
function insertMathFunction(func) {
    try {
        const inputValue = parseFloat(display.value);
        let result;

        switch (func) {
            case 'sqrt':
                history.textContent = `√(${inputValue})`;
                result = Math.sqrt(inputValue);
                break;
            case 'pow':
                leftOperand = inputValue;
                history.textContent = `${leftOperand}^`;
                currentOperator = "pow";
                waitingForRightOperand = true;
                return;
            case 'abs':
                history.textContent = `abs(${inputValue})`;
                result = Math.abs(inputValue);
                break;
            case 'sin':
            case 'cos':
            case 'tan':
                history.textContent = `${func}(${inputValue})`;
                result = Math[func](inputValue);
                break;
            case 'asin':
            case 'acos':
            case 'atan':
                history.textContent = `${func}(${inputValue})`;
                result = Math[func](inputValue);
                break;
            case 'log':
                if (inputValue <= 0) throw new Error("Log undefined for ≤ 0");
                history.textContent = `log(${inputValue})`;
                result = Math.log10(inputValue);
                break;
            case 'ln':
                if (inputValue <= 0) throw new Error("Natural log undefined for ≤ 0");
                history.textContent = `ln(${inputValue})`;
                result = Math.log(inputValue);
                break;
            case 'exp':
                history.textContent = `exp(${inputValue})`;
                result = Math.exp(inputValue);
                break;
            case 'round':
            case 'ceil':
            case 'floor':
                history.textContent = `${func}(${inputValue})`;
                result = Math[func](inputValue);
                break;
            default:
                throw new Error("Unknown function");
        }

        display.value = result;
        currentInput = result.toString();
        calculationDone = true;
    } catch (e) {
        display.value = "Error";
    }
}

// Constant Insertion Handler
function insertMathConstant(constant) {
    let value;
    switch (constant) {
        case 'PI':
            value = Math.PI;
            break;
        case 'E':
            value = Math.E;
            break;
        case 'LN2':
            value = Math.LN2;
            break;
        case 'LN10':
            value = Math.LN10;
            break;
        default:
            value = 0;
    }

    display.value = value;
    currentInput = value.toString();
    calculationDone = true;
}
