import { userModel } from './../../../../model/index'
import { throttle } from './../../../../utils/util'
import router from '../../../../utils/router'
Component({
  options: {
    addGlobalClass: true
  },
  methods: {
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
    onChallengeWord: throttle(async function() {
      router.push('wordChallenge')
    }, 1000),
    onToUserWords: throttle(function() {
      router.push('userWords')
    }, 1000)
  }
})
