const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const userModel = db.collection('pk_user')
const _ = db.command

// 自动签到的几个用户，用于带动排行榜单，可以修改下方数组为自己的openid，然后设置触发器

exports.main = async () => {
  const openids = ['ovro243wibR0ajKtzO15NVefQxV4', 'ovro24_M0Wj2iU9-ShcbW2avcr0k', 'ovro242zgOano-3cPdXrQHraPRug', 'ovro240jsZm_GyrHNh7luqa-qqys']
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
