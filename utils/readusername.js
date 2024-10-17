const fs = require('fs');

function readUsernames() {
  const data = fs.readFileSync('./data/user.json');
  return JSON.parse(data);
}

module.exports = readUsernames;