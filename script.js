// Function to get the content of the 'history-value' element (typically where the calculation history is displayed).
function getHistory() {
    return document.getElementById('history-value').innerText;
}

// Function to set the content of the 'history-value' element with the provided 'num'.
function printHistory(num) {
    document.getElementById('history-value').innerText = num;
}

// Function to get the content of the 'output-value' element (typically where the calculation result is displayed).
function getOutput() {
    return document.getElementById('output-value').innerText;
}

// Function to set the content of the 'output-value' element with the provided 'num' (formatted as needed).
function printOutput(num) {
    if (num == "") {
        document.getElementById('output-value').innerText = num;
    } else {
        document.getElementById('output-value').innerText = getFormattedNumber(num);
    }
}
var displayText = document.getElementById("display-text");

function calculate() {
  var input = document.getElementById("output-value").innerHTML;
  var result = eval(input);

  if (result.toString().length > 10) {
    result = result.toExponential(2);
  }

  displayText.innerHTML = result;
}

// Function to format a number with commas for thousands separators.
function getFormattedNumber(num) {
    if (num == "-") {
        return "";
    }
    var n = Number(num);
    var value = n.toLocaleString("en");
    return value;
}

// Function to reverse the formatting done by 'getFormattedNumber'.
function reverseNumberFormat(num) {
    return Number(num.replace(/,/g, ''));
}
// JavaScript to trigger the animation

const instructionsElement = document.getElementById('instructions');

function startAnimation() {
    instructionsElement.classList.add('animate-typing');
}

// Start the animation when the page loads
startAnimation();

// Listen for mouseover event on the microphone icon
const microphoneElement = document.getElementById('microphone');
microphoneElement.addEventListener('mouseover', startAnimation);

// Listen for animation end event and remove the animation class to stop it
instructionsElement.addEventListener('animationiteration', () => {
    instructionsElement.classList.remove('animate-typing');
});

// Event listeners for operator buttons (e.g., +, -, *, /) and special buttons (clear, backspace).
var operator = document.getElementsByClassName('operator');
for (var i = 0; i < operator.length; i++) {
    operator[i].addEventListener('click', function () {
        if (this.id == "clear") {
            printHistory("");
            printOutput("");
        } else if (this.id == "backspace") {
            // Handle backspace button to remove the last character from the output.
            var output = reverseNumberFormat(getOutput()).toString();
            if (output) {
                output = output.substr(0, output.length - 1);
                printOutput(output);
            }
        } else {
            // Handle other operators (+, -, *, /) and = (equals) button for calculation.
            var output = getOutput();
            var history = getHistory();

            if (output == "" && history != "") {
                if (isNaN(history[history.length - 1])) {
                    history = history.substr(0, history.length - 1);
                }
            }
            if (output != "" || history != "") {
                output = output == "" ? output : reverseNumberFormat(output);
                history = history + output;

                if (this.id == "=") {
                    // Calculate the result and display it.
                    var result = eval(history);
                    printOutput(result);
                    printHistory("");
                } else {
                    // Append the operator to the history.
                    history = history + this.id;
                    printHistory(history);
                    printOutput("");
                }
            }
        }
    });
}

// Event listeners for number buttons (0-9).
var number = document.getElementsByClassName('number');
for (var i = 0; i < number.length; i++) {
    number[i].addEventListener('click', function () {
        // Handle number buttons to append the clicked number to the output.
        var output = reverseNumberFormat(getOutput());
        if (!isNaN(output)) {
            output = output + this.id;
            printOutput(output);
        }
    });
}

// Event listener for the microphone button to enable voice input.
var microphone = document.getElementById('microphone');
microphone.onclick = function () {
    microphone.classList.add("record");
    var recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition
        || window.msSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.start();

    // Define a dictionary to map spoken words to their corresponding mathematical operators.
    operations = {
        "plus": "+",
        "minus": "-",
        "multiply": "*",
        "x": "*",
        "multiplied": "*",
        "multiply by": "*",
        "multiplied by": "*",
        "divide": "/",
        "divided": "/",
        "divide by": "/",
        "divided by": "/",
        "reminder": "%" // Note: There's a typo here; it should be "remainder" instead of "reminder".
    };

    recognition.onresult = function (event) {
        var input = event.results[0][0].transcript;

        // Replace spoken words with their corresponding operators.
        for (property in operations) {
            input = input.replace(property, operations[property]);
        }

        // Display the voice input in the 'output-value' element and evaluate it.
        document.getElementById("output-value").innerText = input;
        setTimeout(function () {
            evaluate(input);
        }, 750);

        // Remove the "record" class from the microphone button.
        microphone.classList.remove("record");
    }
}

// Function to evaluate and display the result of a mathematical expression.
function evaluate(input) {
    try {
        var result = eval(input);
        document.getElementById("output-value").innerText = result;
    } catch (e) {
        console.log(e);
        document.getElementById("output-value").innerText = "";
    }
}
