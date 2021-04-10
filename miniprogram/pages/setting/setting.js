import { getCombatSubjectNumber, getBgmState, getPronunciationState,
  getIsAddUserWords, PK_SUBJECTS_NUMBER, setCombatSubjectNumber, setBgmState,
  setPronunciationState, setIsAddUserWords, getIsVibrate, setIsVibrate
} from '../../utils/setting'
import $ from './../../utils/Tool'
import { userWordModel } from '../../model/index'
import router from '../../utils/router'
import { previewAdmire } from '../../utils/util'
Page({
  data: {
    combatSubjectNumber: 0,
    bgmState: '',
    pronunciationState: '',
    isAddUserWords: '',
    isVibrate: ''
  },
  onLoad() {
    this.setData({
      combatSubjectNumber: getCombatSubjectNumber(),
      bgmState: getBgmState() ? '开启' : '关闭',
      pronunciationState: getPronunciationState() ? '开启' : '关闭',
      isAddUserWords: getIsAddUserWords() ? '开启' : '关闭',
      isVibrate: getIsVibrate() ? '开启' : '关闭'
    })
  },
  onCombatSubjectNumber(tapIndex) {
    const value = PK_SUBJECTS_NUMBER[tapIndex]
    setCombatSubjectNumber(value)
    this.setData({ combatSubjectNumber: value })
  },
  onBgmState(tapIndex) {
    const check = tapIndex === 0
    setBgmState(check)
    this.setData({ bgmState: check ? '开启' : '关闭' })
  },
  onPronunciationState(tapIndex) {
    const check = tapIndex === 0
    setPronunciationState(check)
    this.setData({ pronunciationState: check ? '开启' : '关闭' })
  },
  onIsAddUserWords(tapIndex) {
    const check = tapIndex === 0
    setIsAddUserWords(check)
    this.setData({ isAddUserWords: check ? '开启' : '关闭' })
  },
  onIsVibrate(tapIndex) {
    const check = tapIndex === 0
    setIsVibrate(check)
    this.setData({ isVibrate: check ? '开启' : '关闭' })
  },
  onSelect(e) {
    const { currentTarget: { dataset: { type } } } = e
    const map = new Map()
    map.set('combatSubjectNumber', this.onCombatSubjectNumber)
    map.set('bgmState', this.onBgmState)
    map.set('pronunciationState', this.onPronunciationState)
    map.set('isAddUserWords', this.onIsAddUserWords)
    map.set('isVibrate', this.onIsVibrate)
    let itemList = ['开启', '关闭']
    switch (type) {
      case 'combatSubjectNumber':
        itemList = PK_SUBJECTS_NUMBER.map(item => String(item))
        break
    }
    wx.showActionSheet({
      itemList,
      success(res) {
        map.has(type) && map.get(type)(res.tapIndex)
      }
    })
  },
  onClearStorage() {
    let msg = '清空成功，重启小程序生效'
    try {
      wx.clearStorageSync()
    } catch (e) {
      msg = '清空失败，请重试'
    }
    wx.showToast({
      title: msg,
      icon: 'none',
      duration: 2000
    })
  },
  onClearUserWords() {
    wx.showModal({
      title: '提示',
      content: '是否确定清空所有生词?',
      confirmText: '清空',
      confirmColor: '#E95F56',
      async success(res) {
        if (res.confirm) {
          $.loading('清空中...')
          const { result } = await userWordModel.deleteAll()
          if (result) {
            wx.showToast({
              title: '清空成功',
              icon: 'none',
              duration: 2000
            })
          } else {
            wx.showToast({
              title: '清空失败，请重试!',
              icon: 'none',
              duration: 2000
            })
          }
          $.hideLoading()
        }
      }
    })
  },
  onZan() {
    previewAdmire()
  },
  onTo1password() {
    wx.navigateToMiniProgram({
      appId: 'wx865705a73232e931',
      path: 'pages/home/home',
      extraData: {}
    })
  },
  onToxiaJueDing() {
    wx.navigateToMiniProgram({
      appId: 'wx843a6e62022f9b74',
      path: 'pages/home/home',
      extraData: {}
    })
  },
  onToMiao() {
    wx.navigateToMiniProgram({
      appId: 'wxdc2965647d28ea5c',
      path: 'pages/home/home',
      extraData: {}
    })
  },
  onToTimeTrack() {
    wx.navigateToMiniProgram({
      appId: 'wxbd226209f94595d6',
      path: 'pages/home/home',
      extraData: {}
    })
  },
  onTapBack() {
    router.toHome()
  },
  onChat() {
    wx.setClipboardData({ data: 'Arley_GuoLei' })
  },
  onGithub() {
    wx.setClipboardData({ data: 'https://github.com/arleyGuoLei/wx-words-pk' })
  }
})
