import { throttle, px2Rpx, formatList, dateFormat } from '../../../../utils/util'
import { roomModel, userModel, wordModel, signModel, userActivityModel, activityModel } from '../../../../model/index'
import $ from './../../../../utils/Tool'
import log from './../../../../utils/log'
import { getCombatSubjectNumber, SUBJECT_HAS_OPTIONS_NUMBER, SIGN_PVP_NUMBER, SIGN_WIN_NUMBER } from '../../../../utils/setting'
import router from '../../../../utils/router'
const date = dateFormat('YYYY-mm-dd')

const resultObjTemplate = { // 对战结束后的对战模板
  grade: 0, // 词力值增加量
  answerTrue: 0, // 正确的词数
  winNumber: 0, // 胜利次数增加量 +1 || 0
  listSum: 0,
  gradeSum: 0,
  signDate: date,
  todayPvpNumber: 0,
  todayWinNumber: 0,
  signSumNumber: 0,
  lastSignDate: ''
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
    },
    isNpcCombat: {
      type: Boolean,
      value: false
    },
    houseOwnerInfo: {
      type: Object
    },
    activityIds: {
      type: Array
    },
    rightUserInfo: {
      type: Object
    }
  },
  data: {
    top: 0,
    resultData: null,
    adState: $.store.get('adState')
  },
  lifetimes: {
    attached() {
      this.initTop()
    }
  },
  methods: {
    onWaitRoom: throttle(function() {
      this.selectComponent('#errorMessage').show('请等待对方创房')
    }, 1000),
    onCreateRoom: throttle(function() {
      this.quickStart()
    }, 1000),
    async quickStart() {
      const { properties: { roomId, isHouseOwner, isNpcCombat, nextRoomId } } = this
      if (isHouseOwner) {
        $.loading('生成随机词汇中...')
        const { properties: { houseOwnerInfo: { bookId, bookDesc, bookName } } } = this
        const number = getCombatSubjectNumber()
        const { list: randomList } = await wordModel.getRandomWords(bookId, number * SUBJECT_HAS_OPTIONS_NUMBER)
        const wordList = formatList(randomList, SUBJECT_HAS_OPTIONS_NUMBER)
        $.loading('创建房间中...')
        const nextRoomId = await roomModel.create(wordList, !isNpcCombat, bookDesc, bookName)
        await roomModel.updateNextRoomId(roomId, nextRoomId)
        $.hideLoading()
        router.redirectTo('combat', { roomId: nextRoomId })
      } else {
        if (nextRoomId !== '') {
          router.redirectTo('combat', { roomId: nextRoomId })
        }
      }
    },
    initTop() {
      const headerHeight = px2Rpx($.store.get('CustomBar'))
      this.setData({ top: headerHeight + 28 })
    },
    resultGradesJudge(grades, index, correctIndex) {
      return typeof grades[index] !== 'undefined' && typeof grades[index].index !== 'undefined' && grades[index].index === correctIndex
    },
    getGrade(gradeSum) {
      const { properties: { wordList } } = this
      const maxScore = wordList.length * 2
      let num = Math.floor(gradeSum / 50)
      num = num > maxScore ? maxScore : num
      return num > 0 ? num : 0
    },
    async calcResultData() {
      $.loading('结算中...')

      const { properties: { roomId, houseOwnerInfo, rightUserInfo, isHouseOwner, wordList: list,
        left: { grades: leftGrades, gradeSum: leftGradeSum },
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

      /**
       * 签到业务开始
       */
      leftObj.signDate = date // 今天对战的日期
      rightObj.signDate = date
      leftObj.signSumNumber = houseOwnerInfo.signSumNumber
      rightObj.signSumNumber = rightUserInfo.signSumNumber
      leftObj.todayWinNumber = houseOwnerInfo.todayWinNumber
      rightObj.todayWinNumber = rightUserInfo.todayWinNumber
      leftObj.lastSignDate = houseOwnerInfo.lastSignDate // 上一次签到是什么时候
      rightObj.lastSignDate = rightUserInfo.lastSignDate
      if (isHouseOwner && // 是房主
        houseOwnerInfo.todayPvpNumber >= SIGN_PVP_NUMBER - 1 && // 今天对战次数>=4
        houseOwnerInfo.todayWinNumber >= SIGN_WIN_NUMBER - 1 && // 今天胜利次数>=1
        houseOwnerInfo.signDate === date) { // 数据库里签到的时间是今天
        if ((houseOwnerInfo.todayWinNumber === SIGN_WIN_NUMBER - 1 && leftGradeSum > rightGradeSum) || // 如果只赢了一局，那这局还要赢才算是签到
        houseOwnerInfo.todayWinNumber >= SIGN_WIN_NUMBER
        ) {
          if (houseOwnerInfo.lastSignDate !== date) {
            try {
              signModel.add()
              leftObj.signSumNumber = houseOwnerInfo.signSumNumber + 1
              leftObj.lastSignDate = date
            } catch (error) {
              log.error(error)
            }
          }
        }
      }

      if (!isHouseOwner &&
        rightUserInfo.todayPvpNumber >= SIGN_PVP_NUMBER - 1 &&
        rightUserInfo.todayWinNumber >= SIGN_WIN_NUMBER - 1 && // 今天胜利次数>=1
        rightUserInfo.signDate === date) { // 数据库里签到的时间是今天
        if ((rightUserInfo.todayWinNumber === SIGN_WIN_NUMBER - 1 && leftGradeSum < rightGradeSum) || // 如果只赢了一局，那这局还要赢才算是签到
        rightUserInfo.todayWinNumber >= SIGN_WIN_NUMBER
        ) {
          if (rightUserInfo.lastSignDate !== date) {
            try {
              signModel.add()
              rightObj.signSumNumber = rightUserInfo.signSumNumber + 1
              rightObj.lastSignDate = date
            } catch (error) {
              log.error(error)
            }
          }
        }
      }

      if (houseOwnerInfo.signDate !== date) {
        leftObj.todayPvpNumber = 1
        leftObj.todayWinNumber = 1
      } else {
        leftObj.todayPvpNumber = houseOwnerInfo.todayPvpNumber + 1
        if (leftGradeSum > rightGradeSum) {
          leftObj.todayWinNumber = houseOwnerInfo.todayWinNumber + 1
        }
      }

      if (rightUserInfo.signDate !== date) {
        rightObj.todayPvpNumber = 1
        rightObj.todayWinNumber = 1
      } else {
        rightObj.todayPvpNumber = rightUserInfo.todayPvpNumber + 1
        if (leftGradeSum < rightGradeSum) {
          rightObj.todayWinNumber = rightUserInfo.todayWinNumber + 1
        }
      }
      /**
       * 签到业务结束
       */

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
        await this.calcActivityData(leftObj, houseOwnerInfo)
      } else {
        await userModel.finishCombat(rightObj)
        await this.calcActivityData(rightObj, rightUserInfo)
      }
      $.hideLoading()
    },

    async calcActivityData(obj, userInfo) {
      const { data: { activityIds } } = this
      let i = 0
      for (const activityObj of activityIds) {
        const todaySurplus = activityModel.getTodaySurplus(activityObj.limit)
        if (todaySurplus > 0) {
          await userActivityModel.finishCombat({ activityId: activityObj.id, ...obj }, userInfo)
        }
        if (i === 0) {
          activityModel.addLocalTimes()
          i++
        }
      }
    }
  }
})
