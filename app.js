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
  let fileExist = fs.existsSync('/tmp/' + logoid + '.png')
  if (!fileExist) {
    let output = execSync('npx jslogo -f examples/' + logoid + '.lgo -o /tmp/' + logoid);
    //let bufferstring = output.toString()
  }
  res.sendFile('/tmp/' + logoid + '.png')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})