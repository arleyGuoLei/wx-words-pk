import $ from './../../utils/Tool'
import { userModel, roomModel } from './../../model/index'
import { handleWatch } from './watcher'
import { ROOM_STATE } from '../../model/room'
import router from '../../utils/router'
import log from './../../utils/log'
import { getBgmState, setBgmState } from '../../utils/setting'
const BGM_URL = 'http://img02.tuke88.com/newpreview_music/09/01/72/5c8a08dc4956424741.mp3'

Page({
  data: {
    adState: $.store.get('adState'),
    users: [],
    roomInfo: {},
    wordList: [],
    listIndex: 0,
    left: {},
    right: {},
    tipNumber: 0,
    nextRoomId: '',
    bgmState: null,
    activityIds: []
  },

  onLoad(options) {
    const { roomId } = options
    this.init(roomId)
    this.initBgm()
  },
  onReady() {
    this.initAD()
  },
  initAD() {
    if (this.data.adState) {
      this.interstitialAd = wx.createInterstitialAd({
        adUnitId: 'adunit-4d5707122f350cf3'
      })
      this.interstitialAd.onLoad(() => {})
      this.interstitialAd.onError((err) => {
        console.log(err)
        this.AD_SHOWED = true
      })
      this.interstitialAd.onClose(() => {})
    }
  },
  showAD() {
    setTimeout(() => {
      if (this.data.adState && this.interstitialAd && !this.AD_SHOWED) {
        this.interstitialAd.show().then(() => {
          this.AD_SHOWED = true
        }).catch((err) => {
          console.error(err)
        })
      }
    }, 800)
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
        log.error(e)
        this.selectComponent('#errorMessage').show('服务器连接异常...', 2000, () => { router.reLaunch() })
      }
    })
  },
  onShow() {
    const { data: { roomInfo: { state = '' }, bgmState } } = this
    if (state === ROOM_STATE.IS_PK && bgmState) {
      this.bgm.play()
    }
  },
  onHide() {

  },
  async onUnload() {
    this.messageListener && this.messageListener.close()
    const { data: { roomInfo: { state = '', roomId = '', isHouseOwner, isFriend } } } = this
    if (state === ROOM_STATE.IS_READY && !isHouseOwner && isFriend) { await roomModel.userCancelReady(roomId) } // 用户已经准备则取消准备
    if (state === ROOM_STATE.IS_READY && isHouseOwner && isFriend) { await roomModel.remove(roomId, 'READY') } // 是房主，用户已经准备，房主离开了
    if (state === ROOM_STATE.IS_PK) { roomModel.leave(roomId) }
    if (isHouseOwner && state === ROOM_STATE.IS_OK) { await roomModel.remove(roomId) } // 房主创建好房，还没开始对战的时候离开, 删除没有意义的房间
    this.bgm && this.bgm.destroy()
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
      userModel.changeTipNumber(5)
      this._shared = true
    }
    return {
      title: `❤ 来一起学习吧，轻松掌握【四六级/考研】必考单词 ~ 👏👏`,
      path: `/pages/home/home`,
      imageUrl: './../../images/share-default-bg.png'
    }
  },
  onBack() { router.toHome() },
  initBgm() {
    this.bgm = wx.createInnerAudioContext()
    this.bgm.loop = true
    this.bgm.autoplay = false
    this.bgm.src = BGM_URL
  },
  onBgmChange(e) {
    const { action = 'start' } = e.currentTarget.dataset
    if (action === 'start') {
      this.bgm.play()
      this.setData({ bgmState: true })
      setBgmState(true)
    } else if (action === 'pause') {
      this.bgm.pause()
      this.setData({ bgmState: false })
      setBgmState(false)
    }
  },
  playBgm() {
    const state = getBgmState()
    if (state) { this.bgm && this.bgm.play() }
    this.setData({ bgmState: state })
  },
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
