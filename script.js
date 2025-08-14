const display = document.getElementById('display');
const buttons = document.querySelectorAll('.btn');
const sciButtons = document.querySelectorAll('.sci');
const modeSelector = document.getElementById('mode');
const historyList = document.getElementById('historyList');

let expression = '';

function updateDisplay() {
  display.value = expression || '0';
}

function evaluateExpression() {
  try {
    // Balance parentheses before eval
    const open = (expression.match(/\(/g) || []).length;
    const close = (expression.match(/\)/g) || []).length;
    const balancedExpr = expression + ')'.repeat(open - close);

    // Evaluate using safe JS Math functions
    let result = eval(balancedExpr);

    // Fix floating-point rounding errors (up to 8 decimals)
    if (typeof result === 'number') {
      result = +result.toFixed(8);
    }

    historyList.innerHTML += `<li>${expression} = ${result}</li>`;
    expression = result.toString();
    updateDisplay();
  } catch (e) {
    display.value = 'Error';
    expression = '';
  }
}

buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    const val = btn.getAttribute('data-value');
    if (val === 'C') {
      expression = '';
      updateDisplay();
    } else if (val === '=') {
      evaluateExpression();
    } else {
      expression += val;
      updateDisplay();
    }
  });
});

modeSelector.addEventListener('change', () => {
  const isSci = modeSelector.value === 'scientific';
  sciButtons.forEach(btn => {
    btn.style.display = isSci ? 'block' : 'none';
  });
});

document.addEventListener('keydown', (e) => {
  const allowedKeys = '0123456789.+-*/()';
  if (allowedKeys.includes(e.key)) {
    expression += e.key;
    updateDisplay();
  } else if (e.key === 'Enter') {
    evaluateExpression();
  } else if (e.key === 'Backspace') {
    expression = expression.slice(0, -1);
    updateDisplay();
  }
});
