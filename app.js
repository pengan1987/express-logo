const express = require('express')
const app = express()
const port = 9000
const { execSync } = require('child_process');
const fs = require('fs')
const sizeOf = require('image-size');
const logoStor = 'https://dnbwg2.oss-cn-hongkong.aliyuncs.com/nft/logo-collection/'

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/logo/:logoid', (req, res) => {
  let logoid = req.params['logoid']
  let jpgPath = '/tmp/' + logoid + '.jpg'
  let fileExist = fs.existsSync(jpgPath)
  if (!fileExist) {
    let lgoPath = logoStor + logoid + '.lgo';

    execSync('wget ' + lgoPath + ' -P /tmp/')

    execSync('npx jslogo -f /tmp/' + logoid + '.lgo -o /tmp/' + logoid);
    let pngPath = '/tmp/' + logoid + '.png'

    let dimensions = sizeOf(pngPath);

    let gradientCmd = generateGradientCmd(dimensions.width, dimensions.height)
    execSync(gradientCmd)
    //make white background transprent
    execSync("gm convert -transparent white " + pngPath + " " + pngPath)
    //combine background gradient
    execSync("gm composite " + pngPath + " /tmp/gradient.png " + jpgPath)
  }

  res.sendFile(jpgPath)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

function generateGradientCmd(width, height) {

  let gradientString = randomColorGenerator() + '-' + randomColorGenerator()
  let rotateDirection = Math.floor(Math.random() * 8);
  let directionArray = ["South", "North", "West", "East", "NorthWest", "NorthEast", "SouthWest", "SouthEast"];
  let sizeString = width + "x" + height;
  let gradientCmd = "gm convert -size "
    + sizeString
    + " -define gradient:direction="
    + directionArray[rotateDirection]
    + " gradient:"
    + gradientString
    + " /tmp/gradient.png";
  console.log(gradientCmd)
  return gradientCmd
}

function randomColorGenerator() {
  var characters = ["a", "b", "c", "d", "e", "f", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  var randomColorArray = [];
  for (var i = 0; i < 6; i++) {
    var randomIndex = Math.floor(Math.random() * characters.length);
    randomColorArray.push(characters[randomIndex])
  }
  return `#${randomColorArray.join("")}`;
}

