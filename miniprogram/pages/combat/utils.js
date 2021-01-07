import { ROOM_STATE } from '../../model/room'
import router from './../../utils/router'
import { dateFormat } from '../../utils/util'

/**
 * 处理初始化监听时候的房间状态
 * @param {String} state 房间状态
 */
export function roomStateHandle(state) {
  let errText = ''
  switch (state) {
    case ROOM_STATE.IS_OK:
      return true
    case ROOM_STATE.IS_PK:
    case ROOM_STATE.IS_READY:
      errText = '房间处于对战中, 人数已满!'
      break
    case ROOM_STATE.IS_FINISH:
    case ROOM_STATE.IS_USER_LEAVE:
      errText = '该房间对战已结束'
      break
    default:
      errText = '房间发生错误, 请重试'
      break
  }
  this.selectComponent('#errorMessage').show(errText, 2000, () => { router.reLaunch() })
  return false
}

export function centerUserInfoHandle(userInfo) {
  const { data: { users } } = this
  const date = dateFormat('YYYY-mm-dd')
  const { avatarUrl, gender, nickName, grade, winNumber, pvpNumber, tipNumber = 0, bookDesc, bookId, bookName, signDate = date, todayPvpNumber = 0, todayWinNumber = 0, signSumNumber = 0, lastSignDate = '0000-00' } = userInfo

  const userObj = {
    avatarUrl,
    gender,
    nickName,
    grade,
    winRate: pvpNumber === 0 ? 0 : ((winNumber / pvpNumber) * 100).toFixed(2),
    tipNumber,
    bookDesc,
    bookId,
    bookName,
    signDate,
    todayPvpNumber,
    todayWinNumber,
    signSumNumber,
    lastSignDate
  }
  if (users.length === 0) {
    const newInfo = []
    newInfo.push(userObj)
    return newInfo
  } else if (users.length === 1) {
    const newInfo = [...users]
    newInfo.push(userObj)
    return newInfo
  } else if (users.length === 2) {
    const newInfo = [users[0]]
    return newInfo
  }
}
