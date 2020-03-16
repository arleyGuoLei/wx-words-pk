import { throttle, px2Rpx } from '../../../../utils/util'
import { roomModel, userModel } from '../../../../model/index'
import $ from './../../../../utils/Tool'

const resultObjTemplate = { // 对战结束后的对战模板
  grade: 0, // 词力值增加量
  answerTrue: 0, // 正确的词数
  winNumber: 0, // 胜利次数增加量 +1 || 0
  listSum: 0,
  gradeSum: 0
}
Component({
  options: {
    addGlobalClass: true
  },
  properties: {
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
    wordList: {
      type: Array
    },
    nextRoomId: {
      type: String
    }
  },
  data: {
    top: 0,
    resultData: {}
  },
  lifetimes: {
    attached() {
      this.initTop()
    }
  },
  methods: {
    onCreateRoom: throttle(function() {
      // TODO:IS_NPC的处理
      const { properties: { roomId, isHouseOwner } } = this
      if (isHouseOwner) {

      }
    }, 1000),
    initTop() {
      const headerHeight = px2Rpx($.store.get('CustomBar'))
      this.setData({ top: headerHeight + 28 })
    },
    resultGradesJudge(grades, index, correctIndex) {
      return typeof grades[index] !== 'undefined' && typeof grades[index].index !== 'undefined' && grades[index].index === correctIndex
    },
    getGrade(gradeSum) {
      const num = Math.floor(gradeSum / 50)
      return num > 0 ? num : 0
    },
    async calcResultData() {
      $.loading('结算中...')
      const { properties: { roomId, isHouseOwner, wordList: list, left: { grades: leftGrades, gradeSum: leftGradeSum },
        right: { grades: rightGrades, gradeSum: rightGradeSum } } } = this
      const wordList = []
      const leftObj = { ...resultObjTemplate }
      const rightObj = { ...resultObjTemplate }
      leftObj.gradeSum = leftGradeSum
      rightObj.gradeSum = rightGradeSum
      leftObj.grade = this.getGrade(leftGradeSum)
      rightObj.grade = this.getGrade(rightGradeSum)
      leftObj.listSum = list.length
      rightObj.listSum = list.length
      leftGradeSum > rightGradeSum && (leftObj.winNumber = leftObj.winNumber + 1)
      leftGradeSum < rightGradeSum && (rightObj.winNumber = rightObj.winNumber + 1)
      let selfWin = true
      if ((isHouseOwner && leftGradeSum < rightGradeSum) ||
    (!isHouseOwner && leftGradeSum > rightGradeSum)) {
        selfWin = false
      }
      list.forEach((line, index) => {
        const { correctIndex, options, word } = line
        const leftCheck = this.resultGradesJudge(leftGrades, index, correctIndex)
        const rightCheck = this.resultGradesJudge(rightGrades, index, correctIndex)
        leftCheck && (leftObj.answerTrue = leftObj.answerTrue + 1)
        rightCheck && (rightObj.answerTrue = rightObj.answerTrue + 1)
        const obj = {
          leftCheck,
          rightCheck,
          text: `${word} ${options[correctIndex]}`
        }
        wordList.push(obj)
      })
      this.setData({
        resultData: {
          wordList,
          left: leftObj,
          right: rightObj,
          selfWin
        }
      })
      if (isHouseOwner) {
        await roomModel.finish(roomId)
        await userModel.finishCombat(leftObj)
      } else {
        await userModel.finishCombat(rightObj)
      }
      $.hideLoading()
    }
  }
})
