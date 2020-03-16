import $ from './../../utils/Tool'
import { userModel, roomModel } from './../../model/index'
import { handleWatch } from './watcher'
import { ROOM_STATE } from '../../model/room'
import router from '../../utils/router'

Page({
  data: {
    users: [],
    roomInfo: {},
    wordList: [],
    listIndex: 0,
    left: {},
    right: {},
    tipNumber: 0,
    nextRoomId: ''
  },

  onLoad(options) {
    const { roomId } = options
    this.init(roomId)
  },
  async init(roomId) {
    $.loading('获取房间信息...')
    /**
     * 1. 获取用户的openid
     */
    const openid = $.store.get('openid')
    if (!openid) {
      await userModel.getOwnInfo()
      return this.init(roomId) // 递归调用(因为没有用户信息， 用户可能是通过回话直接进入到对战页面)
    }

    /**
     * 2. 创建监听，用创建监听获取的服务端数据初始化房间数据
     */
    this.messageListener = await roomModel.model.doc(roomId).watch({
      onChange: handleWatch.bind(this),
      onError: e => {

      }
    })
  },
  onShow() {

  },
  onHide() {

  },
  async onUnload() {
    const { data: { roomInfo: { state = '', roomId = '', isHouseOwner } } } = this
    if (state === ROOM_STATE.IS_READY && !isHouseOwner) { await roomModel.userCancelReady(roomId) } // 用户已经准备则取消准备
    this.messageListener && this.messageListener.close()
  },
  onShareAppMessage({ from }) {
    const { data: { roomInfo: { isHouseOwner, state, roomId, bookName } } } = this
    if (from === 'button' && isHouseOwner && state === ROOM_STATE.IS_OK) {
      return {
        title: `❤ @你, 来一起pk[${bookName}]吖，点我进入`,
        path: `/pages/combat/combat?roomId=${roomId}`,
        imageUrl: './../../images/share-pk-bg.png'
      }
    }
    if (from === 'button' && state === ROOM_STATE.IS_FINISH && !this._shared) {
      userModel.changeTipNumber(1)
      this._shared = true
    }
    return {
      title: `❤ 来一起学习吧，轻松掌握【四六级/考研】必考单词 ~ 👏👏`,
      path: `/pages/home/home`,
      imageUrl: './../../images/share-default-bg.png'
    }
  },
  onBack() { router.toHome() },
  /**
   * 对战开始的时候初始化tipNumber数目
   */
  initTipNumber() {
    const { data: { roomInfo: { isHouseOwner }, users } } = this
    const index = isHouseOwner ? 0 : 1
    if (typeof users[index] !== 'undefined') {
      this.setData({ tipNumber: users[index].tipNumber })
    } else {
      this.setData({ tipNumber: 0 })
    }
  },
  useTip() {
    const { data: { tipNumber } } = this
    this.setData({ tipNumber: tipNumber - 1 })
  }
})
