function getLoaingObj() {
  const page = getCurrentPages()
  return page[page.length - 1].selectComponent('#loading')
}

export default {
  get store() {
    const store = getApp().store
    return {
      set: (key, value = '') => {
        if (key) {
          store[key] = value
        }
      },
      get: (key) => {
        return store[key]
      }
    }
  },
  get storage() {
    return {
      set: (key, value = '') => {
        if (key) {
          return wx.setStorageSync(key, value)
        }
      },
      get: (key) => {
        return wx.getStorageSync(key)
      }
    }
  },
  loading(loadingText = '斗斗加载中···', mask = true) {
    const loading = getLoaingObj()
    if (loading) {
      loading.show(loadingText, mask)
    }
  },
  hideLoading() {
    const loading = getLoaingObj()
    if (loading) {
      loading.hide()
    }
  },
  callCloud(name, data = {}) {
    return wx.cloud.callFunction({
      name,
      data
    })
  }
}
