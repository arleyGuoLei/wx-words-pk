import { getADstate } from './utils/setting'

App({
  initUiGlobal() {
    wx.getSystemInfo({
      success: e => {
        const { statusBarHeight: StatusBar, screenHeight, windowWidth } = e
        this.store.StatusBar = StatusBar
        this.store.screenHeight = screenHeight
        this.store.windowWidth = windowWidth
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
    const env = envVersion === 'develop' ? 'dev-lkupx' : 'prod-words-pk' // 'prod-words-pk' // ['develop', 'trial', 'release']
    wx.cloud.init({
      env,
      traceUser: true
    })
    this.store.env = env
  },
  initADState() { this.store.adState = getADstate() },
  onLaunch() {
    this.initEnv()
    this.initUiGlobal()
    this.initADState()
  },
  store: {
    StatusBar: null,
    Custom: null,
    CustomBar: null,
    screenHeight: null,
    windowWidth: null,
    env: ''
  }
})
