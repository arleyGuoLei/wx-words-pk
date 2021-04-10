import { roomModel, userModel } from '../../../../model/index'
import { DEFAULT_USER_INFO } from '../../../../utils/setting'
import { sleep, throttle } from '../../../../utils/util'
import $ from './../../../../utils/Tool'

Component({
  options: {
    addGlobalClass: true
  },
  properties: {
    roomState: {
      type: String
    },
    isHouseOwner: {
      type: Boolean
    },
    roomId: {
      type: String
    }
  },
  data: {
    canIUseGetUserProfile: false
  },
  lifetimes: {
    attached() {
      if (wx.getUserProfile) {
        this.setData({ canIUseGetUserProfile: true })
      }
    }
  },
  methods: {
    getUserProfile: throttle(async function(event) {
      const { callback } = event.currentTarget.dataset
      if (!callback || !this[callback]) {
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
    onStartPk: throttle(async function() {
      $.loading('开始对战...')
      const { properties: { roomId } } = this
      const { stats: { updated = 0 } } = await roomModel.startPK(roomId)
      $.hideLoading()
      if (updated !== 1) { this.selectComponent('#errorMessage').show('开始失败...请重试') }
    }, 1500),
    onUserReady: throttle(async function(e) {
      $.loading('正在加入...')
      const { detail: { userInfo } } = e
      if (userInfo) {
        await userModel.updateInfo(userInfo) // 更新用户信息
        const { properties: { roomId } } = this
        const { stats: { updated = 0 } } = await roomModel.userReady(roomId)
        if (updated !== 1) {
          this.selectComponent('#errorMessage').show('加入失败, 可能房间已满!')
        }
        $.hideLoading()
      } else {
        $.hideLoading()
        this.selectComponent('#authFailMessage').show()
      }
    }, 1500),
    /**
     * 手动取消准备(不需要此功能，准备之后不可取消，可以返回首页)
     */
    onExitCombat: throttle(async function() {
      const { properties: { roomId } } = this
      const { stats: { updated = 0 } } = await roomModel.userCancelReady(roomId)
      if (updated !== 1) { this.selectComponent('#errorMessage').show('退出失败, 请重试') }
    }, 1500)
  }
})
