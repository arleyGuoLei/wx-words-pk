const pages = {
  home: '/pages/home/home',
  combat: '/pages/combat/combat',
  wordChallenge: '/pages/wordChallenge/wordChallenge',
  userWords: '/pages/userWords/userWords',
  ranking: '/pages/ranking/ranking',
  setting: '/pages/setting/setting',
  sign: '/pages/sign/sign',
  activity: '/pages/activity/activity'
}

function to(page, data) {
  if (!pages[page]) { throw new Error(`${page} is not exist!`) }
  const _result = []
  for (const key in data) {
    const value = data[key]
    if (['', undefined, null].includes(value)) {
      continue
    }
    if (value.constructor === Array) {
      value.forEach(_value => {
        _result.push(encodeURIComponent(key) + '[]=' + encodeURIComponent(_value))
      })
    } else {
      _result.push(encodeURIComponent(key) + '=' + encodeURIComponent(value))
    }
  }
  const url = pages[page] + (_result.length ? `?${_result.join('&')}` : '')
  return url
}

class Router {
  push(page, param = {}, events = {}, callback = () => {}) {
    wx.navigateTo({
      url: to(page, param),
      events,
      success: callback
    })
  }

  pop(delta) {
    wx.navigateBack({ delta })
  }

  redirectTo(page, param) {
    wx.redirectTo({ url: to(page, param) })
  }

  reLaunch() {
    wx.reLaunch({ url: pages.home })
  }

  toHome() {
    if (getCurrentPages().length > 1) { this.pop() } else { this.reLaunch() }
  }
}

export default new Router()
