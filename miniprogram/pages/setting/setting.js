import { getCombatSubjectNumber, getBgmState, getPronunciationState, getIsAddUserWords, PK_SUBJECTS_NUMBER, setCombatSubjectNumber, setBgmState, setPronunciationState, setIsAddUserWords, getADstate, setADstate } from '../../utils/setting'
import $ from './../../utils/Tool'
import { userWordModel } from '../../model/index'
import router from '../../utils/router'
import { initVideoAd, destroyVideoAd, onShowVideoAd } from '../../utils/ad'
Page({
  data: {
    appAdState: $.store.get('adState'),
    combatSubjectNumber: getCombatSubjectNumber(),
    bgmState: getBgmState() ? '开启' : '关闭',
    pronunciationState: getPronunciationState() ? '开启' : '关闭',
    isAddUserWords: getIsAddUserWords() ? '开启' : '关闭',
    adState: getADstate() ? '开启' : '关闭',
    videoAdState: true
  },
  onLoad() {

  },
  onReady() {
    initVideoAd.call(this, 'setting', this.giveReward.bind(this))
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
  onAdState(tapIndex) {
    const check = tapIndex === 0
    const { data: { adState } } = this
    const that = this
    if (!check && adState === '开启') {
      wx.showModal({
        title: '提示',
        content: '观看一个小视频广告即可关闭图文广告，是否关闭?',
        confirmText: '关闭',
        success(res) {
          if (res.confirm) {
            that.onShowVideoAd()
          } else if (res.cancel) {
            wx.showToast({
              title: '取消关闭',
              icon: 'none',
              duration: 2000
            })
          }
        }
      })
    }
    if (check) {
      setADstate(true)
      this.setData({ adState: '开启' })
    }
  },
  onSelect(e) {
    const { currentTarget: { dataset: { type } } } = e
    const map = new Map()
    map.set('combatSubjectNumber', this.onCombatSubjectNumber)
    map.set('bgmState', this.onBgmState)
    map.set('pronunciationState', this.onPronunciationState)
    map.set('isAddUserWords', this.onIsAddUserWords)
    map.set('adState', this.onAdState)
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
    wx.navigateToMiniProgram({
      appId: 'wx18a2ac992306a5a4',
      path: 'pages/apps/largess/detail?id=k%2BiHXlLOuLA%3D',
      extraData: {}
    })
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
  onTapBack() {
    router.toHome()
  },
  onUnload() {
    destroyVideoAd.call(this)
  },
  onShowVideoAd() {
    onShowVideoAd.call(this)
  },
  giveReward() {
    setADstate(false)
    this.setData({ adState: '关闭' })
    wx.showToast({
      title: '关闭成功, 重启小程序就没有广告了哦',
      icon: 'none',
      duration: 2000
    })
  }
})
