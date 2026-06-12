// ===============================
// VUNA Calculator - Basic + Base Converter + Bitwise
// ===============================

let currentExpression = "";

// ------------------------------
// Basic Calculator Functions
// ------------------------------

function appendToResult(value) {
  currentExpression += value.toString();
  updateResult();
}

function bracketToResult(value) {
  currentExpression += value;
  updateResult();
}

function backspace() {
  currentExpression = currentExpression.slice(0, -1);
  updateResult();
}

function operatorToResult(value) {
  if (value === "^") {
    currentExpression += "**";
  } else {
    currentExpression += value;
  }
  updateResult();
}

function clearResult() {
  currentExpression = "";
  var wordResult = document.getElementById("word-result");
  var wordArea = document.getElementById("word-area");
  if (wordResult) wordResult.innerHTML = "";
  if (wordArea) wordArea.style.display = "none";
  updateResult();
}

function percentToResult() {
  if (!currentExpression) return;

  var match = currentExpression.match(/(.+?)(\*\*|[+\-*/^])([0-9.]*)$/);

  if (!match) {
    var num = parseFloat(currentExpression);
    if (isNaN(num)) return;
    currentExpression = (num / 100).toString();
  } else {
    var leftPart = match[1];
    var rightPart = match[3];
    if (!rightPart) return;

    var leftVal;
    try {
      leftVal = eval(leftPart);
    } catch (e) {
      leftVal = parseFloat(leftPart);
    }

    var rightVal = parseFloat(rightPart);
    if (isNaN(leftVal) || isNaN(rightVal)) return;

    currentExpression = ((leftVal * rightVal) / 100).toString() + "*";
  }

  updateResult();
}

// ------------------------------
// Calculate Result
// ------------------------------

function calculateResult() {
  if (!currentExpression) return;

  try {
    var normalizedExpression = currentExpression;
    var result = eval(normalizedExpression);

    if (isNaN(result) || !isFinite(result)) {
      throw new Error();
    }

    currentExpression = result.toString();
    updateResult();

    var wordResult = document.getElementById("word-result");
    if (wordResult) {
      wordResult.innerHTML = numberToWords(result);
    }
  } catch (e) {
    currentExpression = "Error";
    updateResult();
  }
}

// ------------------------------
// Update Display
// ------------------------------

function updateResult() {
  var resultEl = document.getElementById("result");
  if (resultEl) {
    resultEl.value = currentExpression || "0";
  }

  var wordResult = document.getElementById("word-result");
  var wordArea = document.getElementById("word-area");
  if (!wordResult || !wordArea) return;

  var num = parseFloat(currentExpression);
  if (
    !isNaN(num) &&
    isFinite(num) &&
    currentExpression.trim() === num.toString()
  ) {
    wordResult.innerHTML =
      "<span class=\"small-label\">Result in words</span><strong>" +
      numberToWords(currentExpression) +
      "</strong>";
    wordArea.style.display = "flex";
  } else {
    wordResult.innerHTML = "";
    wordArea.style.display = "none";
  }
}

// ------------------------------
// Copy Result
// ------------------------------

function copyResult() {
  var text = document.getElementById("result").value;
  if (!text || text === "0") return;
  navigator.clipboard
    .writeText(text)
    .then(function () {
      alert("Result copied!");
    })
    .catch(function () {
      alert("Failed to copy");
    });
}

// ------------------------------
// Number to Words (English)
// ------------------------------

function numberToWords(num) {
  if (num === "Error") return "Error";
  if (!num && num !== 0) return "";

  var n = parseFloat(num);
  if (isNaN(n)) return "";
  if (n === 0) return "Zero";

  var ones = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
  ];
  var tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];
  var teens = [
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  var scales = ["", "Thousand", "Million", "Billion", "Trillion"];

  function convertGroup(val) {
    var res = "";
    if (val >= 100) {
      res += ones[Math.floor(val / 100)] + " Hundred ";
      val %= 100;
    }
    if (val >= 10 && val <= 19) {
      res += teens[val - 10] + " ";
    } else if (val >= 20) {
      res += tens[Math.floor(val / 10)];
      if (val % 10 !== 0) res += "-" + ones[val % 10];
      res += " ";
    } else if (val > 0) {
      res += ones[val] + " ";
    }
    return res.trim();
  }

  var sign = n < 0 ? "Negative " : "";
  var absN = Math.abs(n);
  var parts = absN.toString().split(".");
  var integerPart = parseInt(parts[0]);
  var decimalPart = parts[1];
  var wordArr = [];

  if (integerPart === 0) {
    wordArr.push("Zero");
  } else {
    var scaleIdx = 0;
    while (integerPart > 0) {
      var chunk = integerPart % 1000;
      if (chunk > 0) {
        var chunkWords = convertGroup(chunk);
        wordArr.unshift(
          chunkWords + (scales[scaleIdx] ? " " + scales[scaleIdx] : ""),
        );
      }
      integerPart = Math.floor(integerPart / 1000);
      scaleIdx++;
    }
  }

  var result = sign + wordArr.join(", ").trim();

  if (decimalPart) {
    result += " Point";
    for (var i = 0; i < decimalPart.length; i++) {
      var digit = decimalPart[i];
      result += " " + (digit === "0" ? "Zero" : ones[parseInt(digit)]);
    }
  }
  return result.trim();
}

// ------------------------------
// Keyboard Support
// ------------------------------

