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
  const file = `./pk_user.json`
  fs.writeFile(path.resolve(__dirname, file), res, function(error) {
    if (error) {
      console.log('写入失败')
    } else {
      console.log(`写入${file}`)
    }
  })
}

const userDbPath = path.resolve(__dirname, './old/user.json')

async function Start() {
  const content = await file2Jsons(userDbPath)
  const lines = content.map(line => {
    if (line) {
      const obj = JSON.parse(line)
      const newObj = {
        _id: obj._id,
        _openid: obj.uid,
        avatarUrl: obj.avatarUrl,
        bookDesc: '随机',
        bookId: 'random',
        bookName: '随机所有词汇',
        city: '',
        country: '',
        createTime: Date.now(),
        gender: 0,
        grade: 500 + obj.grade,
        infinityGrade: obj.infinityGrade + 100,
        nickName: obj.nickName,
        province: '',
        pvpNumber: obj.pvpNumber,
        tipNumber: obj.tipNumber + 20,
        winNumber: obj.winNumber
      }
      return JSON.stringify(newObj)
    }
  })
  writeFile(lines)
}

Start()
