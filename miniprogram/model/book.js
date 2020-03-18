import Base from './base'
import $ from './../utils/Tool'
const collectionName = 'book'

/**
 * 权限: 所有用户可读
 */
class BookModel extends Base {
  constructor() {
    super(collectionName)
  }

  async getInfo() {
    const { data } = await this.model.get()
    return data
  }

  async changeBook(bookId, oldBookId, bookName, bookDesc) {
    if (bookId !== oldBookId) {
      const { result: bookList } = await $.callCloud('model_book_changeBook', { bookId, oldBookId, bookName, bookDesc })
      return bookList
    }
  }
}

export default new BookModel()
