import Base from './base'
import $ from './../utils/Tool'
import log from './../utils/log'
const collectionName = 'room'

/**
 * 权限: 所有用户可读写
 */
class RoomModel extends Base {
  constructor() {
    super(collectionName)
  }

  create(list, isFriend, bookDesc) {
    try {
      const { _id = '' } = this.model.add({ data: {
        list,
        isFriend,
        createTime: this.date,
        bookDesc,
        left: {
          uid: '{openid}',
          gradeSum: 0,
          grades: {}
        },
        right: {
          uid: '',
          gradeSum: 0,
          grades: {}
        },
        state: '', // 房间的状态 ['(默认为'')', 'PK(对战中)', 'finish(对战结束)', 'leave(对战中有用户离开)']
        nextRoomId: '', // 再来一局的房间id
        isNPC: false // 是否为机器人对战局
      } })
      if (_id === '') { return _id }
      throw new Error('roomId get fail')
    } catch (error) {
      log.error(error)
      throw error
    }
  }
}

export default new RoomModel()
