let finished_calculation = false;  // Ensure this is declared

document.addEventListener("keydown", function(event) {
    const keyMap = {
        "Numpad0": "0", "Digit0": "0",
        "Numpad1": "1", "Digit1": "1",
        "Numpad2": "2", "Digit2": "2",
        "Numpad3": "3", "Digit3": "3",
        "Numpad4": "4", "Digit4": "4",
        "Numpad5": "5", "Digit5": "5",
        "Numpad6": "6", "Digit6": "6",
        "Numpad7": "7", "Digit7": "7",
        "Numpad8": "8", "Digit8": "8",
        "Numpad9": "9", "Digit9": "9",
        "NumpadAdd": "+", "Equal": "+",
        "NumpadSubtract": "-",
        "NumpadMultiply": "*",
        "NumpadDivide": "/",
        "NumpadDecimal": ".", "Period": ".",
        "Equal": "=",
        "NumpadEnter": "Enter", "Enter": "Enter"
    };

    console.log("Key pressed:", event.code);  // Debugging

    if (event.code in keyMap) {
        if (keyMap[event.code] === "Enter" || keyMap[event.code] === "=") {
            if (finished_calculation && keyMap[event.code] === "Enter") {
                finished_calculation = false;
                calculation = "";
                DeleteDisplay();
            } else {
                EvaluateDisplay();
                finished_calculation = true;  // Set this after evaluating
            }
        } else {
            if (finished_calculation) { 
                // Reset display if typing after finishing a calculation
                finished_calculation = false;
                DeleteDisplay();
            }
            AddToDisplay(keyMap[event.code]);
        }
        event.preventDefault();
    }
});

var display = document.getElementById("display");
var calculation = "";
var iserror = false;
var display_value = "";
var item =""

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
    if (calculation.charAt(calculation.length - 1) == "." && ["+", "-", "*", "/"].includes(value)) {
        return;
    }
    //* Checking for bullet point cases and behavoiur
    if (value == ".") {
        if (["1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(calculation.charAt(calculation.length - 1))) {
            item = ".";
        } else if (["+", "-", "*", "/", "."].includes(calculation.charAt(calculation.length - 1))) {
            return;
        } else {
            item = "0.";
            finished_calculation = false;
        }
        //* Checks
    } else {
        item = value;
    }

    calculation = calculation + item;
    display_value += item.replace("/", "÷").replace("*", "×").replace("-", "−");
    display.value = "‪" + display_value + "‬";
    item = "";
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
        //* Captures the input for QWERTY
        var input = calculation;
        try {
            // calculates the equation
            calculation = window.math.evaluate(calculation);
        // Checks to see for an error in the calculation if so just say Error and end
        } catch (error) {
            iserror = true;
            display.value = "‪" + "Error" + "‬";
            return;
        }

        // checks for a large numbers and formats it to a more readable number
        calculation = formatNumber(calculation)
        // checks to see if the number is to big and if so just say Error and end
        if (isNaN(calculation)) {
            iserror = true;
            display.value = "‪" + "Too Long" + "‬";
            return;
        }
    }
    //* QWERTY basically if the input is the same as the calculation then do nothing
    if (calculation != input) {
        finished_calculation = true;
    } else {
        calculation = input;
    }
    calculation = calculation.toString();
    let store = "";
    for (let i = 0; i < calculation.length; i++) {
        store += calculation.charAt(i).replace("/", "÷").replace("*", "×").replace("-", "−");
    }
    display_value = store;
    display.value = "‪" + display_value + "‬";

}