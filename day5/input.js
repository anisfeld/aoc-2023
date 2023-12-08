const fs = require('fs');
const readline = require('readline');
const { pullNumbers } = require('./utils');
// Replace 'your-file.txt' with the path to your input file
const filePath = 'input2';

const readStream = fs.createReadStream(filePath);
const rl = readline.createInterface({
  input: readStream,
  crlfDelay: Infinity,
});


rl.on('line', processLine);
rl.on('close', processResults);

let lineNumber = 0;
let input = {};


function processLine(line){
  lineNumber += 1
  input[lineNumber] = pullNumbers(line);
  console.log(input)
}

function processResults(){
  const eps = 1e-8
  let result = 1;
  for (let i = 0; i < input[1].length; i++){
    console.log(i)
    maxTime = input[1][i]
    distanceRecord = input[2][i]
    zeros = getZeros(-1, maxTime, -distanceRecord)
    console.log(zeros)
    
    result *= Math.floor(zeros[1] - eps) - Math.ceil(zeros[0] + eps) + 1
    
  }
  console.log(`The result for part 1 is ${result}`)

  maxTime = listToNumber(input[1])
  distanceRecord = listToNumber(input[2])
  
  zeros = getZeros(-1, maxTime, -distanceRecord) 
  console.log(Math.floor(zeros[1] - eps) - Math.ceil(zeros[0] + eps) + 1)
  
}


function getZeros(a, b, c){
  det = Math.sqrt(b*b - 4*a*c)
  return [(b - det) / (-2*a), (b + det) / (-2*a)]
}

function  listToNumber(array){
  return parseInt(array.toString().replaceAll(",",""), 10)
}

