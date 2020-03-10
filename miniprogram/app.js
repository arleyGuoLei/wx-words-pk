App({
  initUiGlobal() {
    wx.getSystemInfo({
      success: e => {
        const { statusBarHeight: StatusBar, screenHeight } = e
        this.store.StatusBar = StatusBar
        this.store.screenHeight = screenHeight
        const capsule = wx.getMenuButtonBoundingClientRect()
        if (capsule) {
          this.store.Custom = capsule
          this.store.CustomBar = capsule.bottom + capsule.top - e.statusBarHeight
        } else {
          this.store.CustomBar = StatusBar + 50
        }
      }
    })
  },
  initEnv() {
    const envVersion = __wxConfig.envVersion
    const env = envVersion === 'develop' ? 'dev-lkupx' : 'dev-lkupx' // 'prod-words-pk' // ['develop', 'trial', 'release']
    wx.cloud.init({
      env,
      traceUser: true
    })
    this.store.env = env
  },
  onLaunch() {
    this.initEnv()
    this.initUiGlobal()
  },
  store: {
    StatusBar: null,
    Custom: null,
    CustomBar: null,
    screenHeight: null,
    env: ''
  }
})
