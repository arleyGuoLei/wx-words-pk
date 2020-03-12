import Base from './base'
import $ from './../utils/Tool'
import log from './../utils/log'
const collectionName = 'word'

/**
 * 权限: 所有用户可读
 */
class WordModel extends Base {
  constructor() {
    super(collectionName)
  }

  getRandomWords(bookId, size) {
    const where = bookId === 'random' ? {} : { bookId }
    try {
      return this.model.aggregate()
        .match(where)
        .limit(999999)
        .sample({ size })
        .end()
    } catch (error) {
      log.error(error)
      throw error
    }
  }
}

export default new WordModel()
