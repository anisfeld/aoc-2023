const fs = require('fs');
const readline = require('readline');

// Replace 'your-file.txt' with the path to your input file
const filePath = 'input';

const readStream = fs.createReadStream(filePath);
const rl = readline.createInterface({
  input: readStream,
  crlfDelay: Infinity,
});


let totalSum = 0;
let totalPower = 0;
const colorMax = {
    "red": 12,
    "green": 13,
    "blue": 14
  }
  
rl.on('line', processLine);
rl.on('close', printResults);

function processLine(line){
    if (isValidLine(line, colorMax)){
       const gameNumber = findGameNumber(line);
       totalSum += parseInt(gameNumber, 10);
    }
    totalPower += getPower(line, colorMax)
}

function printResults() {
  console.log(`Total sum of game numbers: ${totalSum}`);
  console.log(`Total power of the games: ${totalPower}`);
}

// helper functions
function findGameNumber(str) {
  const match = str.match(/\d+/);
  return match ? match[0] : null;
}

function createPattern(word) {
  return new RegExp(`\\b(\\d+)\\s+${word}\\b`, 'g');
}

function isValidLine(line, colorMax){
  for (const color in colorMax) {
    const pattern = createPattern(color);
    let match
    while ( (match = pattern.exec(line)) !== null) {
      if (parseInt(match[1],10) > colorMax[color]) {
        // console.log(`color is ${color} and number is ${match[1]}`)
        return false
      }
    }
  }
   return true   
}

function getPower(line, colorMax) {

  let power = 1
 
  for (const color in colorMax) {
    const pattern = createPattern(color);
    let match
    let thisColorMax = 0
    
    // in the while call we reassign the match variable to the next match
    while ((match = pattern.exec(line)) !== null) {
      thisColorMax = Math.max(parseInt(match[1],10), thisColorMax)    
    }  
    power *= thisColorMax
  }
  return power
}

