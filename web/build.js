const fs = require('fs-extra')
const childProcess = require('child_process')

try {
  fs.removeSync('./dist/')
  const proc = childProcess.exec('tsc --build tsconfig.prod.json')
  proc.stdout.on('data', function(data) {
    console.log(data.toString()); 
  });
  proc.on('close', (code) => {
    if (code !== 0) {
      throw Error('Build failed')
    }
  })
} catch (err) {
  console.log(err)
}
