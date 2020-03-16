import $ from './../../utils/Tool'
import { userModel } from './../../model/index'
import { roomStateHandle, centerUserInfoHandle } from './utils'
import { ROOM_STATE } from '../../model/room'
import { sleep } from '../../utils/util'

const ROOM_STATE_SERVER = 'state'
const LEFT_SELECT = 'left.gradeSum'
const RIGHT_SELECT = 'right.gradeSum'

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

async function handleRoomStateChange(updatedFields, doc) {
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
      break
    case ROOM_STATE.IS_PK:
      this.initTipNumber()
      this.setData({ 'roomInfo.state': state })
      this.playBgm()
      break
    case ROOM_STATE.IS_USER_LEAVE:
      this.selectComponent('#errorMessage').show('对方逃离, 提前结束对战...', 2000, () => {
        this.setData({ 'roomInfo.state': ROOM_STATE.IS_FINISH }, () => {
          this.bgm && this.bgm.pause()
          this.selectComponent('#combatFinish').calcResultData()
        })
      })
      break
  }
}

async function handleOptionSelection(updatedFields, doc) {
  const { left, right, isNPC } = doc
  this.setData({
    left,
    right
  }, async () => {
    this.selectComponent('#combatComponent').getProcessGrade()
    const re = /^(left|right)\.grades\.(\d+)\.index$/ // left.grades.1.index
    let updateIndex = -1
    for (const key of Object.keys(updatedFields)) {
      if (re.test(key)) {
        updateIndex = key.match(re)[2] // 当前选择是的第几个题目的index(选择的是第几题的答案)
        break
      }
    }
    if (updateIndex !== -1 && typeof left.grades[updateIndex] !== 'undefined' &&
    typeof right.grades[updateIndex] !== 'undefined') { // 两方的这个题目都选择完了，需要切换下一题
      this.selectComponent('#combatComponent').changeBtnFace(updateIndex) // 显示对方的选择结果
      const { data: { listIndex: index, roomInfo: { listLength } } } = this
      await sleep(1200)
      if (listLength !== index + 1) { // 题目还没结束，切换下一题
        // TODO: NPC自动选择下一题初始化
        this.setData({ listIndex: index + 1 }, () => {
          this.selectComponent('#combatComponent').init()
        })
      } else {
        this.setData({ 'roomInfo.state': ROOM_STATE.IS_FINISH }, () => {
          this.bgm && this.bgm.pause()
          this.selectComponent('#combatFinish').calcResultData()
        })
      }
    }
  })
}

const watchMap = new Map()
watchMap.set('initRoomInfo', initRoomInfo)
watchMap.set(`update.${ROOM_STATE_SERVER}`, handleRoomStateChange)
watchMap.set(`update.${LEFT_SELECT}`, handleOptionSelection)
watchMap.set(`update.${RIGHT_SELECT}`, handleOptionSelection)

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
