const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const log = cloud.logger()
const db = cloud.database()
const userWorsModel = db.collection('pk_userWord')

exports.main = async (event) => {
  const { page } = event
  const { OPENID: openid } = cloud.getWXContext()
  const len = 20

  try {
    const { list } = await userWorsModel
      .aggregate()
      .sort({ createTime: -1 })
      .match({ _openid: openid })
      .skip((page - 1) * len)
      .limit(len)
      .lookup({
        from: 'pk_word',
        localField: 'wordId',
        foreignField: '_id',
        as: 'words'
      })
      .unwind('$words')
      .replaceRoot({
        newRoot: '$words'
      })
      .end()

    const { total } = await userWorsModel.where({ _openid: openid }).count()
    return { code: 0, data: { list, total, page, size: len } }
  } catch (error) {
    log.error({ msg: error.message })
    return { code: -1, data: error.message }
  }
}
