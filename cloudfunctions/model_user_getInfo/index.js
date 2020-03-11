const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const userModel = db.collection('pk_user')

exports.main = async () => {
  const { OPENID: openid } = cloud.getWXContext()
  const asBook = 'book'
  const { list } = await userModel
    .aggregate()
    .match({ _openid: openid })
    .limit(1)
    .lookup({
      from: 'pk_book',
      localField: 'bookId',
      foreignField: '_id',
      as: asBook
    })
    .end()
  if (list.length === 0) { return null }
  const userInfo = {
    ...list[0],
    bookName: list[0][asBook][0].name,
    bookDesc: list[0][asBook][0].desc
  }
  delete userInfo[asBook]
  return userInfo
}
