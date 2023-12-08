const fs = require('fs');
const readline = require('readline');
const { pullNumbers } = require('./utils');
// Replace 'your-file.txt' with the path to your input file
const filePath = 'input';

const readStream = fs.createReadStream(filePath);
const rl = readline.createInterface({
  input: readStream,
  crlfDelay: Infinity,
});

rl.on('line', processLine);
rl.on('close', processResults);

let firstLine = true;
let input = [];
let map = {};


function processLine(line){
  if (firstLine) {
    firstLine = false;
    input = line.replace(/L/g, '0').replace(/R/g, '1').split('');
    input = input.map(n => parseInt(n, 10))
    return;  
  }

  const regex = /[0-9A-Z]{3}/g;
  const x = line.match(regex);
  
  if (x){
    map[x[0]] = [x[1], x[2]];
  }
}

function processResults(){
  countSteps(['AAA']);
  const startKeys = getStartKeys(map)
  console.log(input.length)
  countSteps2(startKeys);
}

function countSteps(startKeys){
  let arrived = false;
  let steps = 0
  let keys = startKeys
  
  while (! arrived){
    // console.log("restarting input loop")
    for (direction of input){
      steps += 1 
      //console.log(keys)
      for (let i = 0; i < keys.length; i++){
        
        keys[i] = map[keys[i]][direction]
      }
      
     if (keys.length == 1 && keys[0] == 'ZZZ'){
        console.log("completed in " + steps + " steps")
        arrived = true;
        break
      } else if (keys.length > 1 && keysEndInZ(keys)){
        console.log("completed in " + steps + " steps")
        arrived = true;
        break
      } 
      
  }  
}
}


function countSteps2(startKeys){
    let arrived = false;
    let steps = 0
    let visit_n = 0
    let keys = startKeys
    let visited = keys.map(_ => [0])
    while (! arrived){
      j = 0
      
      for (direction of input){
        steps += 1 
        j += 1
        
        for (let i = 0; i < keys.length; i++){

          keys[i] = map[keys[i]][direction]

          if (visited[i].length==1 && keyEndsInZ(keys[i])){
            visited[i] = [steps, j]
            visit_n += 1
          }
        
        }

        if (visit_n == keys.length){
          console.log(visited)
          const largeNumber = BigInt(visited.reduce((a,b) => a*b[0], 1)  / (271 ** 5 ))
          // 271 is the number of keys but more importantly a common factor of all the numbers.
          console.log("N steps is " + largeNumber.toString() )
          return 
        }
      } 

    }  
  }
  

function getStartKeys(map){
  let startKeys = [];
  const keys = Object.keys(map);
  for (let key of keys){
    if (key[key.length - 1] == 'A'){
      startKeys.push(key)
    }
  }
  return startKeys
}

function keyEndsInZ(key){
  return key[key.length - 1] == 'Z'
} 

function keysEndInZ(keys){
  for (key of keys){
    if (key[key.length - 1] != 'Z'){
      return false
    }
  }  
  return true
}

