
const fs = require('fs')
const path = require('path')

const file2Jsons = (p) => {
  const p1 = new Promise(resolve => {
    fs.readFile(p, 'utf-8', function(error, data) {
      if (error) return console.log('读取文件失败,内容是' + error.message)
      resolve(data.split('\r\n'))
    })
  })
  return p1
}

const kaoYan = {
  paths: [path.resolve(__dirname, './data/考研必备/KaoYanluan_1.json')],
  bookName: 'kaoYan'
}
const CET4 = {
  paths: [path.resolve(__dirname, './data/四级真题核心词（图片记忆）/CET4luan_1.json')],
  bookName: 'CET4'
}
const CET6 = {
  paths: [path.resolve(__dirname, './data/六级真题核心词（图片记忆）/CET6luan_1.json')],
  bookName: 'CET6'
}
const chuZhong = {
  paths: [path.resolve(__dirname, './data/中考必备词汇/ChuZhongluan_2.json')],
  bookName: 'middle'
}
const gaoZhong = {
  paths: [path.resolve(__dirname, './data/高考必备词汇（图片记忆）/GaoZhongluan_2.json')],
  bookName: 'high'
}
const xiaoXue = {
  paths: [
    path.resolve(__dirname, './data/人教版小学英语-三年级上册/PEPXiaoXue3_1.json'),
    path.resolve(__dirname, './data/人教版小学英语-三年级下册/PEPXiaoXue3_2.json'),
    path.resolve(__dirname, './data/人教版小学英语-四年级上册/PEPXiaoXue4_1.json'),
    path.resolve(__dirname, './data/人教版小学英语-四年级下册/PEPXiaoXue4_2.json'),
    path.resolve(__dirname, './data/人教版小学英语-五年级上册/PEPXiaoXue5_1.json'),
    path.resolve(__dirname, './data/人教版小学英语-五年级下册/PEPXiaoXue5_2.json')
  ],
  bookName: 'primary'
}

const kaoYanFull = {
  paths: [path.resolve(__dirname, './data/KaoYan_2.json')],
  bookName: 'kaoYanFull'
}

const CET4Full = {
  paths: [path.resolve(__dirname, './data/CET4luan_2.json')],
  bookName: 'CET4Full'
}

const CET6Full = {
  paths: [path.resolve(__dirname, './data/CET6_2.json')],
  bookName: 'CET6Full'
}

const IELTS = {
  paths: [path.resolve(__dirname, './data/雅思词汇.json')],
  bookName: 'IELTS'
}

const BEC = {
  paths: [path.resolve(__dirname, './data/商务英语.json')],
  bookName: 'BEC'
}

async function Start(book) {
  let lines = []
  for (const p of book.paths) {
    const content = await file2Jsons(p)
    lines = lines.concat(content)
  }
  writeFile(lines, book)
}

const writeFile = (lines, { bookName }) => {
  const content = lines.map((line, index) => {
    try {
      if (line) {
        const obj = JSON.parse(line)
        const word = {
          rank: index + 1,
          word: obj.headWord,
          bookId: bookName,
          _id: `${bookName}_${index + 1}`,
          usphone: obj.content.word.content.usphone,
          trans: obj.content.word.content.trans.map(tran => {
            return {
              tranCn: tran.tranCn,
              pos: tran.pos
            }
          })
        }
        return JSON.stringify(word)
      }
    } catch (error) {
      console.error('log => : writeFile -> error', error)
    }
  })
  const res = content.join('\r\n')
  const file = `./db/${bookName}_${Date.now()}.json`
  fs.writeFile(path.resolve(__dirname, file), res, function(error) {
    if (error) {
      console.log('写入失败')
    } else {
      console.log(`写入${file}`)
    }
  })
}

Start(kaoYan)
Start(CET4)
Start(CET6)
Start(chuZhong)
Start(gaoZhong)
Start(xiaoXue)
Start(kaoYanFull)
Start(CET4Full)
Start(CET6Full)
Start(IELTS)
Start(BEC)
