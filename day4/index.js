const fs = require('fs');
const readline = require('readline');

// Replace 'your-file.txt' with the path to your input file
const filePath = 'input';

const readStream = fs.createReadStream(filePath);
const rl = readline.createInterface({
  input: readStream,
  crlfDelay: Infinity,
});


rl.on('line', processLine);
rl.on('close', printResults);

let lineNumber = 0;
let totalPoints = 0;
let counter = [];

function processLine(line) {
  const nMatches = getMatchCount(line);
  solvePartOne(nMatches);
  solvePartTwo(nMatches);
}


function getMatchCount(line) {
  lineNumber += 1
  counter[lineNumber]  = counter[lineNumber] ? counter[lineNumber]  + 1 : 1;
  const ls = line.split(":")[1].split("|")
  const winningNumbers = new Set(pullNumbers(ls[0]))
  const cardNumbers = pullNumbers(ls[1])
  const countMatches = cardNumbers.map(number => winningNumbers.has(number))
  const nMatches = countMatches.reduce((a, b) => a + b, 0)
  return nMatches
}

function solvePartOne(power){
  if (power > 0) {
    totalPoints += 2**(power - 1);
  }
}

function solvePartTwo(nMatches){
  for (let i = 1; i <= nMatches; i++) {
    counter[lineNumber + i] ? counter[lineNumber + i] += counter[lineNumber] : counter[lineNumber + i] = counter[lineNumber]
  }
}


function pullNumbers(line) {
  const regex = /\d+/g;
  return line.match(regex).map(n => parseInt(n, 10));
}

function printResults() {
  totalCards = 0
  counter.forEach((nCards) => { totalCards += nCards })
  console.log(`Total sum of game numbers: ${totalPoints}`);
  console.log(`Total number of cards: ${totalCards}`);
}

