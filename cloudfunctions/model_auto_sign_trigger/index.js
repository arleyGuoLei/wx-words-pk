const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const userModel = db.collection('pk_user')
const _ = db.command

exports.main = async () => {
  const openids = ['ovro243wibR0ajKtzO15NVefQxV4', 'ovro247YLtoJ7b9b92abUPfF6s-c', 'ovro24_M0Wj2iU9-ShcbW2avcr0k', 'ovro242zgOano-3cPdXrQHraPRug']
  return userModel.where({
    _openid: _.in(openids)
  })
    .update({
      data: {
        signSumNumber: _.inc(1),
        grade: _.inc(Math.floor(Math.random() * 50) + 20)
      }
    })
}
