const fs = require("fs");
const readline = require("readline");
const filePath = "input2";
const { pullNumbers } = require("./utils");

const readStream = fs.createReadStream(filePath);
const rl = readline.createInterface({
  input: readStream,
  crlfDelay: Infinity,
});

rl.on("line", processLine);
rl.on("close", processResults);

let hands = [];
let hands2 = [];
let totalPoints = 0;
let totalPoints2 = 0;

let nHands = 0;

function processLine(line) {
  nHands += 1;
  const bid = pullNumbers(line).reverse()[0];
  const { majorOrder, minorOrders } = getHandType(line);
  const { majorOrder2, minorOrders2 } = getHandType2(line);
  hands.push([bid, majorOrder, minorOrders]);
  hands2.push([bid, majorOrder2, minorOrders2]);
}

function processResults() {
  const sortedHands = hands.sort(compareHands);
  for (i = 0; i < sortedHands.length; i++) {
    //console.log(sortedHands[i]);
    //console.log(`multiply by ${nHands - i}`)
    totalPoints += sortedHands[i][0] * (nHands - i);
  }

  const sortedHands2 = hands2.sort(compareHands);
  for (i = 0; i < sortedHands2.length; i++) {
    console.log(sortedHands2[i]);
    //console.log(`multiply by ${nHands - i}`)
    totalPoints2 += sortedHands2[i][0] * (nHands - i);
  }
  printResults();
}

function getHandType(line) {
  let hand = line.split(" ")[0].split("");

  const majorOrder = getMajorOrder(hand);
  const minorOrders = hand.map((n) =>
    parseInt(
      n
        .replace("A", 14)
        .replace("K", 13)
        .replace("Q", 12)
        .replace("J", 11)
        .replace("T", 10),
      10,
    ),
  );
  return { majorOrder, minorOrders };
}

function getHandType2(line) {
  let hand = line.split(" ")[0].split("");

  const majorOrder2 = getMajorOrder2(hand);
  const minorOrders2 = hand.map((n) =>
    parseInt(
      n
        .replace("A", 14)
        .replace("K", 13)
        .replace("Q", 12)
        .replace("J", 1)
        .replace("T", 10),
      10,
    ),
  );
  return { majorOrder2, minorOrders2 };
}

function getMajorOrder(hand) {
  let counter = {};

  for (card of hand) {
    counter[card] = (counter[card] || 0) + 1;
  }

  const counts = Object.keys(counter).map((key) => counter[key]);
  const max = Math.max(...counts);
  const majorOrder =
    max == 3 && counts.length == 2
      ? 3.5
      : max == 2 && counts.length == 3
        ? 2.5
        : max;

  return majorOrder;
}

function getMajorOrder2(hand) {
  let counter = {};

  for (card of hand) {
    counter[card] = (counter[card] || 0) + 1;
  }

  const nJacks = counter["J"] || 0;
  const counts = Object.keys(counter).map((key) =>
    key == "J" ? 0 : counter[key],
  );

  const max = Math.max(...counts) + nJacks;
  const majorOrder =
    max == 3 &&
    ((nJacks == 0 && counts.length == 2) || (nJacks > 0 && counts.length == 3))
      ? 3.5
      : max == 2 && counts.length == 3
        ? 2.5
        : max;

  return majorOrder;
}

// Define a function to compare rows based on specific positions
function compareHands(a, b) {
  // Compare by age (position 2)
  const majorOrder = b[1] - a[1];

  // If ages are equal, compare by name (position 1)
  if (majorOrder === 0) {
    for (i = 0; i < 5; i++) {
      minorOrder = b[2][i] - a[2][i];
      if (minorOrder != 0) {
        return minorOrder;
      }
    }
  }
  return majorOrder;
}

function printResults() {
  console.log(`Total points: ${totalPoints}`);
  console.log(`Total points2: ${totalPoints2}`);
  //console.log(`Total sum of histories: ${sumHistoric}`);
}
