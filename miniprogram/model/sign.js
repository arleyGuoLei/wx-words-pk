import Base from './base'
import { dateFormat } from '../utils/util'
const collectionName = 'sign'

/**
 * 权限: 仅创建者可读写
 */
class SignModel extends Base {
  constructor() {
    super(collectionName)
  }

  async getSign(yearMonth = dateFormat('YYYY-mm')) {
    const { data = [] } = await this.model.where({
      _openid: '{openid}',
      yearMonth
    }).limit(1).get()
    if (data.length === 0) {
      return { signDays: [], yearMonth }
    } else {
      const { signDays, yearMonth } = data[0]
      return { signDays, yearMonth }
    }
  }

  async add() {
    const yearMonth = dateFormat('YYYY-mm')
    const today = Number(dateFormat('dd'))
    const { total: number } = await this.model.where({
      _openid: '{openid}',
      yearMonth
    }).count()
    if (number >= 1) {
      return await this.model.where({
        _openid: '{openid}',
        yearMonth
      }).update({
        data: {
          signDays: this._.push([today])
        }
      })
    } else {
      return await this.model.add({
        data: {
          yearMonth,
          signDays: [today]
        }
      })
    }
  }
}

export default new SignModel()
