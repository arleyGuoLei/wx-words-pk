import $ from './../../utils/Tool'
import { userModel } from './../../model/index'
import { roomStateHandle, centerUserInfoHandle } from './utils'
import { ROOM_STATE } from '../../model/room'

const ROOM_STATE_READY = 'state'

async function initRoomInfo(data) {
  $.loading('初始化房间配置...')
  const { _id, isFriend, bookDesc, bookName, state, _openid, list } = data
  if (roomStateHandle.call(this, state)) {
    this.setData({
      roomInfo: {
        roomId: _id,
        isFriend,
        bookDesc,
        bookName,
        state,
        isHouseOwner: _openid === $.store.get('openid'),
        listLength: list.length
      },
      wordList: list
    })
    if (isFriend) { // 好友对战模式初始化房主的信息
      const { data } = await userModel.getUserInfo(_openid)
      const users = centerUserInfoHandle.call(this, data[0])
      this.setData({ users })
    }
  }
  $.hideLoading()
}

async function onRoomStateChange(updatedFields, doc) {
  const { state } = updatedFields
  console.log('log => : onRoomStateChange -> state', state)
  switch (state) {
    case ROOM_STATE.IS_READY:
      const { right: { openid } } = doc
      const { data } = await userModel.getUserInfo(openid)
      const users = centerUserInfoHandle.call(this, data[0])
      this.setData({ 'roomInfo.state': state, users })
      break
    case ROOM_STATE.IS_OK:
      if (typeof (updatedFields['right.openid']) !== 'undefined') { // 用户取消准备，退出房间
        const usersCancel = centerUserInfoHandle.call(this, {})
        this.setData({ 'roomInfo.state': state, users: usersCancel })
      }
  }
}

const watchMap = new Map()
watchMap.set('initRoomInfo', initRoomInfo)
watchMap.set(`update.${ROOM_STATE_READY}`, onRoomStateChange)

export async function handleWatch(snapshot) {
  const { type, docs } = snapshot
  if (type === 'init') { watchMap.get('initRoomInfo').call(this, docs[0]) } else {
    const { queueType = '', updatedFields = {} } = snapshot.docChanges[0]
    Object.keys(updatedFields).forEach(field => {
      const key = `${queueType}.${field}`
      watchMap.has(key) && watchMap.get(key).call(this, updatedFields, snapshot.docs[0])
    })
  }
}
