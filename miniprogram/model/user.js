import Base from './base'
import $ from './../utils/Tool'
const collectionName = 'user'

const doc = {
  tipNumber: 10, // 提示卡数量
  pvpNumber: 0, // 对战次数
  winNumber: 0, // 胜利次数
  grade: 0, // 词力值
  avatarUrl: '', // 头像
  infinityGrade: 0, // 词汇挑战最高分数
  nickName: '', // 昵称
  gender: 0, // 性别
  bookDesc: '随机', // 选择书的简称，用于当前选择的书的名称显示
  bookId: 'random', // 选择的书的id
  bookName: '随机所有词汇', // 选择的书的具体书名，用于游戏对战
  country: '',
  province: '',
  city: ''
}

/**
 * 权限: 所有用户可读，仅创建者可写
 */
class UserModel extends Base {
  constructor() {
    super(collectionName)
  }

  register() {
    return this.model.add({ data: { ...doc, createTime: this.date } })
  }

  getUserInfo(openid) {
    return this.model.where({ _openid: openid }).limit(1).get()
  }

  /**
   * 获取自己的用户信息
   */
  async getOwnInfo() {
    const { result: userInfo } = await $.callCloud('model_user_getInfo')
    if (userInfo === null) { // 新用户
      await this.register()
      return (await this.getOwnInfo())
    }
    $.store.set('openid', userInfo._openid)
    return userInfo
  }

  /**
   * 更新用户信息 (小程序端更新数据库基础库版本需>=2.9.4)
   * @param {Object} userInfo 用户信息
   */
  updateInfo({ avatarUrl, nickName, gender, country, province, city }) {
    return this.model.where({ _openid: '{openid}' }).update({ data: { avatarUrl, nickName, gender, country, province, city } })
  }

  /**
   * 改变用户的提示卡数量
   * @param {Number} number 数量，可正可负
   */
  changeTipNumber(number) {
    const num = number < 5 ? number : 1 // 最多一次性增加5个tipNumber
    return this.model.where({
      _openid: '{openid}'
    }).update({
      data: {
        tipNumber: this._.inc(num)
      }
    })
  }

  finishCombat(obj) {
    const { grade, winNumber, answerTrue, listSum } = obj
    return this.model
      .where({
        _openid: '{openid}'
      })
      .update({
        data: {
          answerSum: this._.inc(listSum),
          answerTrue: this._.inc(answerTrue),
          grade: this._.inc(grade),
          pvpNumber: this._.inc(1),
          winNumber: this._.inc(winNumber)
        }
      })
  }

  getNPCUser() {
    return this.model.aggregate()
      .match({
        _openid: this._.neq($.store.get('openid')),
        nickName: this._.neq(''),
        avatarUrl: this._.neq('')
      })
      .sample({ size: 1 })
      .end()
  }

  /**
   * 获取分数在词汇挑战中的排名
   */
  async getWordChallengeRankByScore(score) {
    const { total: number } = await this.model.where({ infinityGrade: this._.gte(score) }).count()
    return number + 1
  }

  updateWordChallengeScore(score) {
    return this.model
      .where({
        _openid: '{openid}',
        infinityGrade: this._.lt(score)
      })
      .update({
        data: {
          infinityGrade: score,
          grade: this._.inc(Math.floor(score / 100))
        }
      })
  }
}

export default new UserModel()
