let memory = 0;
let history = [];

function appendNumber(number) {
  const display = document.getElementById('display');
  display.value += number;
}

function appendOperator(operator) {
  const display = document.getElementById('display');
  const lastChar = display.value.slice(-1);

  if (/[+\-*/^√%()]/.test(lastChar) && operator !== '(' && operator !== '-' && operator !== '.') {
    display.value = display.value.slice(0, -1) + operator;
  } else{
    display.value += operator;
  }

}

function appendPercentage() {
  const display = document.getElementById('display');
  display.value += '%';
}

function toggleSign() {
  const display = document.getElementById('display');
  if (display.value.startsWith('-')) {
    display.value = display.value.slice(1);
  } else {
    display.value = '-' + display.value;
  }
}

function clearDisplay() {
  const display = document.getElementById('display');
  const historyDisplay = document.getElementById('history');
  display.value = '';
  historyDisplay.textContent = "";
  history = [];

}

function calculate() {
  const display = document.getElementById('display');
  const historyDisplay = document.getElementById('history');
  let expression = display.value;
  let result;

  // Replace symbols for evaluation
  expression = expression.replace(/√/g, 'Math.sqrt');
  expression = expression.replace(/\^/g, '**');
  expression = expression.replace(/%/g, '*0.01');
  expression = expression.replace(/sin\(/g, 'Math.sin(');
  expression = expression.replace(/cos\(/g, 'Math.cos(');
  expression = expression.replace(/tan\(/g, 'Math.tan(');
  expression = expression.replace(/log\(/g, 'Math.log10(');
  expression = expression.replace(/ln\(/g, 'Math.log(');
  expression = expression.replace(/π/g, 'Math.PI');


  try {
    result = evaluateExpression(expression);

    if (isNaN(result) || !isFinite(result)) {
      display.value = 'Error';
      return;
    }

    const formattedResult = formatResult(result);

    history.push(display.value + ' = ' + formattedResult);
    if (history.length > 3) {
      history.shift();
    }
    historyDisplay.textContent = history.join(' ');
    display.value = formattedResult;


  } catch (error) {
    display.value = 'Error';
    historyDisplay.textContent =  history.join(' ');

  } finally{
    historyDisplay.textContent =  history.join(' ');
  }
}

function evaluateExpression(expression) {
  let result;
  try {
    result = new Function('return ' + expression)();
  } catch (e) {
    throw new Error('Evaluation Error');
  }
  return result;
}

function formatResult(number) {
  const numStr = String(number);
  if (numStr.length > 15) {
    //If number is too long, round the number and display it in the exponential format to fit the screen
    return  number.toExponential(5);
  }

  if(Number.isInteger(number)){
    return numStr;
  }

  return number.toFixed(10);
}
function appendPi() {
  const display = document.getElementById('display');
  display.value += 'π';
}


function memoryStore() {
  const display = document.getElementById('display');
  memory = parseFloat(display.value) || 0;
}

function memoryRecall() {
  const display = document.getElementById('display');
  display.value = memory;
}

function memoryAdd() {
  const display = document.getElementById('display');
  memory += parseFloat(display.value) || 0;
}

function memorySubtract() {
  const display = document.getElementById('display');
  memory -= parseFloat(display.value) || 0;
}
function memoryClear() {
  memory = 0;
}

document.addEventListener('keydown', function(event) {
  const key = event.key;
  if (/[0-9]/.test(key)) {
    appendNumber(key);
  } else if (/[+\-*/^%()]/.test(key)) {
    appendOperator(key);
  } else if (key === '.') {
    appendNumber('.');
  } else if (key === 'Enter' || key === '=') {
    calculate();
  } else if (key === 'Backspace' || key === 'Delete') {
    clearDisplay();
  }
});
