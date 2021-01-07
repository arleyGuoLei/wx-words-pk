import $ from './Tool'
import log from './log'

export function throttle(fn, gapTime = 500) {
  let _lastTime = null
  return function() {
    const _nowTime = +new Date()
    if (_nowTime - _lastTime > gapTime || !_lastTime) {
      fn.apply(this, arguments)
      _lastTime = _nowTime
    }
  }
}

/**
 * 把数组分割成长度为size的数组
 * @param {Array} arr 数组
 * @param {Number} size 每一个数组的长度
 */
function chunk(arr, size) {
  const arr2 = []
  for (let i = 0; i < arr.length; i = i + size) {
    arr2.push(arr.slice(i, i + size))
  }
  return arr2
}

/**
 * 随机单词列表转成符合对战选词的列表
 * @param {Array} list 随机单词列表
 * @param {Number} len 每一个题目有多少个选项
 */
export const formatList = (list, len) => {
  const lists = chunk(list, len)
  return lists.map(option => {
    const obj = { options: [] }
    const randomIndex = Math.floor(Math.random() * len)
    option.forEach((word, index) => {
      if (index === randomIndex) {
        obj['correctIndex'] = randomIndex
        obj['word'] = word.word
        obj['wordId'] = word._id
        obj['usphone'] = word.usphone
      }
      const { pos, tranCn } = word.trans.sort(() => Math.random() - 0.5)[0]
      let trans = tranCn
      if (pos) {
        trans = `${pos}.${tranCn}`
      }
      obj.options.push(trans)
    })
    return obj
  })
}

export function sleep(time = 2000) {
  return new Promise((resolve) => { setTimeout(() => { resolve() }, time) })
}

export function playAudio(src) {
  const innerAudioContext = wx.createInnerAudioContext()
  innerAudioContext.autoplay = true
  innerAudioContext.src = src
  innerAudioContext.onError((res) => {
    console.log(res.errMsg)
    console.log(res.errCode)
  })
}

export function playPronunciation(word) {
  const src = `https://dict.youdao.com/dictvoice?audio=${word}`
  playAudio(src)
}

export function px2Rpx(px) {
  const windowWidth = $.store.get('windowWidth') // windowWidth * x = 750
  return Math.round((750 / windowWidth) * px)
}

export function rpx2Px(rpx) {
  const windowWidth = $.store.get('windowWidth')
  return Math.round((rpx / 750) * windowWidth)
}

export function dateFormat(fmt = 'YYYY-mm-dd HH:MM:SS', date = new Date()) {
  let ret
  const opt = {
    'Y+': date.getFullYear().toString(), // 年
    'm+': (date.getMonth() + 1).toString(), // 月
    'd+': date.getDate().toString(), // 日
    'H+': date.getHours().toString(), // 时
    'M+': date.getMinutes().toString(), // 分
    'S+': date.getSeconds().toString() // 秒
  }
  for (const k in opt) {
    ret = new RegExp('(' + k + ')').exec(fmt)
    if (ret) {
      fmt = fmt.replace(ret[1], (ret[1].length === 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, '0')))
    }
  }
  return fmt
}

/**
 * 获取一个月有多少天
 */
export function getMonthDays(year = new Date().getFullYear(), month = new Date().getMonth() + 1) {
  const day = new Date(year, month, 0)
  return day.getDate()
}

export function previewAdmire() {
  wx.previewImage({
    urls: ['https://7072-prod-words-pk-1255907426.tcb.qcloud.la/admire.jpg']
  })
}
