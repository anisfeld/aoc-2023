const fs = require('fs');
const readline = require('readline');

// Replace 'your-file.txt' with the path to your input file
const filePath = 'input';

const readStream = fs.createReadStream(filePath);
const rl = readline.createInterface({
  input: readStream,
  crlfDelay: Infinity,
});

const totems  = new Set(['#','$', '%', '&', '@', '*', '+', '-', '/', '=',])
let numbers = []
let numbers_ = {0: []}
let symbols = {0: []}
let gears = {0: []}
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
  x = pullNumbers(line)
  const ls = line.split("")  
  for (let i = 0; i < ls.length; i++) {
     if (totems.has(ls[i])){
       symbols[rowNumber].push(i)
       if (ls[i] == '*'){
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
  console.log("Welcomed to the row " + rowNumber)
  console.log(`symbols in this row are in ${symbols[rowNumber]}`)
}

function pullNumbers(line){
  const regex = /\d+/g;
  return line.match(regex)
}

function processResults(){
  filterAndAddNumbers();
  findAndProcessGears();
  printResults();
}

function filterAndAddNumbers(){
  // hacky way to avoid checking if we're at the end of the matrix
  // probably better to loop off rowNumbers rather than numbers 
  rowNumber += 1;
  symbols[rowNumber] = []
  for (const n of numbers) {
    for (const i of [n.row - 1, n.row, n.row + 1]){
       for (const x of symbols[i]){
         if (n.low <= x && x <= n.high){
           n.acceptable = true
          }
        }

    }
    if (n.acceptable){
      totalSum += n.value
    }
  }
}

function findAndProcessGears(){
  rowNumber += 1;
  numbers_[rowNumber] = []

  gear_rows = Object.keys(gears)

  
  for (let row of gear_rows){
    row = parseInt(row, 10)
    // look at each gear in a given row
    if (gears[row].length) {
      for (const j of gears[row]){
        console.log(`row is ${row}, and col (j) is ${j}`)
        thisGearsNumbers = []
        for (const i of [row - 1, row, row + 1]){
          console.log(`i is ${i}`)
          if (numbers_[i] && numbers_[i].length) {
    
            theseNumbers = numbers_[i].filter(n => n.low <= j && j <= n.high)
            console.log(theseNumbers)
          
            thisGearsNumbers.push(...theseNumbers.map(n => n.value))
            console.log(thisGearsNumbers)
          }
        }
        if (thisGearsNumbers.length > 1){
          console.log(`Length of thisGearsNumbers is ${thisGearsNumbers.length}`)
          totalGearNumber += thisGearsNumbers[0] * thisGearsNumbers[1]
        }
      }
    }
  }
}

function printResults() {
  console.log(`Total sum of game numbers: ${totalSum}`);
  console.log(`Total gear numbers: ${totalGearNumber}`);
}

