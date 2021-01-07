import Base from './base'
import $ from './../utils/Tool'
const collectionName = 'userActivity'

const doc = {
  pvpNumber: 0, // 对战次数
  winNumber: 0, // 胜利次数
  grade: 0, // 词力值
  avatarUrl: '', // 头像
  nickName: '', // 昵称
  answerSum: 0,
  answerTrue: 0
}

class UserActivityModel extends Base {
  constructor() {
    super(collectionName)
  }

  add(activityId, options = {}) {
    this.model.add({ data: { ...doc, activityId, createTime: this.date, ...options } })
  }

  update(obj) {
    const { grade, winNumber, answerTrue, listSum, activityId, avatarUrl, nickName } = obj
    return this.model
      .where({
        _openid: '{openid}',
        activityId
      })
      .update({
        data: {
          answerSum: this._.inc(listSum),
          answerTrue: this._.inc(answerTrue),
          grade: this._.inc(grade),
          pvpNumber: this._.inc(1),
          winNumber: this._.inc(winNumber),
          avatarUrl,
          nickName
        }
      })
  }

  async isExist(activityId) {
    const { total: number = 0 } = await this.model.where({
      _openid: this._.eq($.store.get('openid')),
      activityId
    }).count()
    return number > 0
  }

  async finishCombat(obj, userInfo) {
    const { activityId, winNumber, grade, listSum, answerTrue } = obj
    const { avatarUrl, nickName } = userInfo
    if (await this.isExist(activityId)) {
      await this.update({ ...obj, avatarUrl, nickName })
    } else {
      await this.add(activityId, { avatarUrl, nickName, pvpNumber: 1, winNumber, grade, answerSum: listSum, answerTrue })
    }
  }

  getUserInfo(openid, activityId) {
    return this.model.where({ _openid: openid, activityId }).limit(1).get()
  }

  getSortList(activityId, page, len) {
    return this.model.aggregate()
      .sort({ grade: -1 })
      .match({
        activityId,
        avatarUrl: this._.neq('')
      })
      .skip((page - 1) * len)
      .limit(len)
      .end()
  }

  async getGradeRank(activityId, page = 1) {
    const len = 20
    let myInfo = {}
    let sumTotal = -1
    let list = []
    if (page === 1) {
      const [{ total }, { data: userinfo }, { list: sortList }] = await Promise.all([this.model.where({
        activityId
      }).count(),
      this.getUserInfo($.store.get('openid'), activityId),
      this.getSortList(activityId, page, len)
      ])
      sumTotal = total
      list = sortList

      const data = userinfo[0]
      if (typeof data !== 'undefined') {
        const { total: number } = await this.model.where({
          grade: this._.gte(data.grade),
          activityId
        }).count()
        myInfo = { ...data, number }
      }
    } else {
      const { list: sortList } = await this.getSortList(activityId, page, len)
      list = sortList
    }

    return {
      list,
      myInfo,
      data: {
        list,
        size: len,
        total: sumTotal
      }
    }
  }
}

export default new UserActivityModel()
