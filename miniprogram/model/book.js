import Base from './base'
import $ from './../utils/Tool'
const collectionName = 'book'

/**
 * 权限: 所有用户可读，仅创建者可写
 */
class BookModel extends Base {
  constructor() {
    super(collectionName)
  }

  async getInfo() {
    const { data } = await this.model.get()
    return data
  }

  async changeBook(bookId, oldBookId) {
    if (bookId !== oldBookId) {
      const { result: bookList } = await $.callCloud('model_book_changeBook', { bookId, oldBookId })
      return bookList
    }
  }
}

export default new BookModel()