document.addEventListener("keydown", function (event) {
  var key = event.key;

  if (!isNaN(key) && key !== " ") {
    appendToResult(key);
  } else if (key === "+" || key === "-" || key === "*" || key === "/") {
    operatorToResult(key);
  } else if (key === "Enter") {
    event.preventDefault();
    calculateResult();
  } else if (key === "Backspace") {
    backspace();
  } else if (key === "Escape") {
    clearResult();
  } else if (key === "(" || key === ")") {
    bracketToResult(key);
  } else if (key === ".") {
    appendToResult(key);
  }
});

// ===============================
// BASE CONVERTER & BITWISE OPERATIONS
// ===============================

/**
 * Convert decimal number to binary, hex, and octal
 */
function convertDecimal() {
  var decimalInput = document.getElementById("decimal-input");
  var value = parseInt(decimalInput.value);

  if (isNaN(value) || value < 0) {
    document.getElementById("binary-result").textContent = "0";
    document.getElementById("hex-result").textContent = "0x0";
    document.getElementById("octal-result").textContent = "0";
    document.getElementById("decimal-result").textContent = "0";
    return;
  }

  var binary = value.toString(2);
  var hex = "0x" + value.toString(16).toUpperCase();
  var octal = "0" + value.toString(8);

  document.getElementById("binary-result").textContent = binary;
  document.getElementById("hex-result").textContent = hex;
  document.getElementById("octal-result").textContent = octal;
  document.getElementById("decimal-result").textContent = value.toString();
}

/**
 * Convert binary to decimal
 */
function convertFromBinary() {
  var binaryInput = document.getElementById("binary-input").value.trim();

  if (!binaryInput) {
    document.getElementById("binary-to-decimal").textContent = "0";
    return;
  }

  if (!/^[01]+$/.test(binaryInput)) {
    document.getElementById("binary-to-decimal").textContent = "Invalid binary";
    return;
  }

  var decimal = parseInt(binaryInput, 2);
  document.getElementById("binary-to-decimal").textContent = decimal.toString();
}

/**
 * Convert hexadecimal to decimal
 */
function convertFromHex() {
  var hexInput = document.getElementById("hex-input").value.trim();

  if (!hexInput) {
    document.getElementById("hex-to-decimal").textContent = "0";
    return;
  }

  if (!/^[0-9A-Fa-f]+$/.test(hexInput)) {
    document.getElementById("hex-to-decimal").textContent = "Invalid hex";
    return;
  }

  var decimal = parseInt(hexInput, 16);
  document.getElementById("hex-to-decimal").textContent = decimal.toString();
}

/**
 * Convert octal to decimal
 */
function convertFromOctal() {
  var octalInput = document.getElementById("octal-input").value.trim();

  if (!octalInput) {
    document.getElementById("octal-to-decimal").textContent = "0";
    return;
  }

  if (!/^[0-7]+$/.test(octalInput)) {
    document.getElementById("octal-to-decimal").textContent = "Invalid octal";
    return;
  }

  var decimal = parseInt(octalInput, 8);
  document.getElementById("octal-to-decimal").textContent = decimal.toString();
}

/**
 * Bitwise AND operation
 */
function bitwiseAND() {
  var num1 = parseInt(document.getElementById("bitwise-num1").value) || 0;
  var num2 = parseInt(document.getElementById("bitwise-num2").value) || 0;
  displayBitwiseResult(num1 + " & " + num2, num1 & num2);
}

/**
 * Bitwise OR operation
 */
function bitwiseOR() {
  var num1 = parseInt(document.getElementById("bitwise-num1").value) || 0;
  var num2 = parseInt(document.getElementById("bitwise-num2").value) || 0;
  displayBitwiseResult(num1 + " | " + num2, num1 | num2);
}

/**
 * Bitwise XOR operation
 */
function bitwiseXOR() {
  var num1 = parseInt(document.getElementById("bitwise-num1").value) || 0;
  var num2 = parseInt(document.getElementById("bitwise-num2").value) || 0;
  displayBitwiseResult(num1 + " ^ " + num2, num1 ^ num2);
}

/**
 * Bitwise NOT operation
 */
function bitwiseNOT() {
  var num1 = parseInt(document.getElementById("bitwise-num1").value) || 0;
  displayBitwiseResult("~" + num1, ~num1);
}

/**
 * Left Shift operation
 */
function leftShift() {
  var num1 = parseInt(document.getElementById("bitwise-num1").value) || 0;
  var num2 = parseInt(document.getElementById("bitwise-num2").value) || 0;
  displayBitwiseResult(num1 + " << " + num2, num1 << num2);
}

/**
 * Right Shift operation
 */
function rightShift() {
  var num1 = parseInt(document.getElementById("bitwise-num1").value) || 0;
  var num2 = parseInt(document.getElementById("bitwise-num2").value) || 0;
  displayBitwiseResult(num1 + " >> " + num2, num1 >> num2);
}

/**
 * Display bitwise operation results
 */
function displayBitwiseResult(operation, result) {
  var resultDiv = document.getElementById("bitwise-result");
  document.getElementById("bitwise-op").textContent = operation;
  document.getElementById("bitwise-decimal").textContent = result;
  document.getElementById("bitwise-binary").textContent = result.toString(2);
  resultDiv.style.display = "block";
}

/**
 * Clear bitwise calculator
 */
function clearBitwise() {
  document.getElementById("bitwise-num1").value = "5";
  document.getElementById("bitwise-num2").value = "3";
  document.getElementById("bitwise-result").style.display = "none";
}
