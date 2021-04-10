import { userModel } from './../../../../model/index'
import { sleep, throttle } from './../../../../utils/util'
import router from '../../../../utils/router'
import { DEFAULT_USER_INFO } from '../../../../utils/setting'
Component({
  options: {
    addGlobalClass: true
  },
  data: {
    canIUseGetUserProfile: false,
    userInfo: null
  },
  lifetimes: {
    attached() {
      if (wx.getUserProfile) {
        this.setData({
          canIUseGetUserProfile: true
        })
      }
    }
  },
  methods: {
    getUserProfile: throttle(async function(event) {
      const { callback } = event.currentTarget.dataset
      if (!callback || !this[callback]) {
        return
      }

      // 使用缓存的用户信息
      if (this.data.userInfo) {
        this[callback]({ detail: { userInfo: this.data.userInfo } })
        return
      }

      const desc = '将用于对战信息显示'
      let userInfo = DEFAULT_USER_INFO // 默认信息
      try {
        const { userInfo: info } = await new Promise((resolve, reject) => {
          wx.getUserProfile({
            desc,
            success: resolve,
            fail: reject
          })
        })
        userInfo = info
        // 缓存用户信息
        this.setData({ userInfo })
      } catch (error) {
        const duration = 1200
        wx.showToast({
          title: '获取用户信息失败, 将使用匿名信息',
          icon: 'none',
          duration
        })
        await sleep(duration)
      }
      this[callback]({ detail: { userInfo } })
    }, 1000),
    onChallengeFriend: throttle(async function(e) {
      const { detail: { userInfo } } = e
      if (userInfo) {
        await userModel.updateInfo(userInfo) // 更新用户信息
        this.triggerEvent('onChallengeFriend')
      } else {
        this.selectComponent('#authFailMessage').show()
      }
    }, 1000),
    onRandomMatch: throttle(async function(e) {
      const { detail: { userInfo } } = e
      if (userInfo) {
        await userModel.updateInfo(userInfo) // 更新用户信息
        this.triggerEvent('onRandomMatch')
      } else {
        this.selectComponent('#authFailMessage').show()
      }
    }, 1000),
    onChallengeWord: throttle(async function(e) {
      const { detail: { userInfo } } = e
      if (userInfo) {
        await userModel.updateInfo(userInfo) // 更新用户信息
      }
      router.push('wordChallenge')
    }, 1000),
    onToUserWords: throttle(function() {
      router.push('userWords')
    }, 1000)
  }
})
