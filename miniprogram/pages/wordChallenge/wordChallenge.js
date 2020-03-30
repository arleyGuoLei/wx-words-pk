import $ from './../../utils/Tool'
import { wordModel, userWordModel, userModel } from './../../model/index'
import { SUBJECT_HAS_OPTIONS_NUMBER, getPronunciationState, getIsAddUserWords, setBgmState, getBgmState } from '../../utils/setting'
import { formatList, throttle, playAudio, sleep, playPronunciation } from '../../utils/util'
import router from '../../utils/router'
import { initVideoAd, destroyVideoAd, onShowVideoAd } from '../../utils/ad'

const CORRECT_AUDIO = 'audios/correct.mp3'
const WRONG_AUDIO = 'audios/wrong.mp3'
const COUNTDOWN_DEFAULT = 30
const BGM_URL = 'http://img02.tuke88.com/newpreview_music/09/01/72/5c8a08dc4956424741.mp3'

const opportunity = {
  2: 'share',
  1: 'ad',
  0: 'again'
}

Page({
  data: {
    adState: $.store.get('adState'),
    bookDesc: '',
    countdown: COUNTDOWN_DEFAULT,
    score: 0,
    wordList: [],
    listIndex: 0,
    btnAnimation: {},
    rank: '...',
    gameOpportunity: 0,
    tipNumber: 0,
    bgmState: null,
    videoAdState: true
  },
  async onLoad() {
    $.loading('加载中...')
    const { data } = await userModel.getUserInfo($.store.get('openid'))
    const { bookDesc, bookId, tipNumber } = data[0]
    this.setData({ bookDesc, tipNumber, gameOpportunity: Object.keys(opportunity).length - 1, wordList: [], listIndex: 0, rank: '...', btnAnimation: {}, score: 0 })
    this._bookId = bookId
    await this.getWordData()
    $.hideLoading()
    this.initWord()
    this.initBgm()
  },
  onReady() {
    initVideoAd.call(this, 'wordChallenge', this.giveReward.bind(this))
  },
  onUnload() {
    this.countdownTimer && clearInterval(this.countdownTimer)
    this.countdownTimer = null
    this.bgm && this.bgm.destroy()
    destroyVideoAd.call(this)
  },
  initBgm() {
    this.bgm = wx.createInnerAudioContext()
    this.bgm.loop = true
    this.bgm.autoplay = false
    this.bgm.src = BGM_URL
    const state = getBgmState()
    this.setData({ bgmState: state })
    if (state) {
      this.bgm && this.bgm.play()
    }
  },
  onBgmChange(e) {
    const { action = 'start' } = e.currentTarget.dataset
    if (action === 'start') {
      this.bgm && this.bgm.play()
      this.setData({ bgmState: true })
      setBgmState(true)
    } else if (action === 'pause') {
      this.bgm && this.bgm.pause()
      this.setData({ bgmState: false })
      setBgmState(false)
    }
  },
  async getWordData() {
    const bookId = this._bookId
    const { data: { wordList: oldList } } = this
    const { list: randomList } = await wordModel.getRandomWords(bookId, 20 * SUBJECT_HAS_OPTIONS_NUMBER)
    const wordList = formatList(randomList, SUBJECT_HAS_OPTIONS_NUMBER)
    this.setData({ wordList: oldList.concat(wordList) })
  },
  initWord() {
    const { data: { wordList, listIndex } } = this
    getPronunciationState() && playPronunciation(wordList[listIndex].word)
    this.countdownTimer = null
    this.countdown()
  },
  onPlayPronunciation: throttle(function() {
    const { data: { wordList, listIndex } } = this
    playPronunciation(wordList[listIndex].word)
  }, 800),
  onTip: throttle(function() {
    const { data: { tipNumber, wordList, listIndex } } = this
    if (tipNumber > 0) {
      const e = {
        currentTarget: {
          dataset: {
            index: wordList[listIndex]['correctIndex'],
            byTip: true
          }
        }
      }
      this.onSelectOption(e)
    } else {
      wx.showToast({
        title: '提示卡数量不足',
        icon: 'none',
        duration: 2000
      })
    }
  }, 1000),
  countdown() {
    this.setData({ countdown: COUNTDOWN_DEFAULT })
    if (this.countdownTimer === null) {
      this.countdownTimer = setInterval(() => {
        const { data: { countdown } } = this
        if (countdown === 1) {
          const e = { currentTarget: { dataset: { index: -1 } } }
          this.onSelectOption(e)
          clearInterval(this.countdownTimer)
          this.countdownTimer = null
        }
        this.setData({
          countdown: countdown - 1
        })
      }, 1000)
    }
  },
  onSelectOption: throttle(async function(e) {
    const { currentTarget: { dataset: { index, byTip = false } } } = e
    const { data: { wordList, listIndex, gameOpportunity, score, tipNumber } } = this
    const correctIndex = wordList[listIndex].correctIndex
    const key = `wordList[${listIndex}].check`
    const selectIndex = `wordList[${listIndex}].selectIndex`
    this.countdownTimer && clearInterval(this.countdownTimer)
    this.countdownTimer = null
    if (index === correctIndex) {
      playAudio(CORRECT_AUDIO)
      this.setData({ [key]: 'correct', [selectIndex]: index, score: score + 100 })
      if (wordList.length - listIndex <= 5) { this.getWordData() }
      await sleep(800)
      this.playBtnAnimation()
      this.setData({ listIndex: listIndex + 1 }, () => {
        this.initWord()
      })

      if (byTip) {
        getIsAddUserWords() && userWordModel.insert(wordList[listIndex].wordId)
        userModel.changeTipNumber(-1)
        this.setData({ tipNumber: tipNumber - 1 })
      }
    } else {
      playAudio(WRONG_AUDIO)
      this.setData({ [key]: 'wrong', [selectIndex]: index, gameOpportunity: gameOpportunity - 1 }, async () => {
        const rank = await userModel.getWordChallengeRankByScore(score)
        this.setData({ rank })
        userModel.updateWordChallengeScore(score)
      })
      getIsAddUserWords() && userWordModel.insert(wordList[listIndex].wordId)
      await sleep(700)
      this.selectComponent('#popup').show(opportunity[gameOpportunity])
    }
  }, 1500),
  playBtnAnimation() {
    const ani = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-in-out'
    })
    ani.scaleX(0).opacity(0.1).step()
    ani.scaleX(1).opacity(1).step()
    this.setData({
      btnAnimation: ani.export()
    })
  },
  onAgain() {
    this.selectComponent('#popup').hide()
    this.bgm && this.bgm.pause()
    this.bgm && this.bgm.destroy()
    this.onLoad()
  },
  onShow() {
    if (this._shareGoOn) {
      this._shareGoOn = false
      const { data: { listIndex } } = this
      this.selectComponent('#popup').hide()
      this.playBtnAnimation()
      this.setData({ listIndex: listIndex + 1 }, () => {
        this.initWord()
      })
    }
    const { data: { bgmState } } = this
    if (bgmState) { this.bgm && this.bgm.play() }
  },
  onShareAppMessage({ from }) {
    if (from === 'button') {
      this._shareGoOn = true
    }
    return {
      title: `❤ 来一起学习吧，轻松掌握【四六级/考研】必考单词 ~ 👏👏`,
      path: `/pages/home/home`,
      imageUrl: './../../images/share-default-bg.png'
    }
  },
  onBack() { router.toHome() },
  onShowVideoAd() {
    const { data: { videoAdState } } = this
    if (videoAdState) {
      onShowVideoAd.call(this)
    } else {
      this.giveReward()
    }
  },
  giveReward() {
    const { data: { listIndex } } = this
    this.selectComponent('#popup').hide()
    this.playBtnAnimation()
    this.setData({ listIndex: listIndex + 1 }, () => {
      this.initWord()
    })
  }
})
