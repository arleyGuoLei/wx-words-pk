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
  loading(loadingText = '斗斗加载中···', mask = true) {
    const loading = getLoaingObj()
    loading.show(loadingText, mask)
  },
  hideLoading() {
    const loading = getLoaingObj()
    loading.hide()
  },
  callCloud(name, data = {}) {
    return wx.cloud.callFunction({
      name,
      data
    })
  }
}
