import { roomModel, userModel } from '../../../../model/index'
import { throttle } from '../../../../utils/util'
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

  },
  methods: {
    onStartPk() {},
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
