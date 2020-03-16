import $ from './Tool'

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
