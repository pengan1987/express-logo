const express = require('express')
const app = express()
const port = 9000
const { execSync } = require('child_process');
const fs = require('fs')

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/logo/:logoid', (req, res) => {
  let logoid = req.params['logoid']
  let outputPath = '/tmp/' + logoid + '.jpg'
  let fileExist = fs.existsSync(outputPath)
  let refresh = req.query.refresh;
  if (!fileExist || refresh == 1) {
    try {
      let rotateDirection = Math.floor(Math.random() * 8);
      let directionArray = ["South", "North", "West", "East", "NorthWest", "NorthEast", "SouthWest", "SouthEast"];
      let gradientString = '"' + randomColorGenerator() + '-' + randomColorGenerator() + '"'

      let generateCmd = './generateimg.sh' +
        ' -i ' + logoid +
        ' -o ' + outputPath +
        ' -d ' + directionArray[rotateDirection] +
        ' -g ' + gradientString

      console.log(generateCmd)
      execSync(generateCmd)
    } catch (ex) {
      console.log(ex)
      outputPath = "";
    }
  }
  if (outputPath.length > 0) {
    res.sendFile(outputPath)
  } else {
    res.sendFile('examples/broken-nft.jpg', { root: __dirname })
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

function randomColorGenerator() {
  var characters = ["a", "b", "c", "d", "e", "f", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  var randomColorArray = [];
  for (var i = 0; i < 6; i++) {
    var randomIndex = Math.floor(Math.random() * characters.length);
    randomColorArray.push(characters[randomIndex])
  }
  return `#${randomColorArray.join("")}`;
}

