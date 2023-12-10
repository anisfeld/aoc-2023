onst fs = require('fs');
const readline = require('readline');
const filePath = 'input2';

const readStream = fs.createReadStream(filePath);
const rl = readline.createInterface({
  input: readStream,
  crlfDelay: Infinity,
});

rl.on('line', processLine);
rl.on('close', processResults);

let sumPredictions = 0;
let sumHistoric = 0;

function processLine(line) {
  const { historic, predictions } = getNextEstimate(line);
  sumHistoric += historic;
  sumPredictions += predictions;
}

function processResults(){
  printResults()
}

function getNextEstimate(line){
  let seq = pullIntegers(line);
  let stack = { 0: seq };
  let j = 0;
  
  while (true) {
      seq = stack[j];
      let nextSeq = [];

      for (let i = 0; i < seq.length - 1; i++) {
        nextSeq[i] = seq[i + 1] - seq[i];
      }

      if (nextSeq.every(n => n === 0)) {
        const future = Object.entries(stack).reduce((acc, [_, value]) => {
          acc += value[value.length - 1];
          return acc;
        }, 0);

        let history = 0;
        for (let k = j; k >= 0; k--) {
          history = stack[k][0] - history;
        }

        return { historic: history, predictions: future };
      }

      j += 1;
      stack[j] = nextSeq;
    }
  }

function printResults() {
   console.log(`Total sum of predictions: ${sumPredictions}`);
   console.log(`Total sum of histories: ${sumHistoric}`); 
}

function pullIntegers(line) {
  const regex = /-\d+|\d+/g;
  const matchResult = line.match(regex);
  return matchResult ? matchResult.map(n => parseInt(n, 10)) : [];
}

