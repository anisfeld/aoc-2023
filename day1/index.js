const fs = require('fs');
const readline = require('readline');

// Replace 'your-file.txt' with the path to your input file
const filePath = 'input';

const readStream = fs.createReadStream(filePath);
const rl = readline.createInterface({
  input: readStream,
  crlfDelay: Infinity,
});

const numbers = {
  'zero': '0o',
  'one': 'o1e',
  'two': 't2o',
  'three': 't3e',
  'four': 'f4r',
  'five': 'f5e',
  'six': 's6x',
  'seven': 's7n',
  'eight': 'e8t',
  'nine': 'n9e',
};

let totalSum = 0;

rl.on('line', (line) => {
  // skip lines to get answer for part 1
  for (let key in numbers) {
    line = findAndReplace(line, key, numbers[key])
  }
  
  const firstDigit = findFirstDigit(line);
  const lastDigit = findLastDigit(line);

  const sum = 10 * parseInt(firstDigit, 10) + parseInt(lastDigit, 10);
  totalSum += sum;
});

rl.on('close', () => {
  console.log(`Total sum of first and last digits: ${totalSum}`);
});

function findFirstDigit(str) {
  const match = str.match(/\d/);
  return match ? match[0] : null;
}

function findLastDigit(str) {
  const match = str.match(/\d(?!.*\d)/);
  return match ? match[0] : null;
}

// Function to perform find-and-replace in a string
function findAndReplace(inputString, findStr, replaceStr) {
  // Using a regular expression with the global flag to replace all occurrences
  const regex = new RegExp(findStr, 'g');
  const resultString = inputString.replace(regex, replaceStr);
  return resultString;
}
