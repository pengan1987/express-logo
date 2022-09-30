const express = require('express')
const app = express()
const port = 3000
const { execSync } = require('child_process');
const fs = require('fs')

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/logo/:logoid', (req, res) => {
  let logoid = req.params['logoid']
  let fileExist = fs.existsSync('out/' + logoid + '.png')
  if (!fileExist) {
    let output = execSync('npx jslogo -f examples/' + logoid + '.lgo -o out/' + logoid);
    //let bufferstring = output.toString()
  }
  res.sendFile('out/' + logoid + '.png', { root: __dirname })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})