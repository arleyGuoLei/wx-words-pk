import $ from './../utils/Tool'

const DB_PREFIX = 'pk_'

export default class {
  constructor(collectionName) {
    const env = $.store.get('env')
    const db = wx.cloud.database({ env })
    this.model = db.collection(`${DB_PREFIX}${collectionName}`)
    this._ = db.command
    this.db = db
    this.env = env
  }

  get date() {
    return wx.cloud.database({ env: this.env }).serverDate()
  }
}
