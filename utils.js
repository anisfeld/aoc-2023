module.exports = {
  
pullNumbers: function(line) {
  const regex = /\d+/g;
  const matchResult = line.match(regex);
  if (matchResult) {
    return matchResult.map(n => parseInt(n, 10));
  } else {
    // Handle the case where no match is found, for example:
    // console.log('No numbers found in the line');
    return [];
  }
}

};
