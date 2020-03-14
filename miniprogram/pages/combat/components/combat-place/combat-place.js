import { throttle } from '../../../../utils/util'
import { roomModel } from '../../../../model/index'

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
    }
  },
  data: {
    btnAnimation: {},
    leftResult: '',
    rightResult: '',
    showAnswer: false,
    selectIndex: -1, // 选择的答案的index
    anotherSelectIndex: -1 // 另外一个用户选择答案的index
  },
  lifetimes: {
    attached() {
      this.init(false)
      wx.vibrateLong()
    }
  },
  methods: {
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
        const { currentTarget: { dataset: { index } } } = e
        this.setData({ showAnswer: true, selectIndex: index })
        const { properties: { roomId, isHouseOwner, listIndex, wordObj: { correctIndex } } } = this
        let score = -10
        const key = isHouseOwner ? 'leftResult' : 'rightResult'
        if (correctIndex === index) {
          this.setData({ [key]: 'true' })
          score = this.getScore()
        } else {
          this.setData({ [key]: 'false' })
          // TODO:选择错误
        }
        const { stats: { updated = 0 } } = await roomModel.selectOption(roomId, index, score, listIndex, isHouseOwner)
        if (updated === 1) { this._isSelected = true } else {
          this.setData({ showAnswer: false, selectIndex: -1 })
        }
      }
    }, 1000)
  }
})
