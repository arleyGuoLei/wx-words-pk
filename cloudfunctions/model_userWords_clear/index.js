const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const log = cloud.logger()
const db = cloud.database()
const userWorsModel = db.collection('pk_userWord')

exports.main = async () => {
  const { OPENID: openid } = cloud.getWXContext()
  try {
    await userWorsModel.where({
      _openid: openid
    }).remove()
    return true
  } catch (error) {
    log.error(error)
    return false
  }
}
