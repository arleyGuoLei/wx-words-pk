import { userModel, roomModel } from '../../../../model/index'
import $ from './../../../../utils/Tool'
import { ROOM_STATE } from '../../../../model/room'
import { throttle } from '../../../../utils/util'

Component({
  options: {
    addGlobalClass: true
  },
  properties: {
    roomState: {
      type: String
    },
    roomId: {
      type: String
    }
  },
  data: {

  },
  lifetimes: {
    attached() {
      this.callNpcTimer = setTimeout(() => {
        const { properties: { roomState } } = this
        if (roomState === ROOM_STATE.IS_OK) {
          this.onStartNPC()
        }
      }, 110 * 1000) // 110s => 1分50s如果还没有匹配到就开始NPC对局
    },
    detached() {
      this.callNpcTimer && clearTimeout(this.callNpcTimer)
    }
  },
  methods: {
    onStartNPC: throttle(async function() {
      $.loading('call npc...')
      const { _openid: openid } = (await userModel.getNPCUser()).list[0]
      const { properties: { roomId } } = this
      await roomModel.userReady(roomId, true, openid)
      $.hideLoading()
    }, 1000)
  }
})
