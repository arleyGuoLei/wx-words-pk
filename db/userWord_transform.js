const fs = require('fs')
const path = require('path')

const file2Jsons = (p) => {
  const p1 = new Promise(resolve => {
    fs.readFile(p, 'utf-8', function(error, data) {
      if (error) return console.log('读取文件失败,内容是' + error.message)
      resolve(data.split('\n'))
    })
  })
  return p1
}

const writeFile = (content) => {
  const res = content.join('\r\n')
  const file = `./pk_userWord.json`
  fs.writeFile(path.resolve(__dirname, file), res, function(error) {
    if (error) {
      console.log('写入失败')
    } else {
      console.log(`写入${file}`)
    }
  })
}

const userDbPath = path.resolve(__dirname, './old/userWord.json')

async function Start() {
  const content = await file2Jsons(userDbPath)
  const lines = content.map(line => {
    if (line) {
      const obj = JSON.parse(line)
      delete obj.uid
      return JSON.stringify(obj)
    }
  })
  writeFile(lines)
}

Start()
