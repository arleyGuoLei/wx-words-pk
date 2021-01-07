import $ from './../../utils/Tool'
import { userModel, roomModel, activityModel } from './../../model/index'
import { roomStateHandle, centerUserInfoHandle } from './utils'
import { ROOM_STATE } from '../../model/room'
import { sleep } from '../../utils/util'
import router from './../../utils/router'

const ROOM_STATE_SERVER = 'state'
const LEFT_SELECT = 'left.gradeSum'
const RIGHT_SELECT = 'right.gradeSum'
const NEXT_ROOM = 'nextRoomId'

function initActivityIds(bookDesc) {
  activityModel.getActivityIdsByBookDesc(bookDesc)
    .then(({ data }) => {
      this.setData({
        activityIds: data.map(item => ({ id: item._id, limit: item.gameLimit }))
      })
    })
}

async function initRoomInfo(data) {
  $.loading('初始化房间配置...')
  if (data) {
    const { _id, isFriend, bookDesc, bookName, state, _openid, list, isNPC } = data
    if (roomStateHandle.call(this, state)) {
      const isHouseOwner = _openid === $.store.get('openid')
      initActivityIds.call(this, bookDesc)
      this.setData({
        roomInfo: {
          roomId: _id,
          isFriend,
          bookDesc,
          bookName,
          state,
          isHouseOwner,
          isNPC,
          listLength: list.length
        },
        wordList: list
      })
      // 无论是不是好友对战，都先初始化房主的用户信息
      const { data } = await userModel.getUserInfo(_openid)
      const users = centerUserInfoHandle.call(this, data[0])
      this.setData({ users })
      if (!isHouseOwner && !isFriend) { // 如果是随机匹配且不是房主 => 自动准备
        await roomModel.userReady(_id)
      }
    }
    $.hideLoading()
  } else {
    $.hideLoading()
    this.selectComponent('#errorMessage').show('对战已被解散 ~', 2000, () => { router.reLaunch() })
  }
}

function npcSelect() {
  this._npcSelect = false
  this._npcTimer = setTimeout(async () => { await this.npcSelect() }, 2300 + Math.random() * 1200)
}

async function handleRoomStateChange(updatedFields, doc) {
  const { state } = updatedFields
  const { isNPC } = doc
  console.log('log => : onRoomStateChange -> state', state)
  switch (state) {
    case ROOM_STATE.IS_READY:
      const { right: { openid } } = doc
      const { data } = await userModel.getUserInfo(openid)
      const users = centerUserInfoHandle.call(this, data[0])
      this.setData({ 'roomInfo.state': state, users, 'roomInfo.isNPC': isNPC })
      // 判断当前用户如果是房主 且 模式为随机匹配 => 800ms后开始对战
      const { data: { roomInfo: { isHouseOwner, isFriend, roomId } } } = this
      if (!isFriend && isHouseOwner) {
        setTimeout(async () => {
          await roomModel.startPK(roomId)
        }, 800)
      }
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
      isNPC && npcSelect.call(this.selectComponent('#combatComponent'))
      break
    case ROOM_STATE.IS_USER_LEAVE:
      this.selectComponent('#errorMessage').show('对方逃离, 提前结束对战...', 2000, () => {
        this.setData({ 'roomInfo.state': ROOM_STATE.IS_FINISH }, () => {
          this.bgm && this.bgm.pause()
          this.selectComponent('#combatFinish').calcResultData()
          this.showAD()
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
    this.selectComponent('#combatComponent') && this.selectComponent('#combatComponent').getProcessGrade()
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
        this.selectComponent('#combatComponent').init()
        this.setData({ listIndex: index + 1 }, () => {
          this.selectComponent('#combatComponent').playWordPronunciation()
        })
        isNPC && npcSelect.call(this.selectComponent('#combatComponent'))
      } else {
        this.setData({ 'roomInfo.state': ROOM_STATE.IS_FINISH }, () => {
          this.bgm && this.bgm.pause()
          this.selectComponent('#combatFinish').calcResultData()
          this.showAD()
        })
      }
    }
  })
}

function handleNextRoom(updatedFields) {
  const { nextRoomId } = updatedFields
  if (nextRoomId !== '') {
    this.setData({ nextRoomId })
  }
}

function removeRoom() {
  this.selectComponent('#errorMessage').show('房主逃离, 房间即将解散...', 2000, () => {
    router.toHome()
  })
}

const watchMap = new Map()
watchMap.set('initRoomInfo', initRoomInfo)
watchMap.set(`update.${ROOM_STATE_SERVER}`, handleRoomStateChange)
watchMap.set(`update.${LEFT_SELECT}`, handleOptionSelection)
watchMap.set(`update.${RIGHT_SELECT}`, handleOptionSelection)
watchMap.set(`update.${NEXT_ROOM}`, handleNextRoom)

export async function handleWatch(snapshot) {
  const { type, docs } = snapshot
  if (type === 'init') { watchMap.get('initRoomInfo').call(this, docs[0]) } else {
    const { queueType = '', updatedFields = {} } = snapshot.docChanges[0]
    if (queueType === 'dequeue') { return removeRoom.call(this) }
    Object.keys(updatedFields).forEach(field => {
      const key = `${queueType}.${field}`
      watchMap.has(key) && watchMap.get(key).call(this, updatedFields, snapshot.docs[0])
    })
  }
}
