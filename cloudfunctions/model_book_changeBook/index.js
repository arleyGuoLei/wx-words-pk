const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const bookModel = db.collection('pk_book')
const userModel = db.collection('pk_user')
const _ = db.command

exports.main = async (event) => {
  const { bookId, oldBookId, bookName, bookDesc } = event
  const bookRandomId = 'random'
  const { OPENID: openid } = cloud.getWXContext()
  await userModel.where({ _openid: openid }).update({ data: { bookId, bookName, bookDesc } })
  bookId !== bookRandomId && await bookModel.where({ _id: bookId }).update({ data: { peopleNumber: _.inc(1) } })
  oldBookId !== bookRandomId && await bookModel.where({ _id: oldBookId }).update({ data: { peopleNumber: _.inc(-1) } })
  const { data: bookList } = await bookModel.get()
  return bookList
}
