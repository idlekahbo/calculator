var display = document.getElementById("display");
var calculation = "";
var iserror = false;
var finished_calculation = false;
var display_value = "";

function Calculate(expression) {
    expression = expression.replace(/\s+/g, ""); // Remove spaces

    // Function to handle precedence of operations
    function precedence(op) {
        if (op === "+" || op === "-") return 1;
        if (op === "*" || op === "/") return 2;
        return 0;
    }

    // Function to perform the calculation for a specific operator
    function applyOperation(a, b, operator) {
        switch (operator) {
            case "+":
                return a + b;
            case "-":
                return a - b;
            case "*":
                return a * b;
            case "/":
                if (b === 0) return NaN; // Division by zero is not allowed
                return a / b;
            default:
                return NaN; // Invalid operator
        }
    }

    // Function to evaluate the expression
    function evaluateExpression(expr) {
        const values = [];  // Stack to store values (numbers)
        const ops = [];     // Stack to store operators
        let i = 0;

        while (i < expr.length) {
            if (expr[i] === "(") {
                let start = i;
                let openCount = 1;
                i++;
                while (openCount !== 0) {
                    if (expr[i] === "(") openCount++;
                    if (expr[i] === ")") openCount--;
                    i++;
                }
                values.push(evaluateExpression(expr.slice(start + 1, i - 1))); // Recursively evaluate the inside of parentheses
            } else if (/\d/.test(expr[i])) {
                let num = "";
                while (i < expr.length && /\d|\./.test(expr[i])) {
                    num += expr[i++];
                }
                values.push(parseFloat(num)); // Convert the number string to a float and push onto the values stack
            } else if (expr[i] === "+" || expr[i] === "-") {
                // Handle unary + or - (negative numbers or positive numbers)
                if (i === 0 || expr[i - 1] === "(" || ["+", "-", "*", "/", "^"].includes(expr[i - 1])) {
                    // It's a unary operator, not a binary operator
                    let num = "";
                    i++; // Skip the unary sign
                    while (i < expr.length && /\d|\./.test(expr[i])) {
                        num += expr[i++];
                    }
                    values.push(parseFloat(expr[i - num.length - 1] + num)); // Handle negative sign
                } else {
                    // Regular binary operator
                    while (
                        ops.length > 0 &&
                        precedence(ops[ops.length - 1]) >= precedence(expr[i])
                    ) {
                        const op = ops.pop();
                        const b = values.pop();
                        const a = values.pop();
                        values.push(applyOperation(a, b, op)); // Apply the previous operator with values
                    }
                    ops.push(expr[i]); // Push the current operator onto the operator stack
                    i++;
                }
            } else if (/[+\-*/]/.test(expr[i])) {
                // For other operators: +, -, *, /
                while (
                    ops.length > 0 &&
                    precedence(ops[ops.length - 1]) >= precedence(expr[i])
                ) {
                    const op = ops.pop();
                    const b = values.pop();
                    const a = values.pop();
                    values.push(applyOperation(a, b, op)); // Apply the operator with the values
                }
                ops.push(expr[i]); // Push the current operator onto the operator stack
                i++;
            } else {
                // If we encounter any invalid characters, return NaN
                return NaN;
            }
        }

        // Apply the remaining operators in the stack
        while (ops.length > 0) {
            const op = ops.pop();
            const b = values.pop();
            const a = values.pop();
            values.push(applyOperation(a, b, op)); // Apply the last operator with the remaining values
        }

        return values[0]; // The result is the last remaining value in the values stack
    }

    try {
        return evaluateExpression(expression);
    } catch (error) {
        return NaN; // Return NaN for any unexpected error
    }
}

function formatNumber(num) {
    // Step 1: Convert the number to a string with a reasonable precision
    let numStr = Number(num).toFixed(15); // Use 15 decimal places for safety

    // Remove unnecessary trailing zeros
    if (numStr.includes('.')) {
        numStr = numStr.replace(/(\.\d*?)0+$/, '$1'); // Remove trailing zeros
        if (numStr[numStr.length - 1] === '.') {
            numStr = numStr.slice(0, -1); // Remove trailing dot if no decimals left
        }
    }

    // Step 2: Check if the length exceeds 12
    if (numStr.length > 12) {
        // Split into integer and decimal parts
        let [integerPart, decimalPart] = numStr.split('.');
        if (integerPart.length > 12) {
            return NaN; // If the integer part alone exceeds 12 characters, it's invalid
        }

        // Calculate how many decimal places are allowed
        let maxDecimalLength = 12 - integerPart.length - 1; // -1 for the decimal point
        if (decimalPart) {
            decimalPart = decimalPart.slice(0, maxDecimalLength); // Truncate decimals
        }

        // Recombine the parts
        numStr = integerPart + (decimalPart ? '.' + decimalPart : '');
    }

    // Step 3: Return the final number as a float
    return parseFloat(numStr);
}



//* Adds to display
function AddToDisplay(value) {
    //* Checks to see if there is an error being shown
    if (iserror == true) {
        if (!["+", "-", "*", "/"].includes(value)) {
            DeleteDisplay();
            iserror = false;
        } else {
            return;
        }
        //* \/ checks to see if there has been a recent calculation and if there has and there is an operator input, add to the answer of the previous calculation else: return back to normal
    } else if (["+", "-", "*", "/"].includes(value) && finished_calculation == true) {
        finished_calculation = false;
    } else if (finished_calculation == true) {
        finished_calculation = false;
        calculation = ""
        DeleteDisplay();
    }
    calculation = calculation + value;
    display_value += value.replace("/", "÷").replace("*", "×").replace("-", "−");
    display.value = "‪" + display_value + "‬";
}

//* Deletes screen
function DeleteDisplay() {
    display.value = "";
    calculation = "";
    display_value = "";
}
//* Calculates the calculation
function EvaluateDisplay() {
    // (!calculation == "") checks to see if baically they have pressed = without an equation and if so just do nothing
    if (!calculation == "") {
        // calculates the equation
        calculation = Calculate(calculation);
        // Checks to see for an error in the calculation if so just say Error and end
        if (isNaN(calculation)) {
            iserror = true;
            display.value = "‪" + "Error" + "‬";
            return;
        }
        // checks for a large numbers and formats it to a more readable number
        calculation = formatNumber(calculation)
        // checks to see if the number is to big and if so just say Error and end
        if (isNaN(calculation)) {
            iserror = true;
            display.value = "‪" + "To Long" + "‬";
            return;
        }
    }
    finished_calculation = true;
    display_value = calculation;
    display.value = "‪" + display_value + "‬";
}