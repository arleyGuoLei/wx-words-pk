import { throttle, playAudio, px2Rpx, playPronunciation } from '../../../../utils/util'
import { roomModel, userModel, userWordModel } from '../../../../model/index'
import $ from './../../../../utils/Tool'
import { getPronunciationState } from '../../../../utils/setting'
const CORRECT_AUDIO = 'audios/correct.mp3'
const WRONG_AUDIO = 'audios/wrong.mp3'
const COUNTDOWN_DEFAULT = 10
Component({
  options: {
    addGlobalClass: true
  },
  properties: {
    wordObj: {
      type: Object
    },
    listIndex: {
      type: Number
    },
    roomId: {
      type: String
    },
    isHouseOwner: {
      type: Boolean
    },
    left: {
      type: Object
    },
    right: {
      type: Object
    },
    listLength: {
      type: Number
    },
    tipNumber: {
      type: Number
    }
  },
  data: {
    btnAnimation: {},
    leftResult: '',
    rightResult: '',
    showAnswer: false,
    selectIndex: -1, // 选择的答案的index
    anotherSelectIndex: -1, // 另外一个用户选择答案的index
    gradeShow: {
      leftGrade: 0,
      rightGrade: 0,
      leftGradeProcess: 0,
      rightGradeProcess: 0
    },
    countdownTop: 0,
    countdown: COUNTDOWN_DEFAULT,
    countdownAnimation: {}
  },
  lifetimes: {
    attached() {
      this.init(false)
      wx.vibrateLong()
      this.initCountdownTop()
    },
    detached() {
      this.countdownTimer && clearInterval(this.countdownTimer)
    }
  },
  methods: {
    initCountdownTop() {
      const headerHeight = px2Rpx($.store.get('CustomBar'))
      this.setData({ countdownTop: headerHeight + 46 })
    },
    countdown() {
      this.setData({ countdown: COUNTDOWN_DEFAULT })
      if (this.countdownTimer === null) {
        this.countdownTimer = setInterval(() => {
          const { data: { countdown } } = this
          if (countdown === 1) {
            if (!this._isSelected) {
              const e = { currentTarget: { dataset: { index: -1 } } }
              this.onSelectOption(e)
            }
            clearInterval(this.countdownTimer)
            this.countdownTimer = null
          }
          if (countdown > 1 && countdown <= 4) {
            this.playCountdownAnimation()
          }
          this.setData({
            countdown: countdown - 1
          })
        }, 1000)
      }
    },
    getProcessGrade() {
      const { properties: { listLength, left: { gradeSum: leftGrade }, right: { gradeSum: rightGrade } } } = this
      const sumGrade = listLength // 每题最高100分, 后面要求百分比 => /100 * 100%
      this.setData({
        'gradeShow.leftGrade': leftGrade,
        'gradeShow.rightGrade': rightGrade,
        'gradeShow.leftGradeProcess': Math.floor(leftGrade / sumGrade),
        'gradeShow.rightGradeProcess': Math.floor(rightGrade / sumGrade)
      })
    },
    /**
     * 修改按钮显示的状态，答案对/错，是否标记正确答案
     * @param {Number} index 题目Index
     */
    changeBtnFace(index) {
      const { properties: { left, right, isHouseOwner, wordObj: { correctIndex } } } = this
      const key = !isHouseOwner ? 'leftResult' : 'rightResult' // 显示对方选择的答案
      const anotherUser = !isHouseOwner ? left : right
      if (typeof anotherUser.grades[index] !== 'undefined') {
        this.setData({
          anotherSelectIndex: anotherUser.grades[index].index,
          [key]: correctIndex === anotherUser.grades[index].index ? 'true' : 'false'
        })
      }
    },
    playCountdownAnimation() {
      const ani = wx.createAnimation({
        duration: 500,
        timingFunction: 'ease-in-out'
      })
      ani.scale(1.2).step()
      ani.scale(1).step()
      this.setData({
        countdownAnimation: ani.export()
      })
    },
    playBtnAnimation() {
      const ani = wx.createAnimation({
        duration: 500,
        timingFunction: 'ease-in-out'
      })
      ani.scaleX(0.1).opacity(0.1).step()
      ani.scaleX(1).opacity(1).step()
      this.setData({
        btnAnimation: ani.export()
      })
    },
    init(animation = true) {
      animation && this.playBtnAnimation()
      this._startTime = Date.now()
      this._isSelected = false
      this.setData({
        showAnswer: false,
        leftResult: '',
        rightResult: '',
        selectIndex: -1,
        anotherSelectIndex: -1 // 另外一个用户选择答案的index
      })
      this.countdownTimer && clearInterval(this.countdownTimer)
      this.countdownTimer = null
      this.countdown()
      const { properties: { wordObj: { word } } } = this
      getPronunciationState() && playPronunciation(word)
    },
    getScore() {
      const score = Math.floor((10700 - (Date.now() - this._startTime)) / 100)
      if (typeof score === 'number') {
        if (score >= 100) { return 100 }
        if (score <= 0) { return 0 }
        return score
      }
      return 0
    },
    onSelectOption: throttle(async function(e) {
      if (!this._isSelected) {
        const { currentTarget: { dataset: { index, byTip = false } } } = e
        this.setData({ showAnswer: true, selectIndex: index })
        const { properties: { roomId, isHouseOwner, listIndex, wordObj: { correctIndex, wordId } } } = this
        let score = -10
        const key = isHouseOwner ? 'leftResult' : 'rightResult' // 用于显示选项上的√或×
        if (correctIndex === index) {
          playAudio(CORRECT_AUDIO)
          this.setData({ [key]: 'true' })
          score = this.getScore()
          if (byTip) {
            userModel.changeTipNumber(-1)
            userWordModel.insert(wordId)
            this.triggerEvent('useTip')
          }
        } else {
          playAudio(WRONG_AUDIO)
          wx.vibrateShort()
          this.setData({ [key]: 'false' })
          userWordModel.insert(wordId)
        }
        const { stats: { updated = 0 } } = await roomModel.selectOption(roomId, index, score, listIndex, isHouseOwner)
        if (updated === 1) { this._isSelected = true } else {
          this.setData({ showAnswer: false, selectIndex: -1 })
        }
      } else {
        wx.showToast({
          title: '此题已选, 不要点击太快哦',
          icon: 'none',
          duration: 2000
        })
      }
    }, 1000),
    onGetTip: throttle(function() {
      const { properties: { tipNumber, wordObj } } = this
      if (tipNumber > 0) {
        const e = {
          currentTarget: {
            dataset: {
              index: wordObj['correctIndex'],
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
    }, 1000)
  }
})
