const fs = require('fs');
const readline = require('readline');

// Replace 'your-file.txt' with the path to your input file
const filePath = 'input';

const readStream = fs.createReadStream(filePath);
const rl = readline.createInterface({
  input: readStream,
  crlfDelay: Infinity,
});

const totems = new Set(['#', '$', '%', '&', '@', '*', '+', '-', '/', '=',])
let numbers = []
let numbers_ = { 0: [] }
let symbols = { 0: [] }
let gears = { 0: [] }
let totalSum = 0;
let totalGearNumber = 0;
let rowNumber = 0;
rl.on('line', processLine);
rl.on('close', processResults);

function processLine(line) {
  rowNumber += 1;
  symbols[rowNumber] = []
  numbers_[rowNumber] = []
  gears[rowNumber] = []
  const x = pullNumbers(line)
  const ls = line.split("")
  for (let i = 0; i < ls.length; i++) {
    if (totems.has(ls[i])) {
      symbols[rowNumber].push(i)
      if (ls[i] == '*') {
        gears[rowNumber].push(i)
      }
    } else if (ls[i] == '.') {
      continue
    } else {
      thisNumber = x.shift()
      numbers.push({
        'value': parseInt(thisNumber, 10),
        'low': i - 1,
        'high': i + thisNumber.length,
        'row': rowNumber,
        'acceptable': false
      })

      numbers_[rowNumber].push({
        'value': parseInt(thisNumber, 10),
        'low': i - 1,
        'high': i + thisNumber.length,
        'acceptable': false
      })

      i += thisNumber.length - 1
    }

  }
}

function pullNumbers(line) {
  const regex = /\d+/g;
  return line.match(regex)
}

function processResults() {
  filterAndAddNumbers();
  findAndProcessGears();
  printResults();
}


function filterAndAddNumbers() {
  for (const number of numbers) {
    const { row, low, high } = number;

    for (const i of [row - 1, row, row + 1]) {
      const rowSymbols = symbols[i] || [];

      for (const x of rowSymbols) {
        if (low <= x && x <= high) {
          number.acceptable = true;
        }
      }
    }

    if (number.acceptable) {
      totalSum += number.value;
    }
  }
}


function findAndProcessGears() {
  rowNumber += 1;
  numbers_[rowNumber] = [];
  const gearRows = Object.keys(gears);

  for (const row of gearRows) {
    const currentRow = parseInt(row, 10);
    const gearsInCurrentRow = gears[currentRow];

    if (gearsInCurrentRow.length > 0) {
      for (const col of gearsInCurrentRow) {
        const thisGearsNumbers = [];
        for (const i of [currentRow - 1, currentRow, currentRow + 1]) {
          const rowNumbers = numbers_[i];
          if (rowNumbers && rowNumbers.length > 0) {
            const matchingNumbers = rowNumbers.filter(n => n.low <= col && col <= n.high);
            thisGearsNumbers.push(...matchingNumbers.map(n => n.value));
          }
        }

        if (thisGearsNumbers.length > 1) {
          totalGearNumber += thisGearsNumbers[0] * thisGearsNumbers[1];
        }
      }
    }
  }
}

function printResults() {
  console.log(`Total sum of game numbers: ${totalSum}`);
  console.log(`Total gear numbers: ${totalGearNumber}`);
}
