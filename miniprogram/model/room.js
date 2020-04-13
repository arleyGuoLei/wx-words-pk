import Base from './base'
import $ from './../utils/Tool'
import log from './../utils/log'
const collectionName = 'room'

export const ROOM_STATE = {
  IS_OK: 'OK', // 房间状态正常
  IS_PK: 'PK', // 对战中
  IS_READY: 'READY', // 非房主用户已经准备
  IS_FINISH: 'FINISH', // 对战结束
  IS_USER_LEAVE: 'LEAVE' // 对战中有用户离开
}

/**
 * 权限: 所有用户可读写
 */
class RoomModel extends Base {
  constructor() {
    super(collectionName)
  }

  userReady(roomId, isNPC = false, openid = $.store.get('openid')) {
    return this.model.where({
      _id: roomId,
      'right.openid': '',
      state: ROOM_STATE.IS_OK
    }).update({
      data: {
        right: { openid },
        state: ROOM_STATE.IS_READY,
        isNPC
      }
    })
  }

  userCancelReady(roomId) {
    return this.model.where({
      _id: roomId,
      'right.openid': this._.neq(''),
      state: ROOM_STATE.IS_READY
    }).update({
      data: {
        right: { openid: '' },
        state: ROOM_STATE.IS_OK
      }
    })
  }

  startPK(roomId) {
    return this.model.where({
      _id: roomId,
      'right.openid': this._.neq(''),
      state: ROOM_STATE.IS_READY
    }).update({
      data: {
        state: ROOM_STATE.IS_PK
      }
    })
  }

  async create(list, isFriend, bookDesc, bookName) {
    try {
      const { _id = '' } = await this.model.add({ data: {
        list,
        isFriend,
        createTime: this.date,
        bookDesc,
        bookName,
        left: {
          openid: '{openid}',
          gradeSum: 0,
          grades: {}
        },
        right: {
          openid: '',
          gradeSum: 0,
          grades: {}
        },
        state: ROOM_STATE.IS_OK,
        nextRoomId: '', // 再来一局的房间id
        isNPC: false // 是否为机器人对战局
      } })
      if (_id !== '') { return _id }
      throw new Error('roomId get fail')
    } catch (error) {
      log.error(error)
      throw error
    }
  }

  selectOption(roomId, index, score, listIndex, isHouseOwner) {
    const position = isHouseOwner ? 'left' : 'right'
    return this.model.doc(roomId).update({
      data: {
        [position]: {
          gradeSum: this._.inc(score),
          grades: {
            [listIndex]: {
              index,
              score
            }
          }
        }
      }
    })
  }

  /**
   * 结束房间的对战
   */
  finish(roomId) {
    return this.model.where({
      _id: roomId,
      state: ROOM_STATE.IS_PK
    }).update({
      data: {
        state: ROOM_STATE.IS_FINISH
      }
    })
  }

  leave(roomId) {
    return this.model.where({
      _id: roomId,
      state: ROOM_STATE.IS_PK
    }).update({
      data: {
        state: ROOM_STATE.IS_USER_LEAVE
      }
    })
  }

  remove(roomId, state = ROOM_STATE.IS_OK) {
    return this.model.where({
      _id: roomId,
      _openid: '{openid}',
      state
    }).remove()
  }

  /**
   * 搜索随机匹配房间
   * 2mins之内创建的房间
   */
  searchRoom(bookDesc) {
    return this.model.where({
      bookDesc,
      isFriend: false,
      'right.openid': '',
      'left.openid': this._.neq($.store.get('openid')),
      state: ROOM_STATE.IS_OK,
      createTime: this._.gt(this.serverDate(-2 * 60 * 1000)) // 创建时间要>2分钟之前
    }).limit(1).field({ _id: true }).get()
  }

  /**
   * 再来一局
   * @param {String} roomId 当前房间id
   * @param {String} nextRoomId 下一局房间的id
   */
  updateNextRoomId(roomId, nextRoomId) {
    return this.model.where({
      _id: roomId,
      state: ROOM_STATE.IS_FINISH,
      nextRoomId: ''
    }).update({
      data: {
        nextRoomId
      }
    })
  }
}

export default new RoomModel()
