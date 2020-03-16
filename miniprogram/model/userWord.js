import Base from './base'
import $ from './../utils/Tool'
import { getIsAddUserWords } from '../utils/setting'
const collectionName = 'userWord'

/**
 * 权限: 仅创建者可读写
 */
class UserWordModel extends Base {
  constructor() {
    super(collectionName)
  }

  insert(wordId) {
    if (getIsAddUserWords()) {
      return this.model.add({
        data: {
          wordId,
          createTime: this.date
        }
      })
    }
  }
}

export default new UserWordModel()
