import $ from './Tool'
import { dateFormat } from './util'

// 匿名用户默认信息
export const DEFAULT_USER_INFO = {
  avatarUrl: 'https://7072-prod-words-pk-1255907426.tcb.qcloud.la/word-pk-logo.jpeg',
  city: 'Yuxi',
  country: 'China',
  gender: 1,
  language: 'zh_CN',
  nickName: '单词天天斗(匿名)',
  province: 'Yunnan'
}

export const SIGN_WIN_NUMBER = 2 // 签到需要胜利的局数
export const SIGN_PVP_NUMBER = 5 // 签到需要对战的局数

const DEFAULT_PK_SUBJECT_NUMBER = 10 // 每局对战的默认词汇数量
export const PK_SUBJECTS_NUMBER = [5, 8, 10, 12, 15, 20] // 每局对战可选的词汇数目
export const SUBJECT_HAS_OPTIONS_NUMBER = 4 // 每一个题目有多少个选项

const DEFAULT_BGM_STATE = true // 默认播放背景音乐
const DEFAULT_PRONUNCIATION_STATE = true // 默认播放单词发音
const DEFAULT_IS_ADD_USERWORDS = true // 默认添加生词到生词本
const DEFAULT_AD_STATE = true // 默认广告状态
const DEFAULT_VIBRATE = true // 默认震动

// 存储到缓存中的key值 ↓
const SUBJECT_NUMBER = 'setting_subject_number'
const BGM_STATE = 'setting_bgm_state'
const PRONUNCIATION_STATE = 'setting_pronunciation_state'
const IS_ADD_USERWORDS = 'setting_addUserWords'
const AD_STATE = 'ad_state'
const VIBRATE_STATE = 'vibrate_state'
const TOAST_GITHUB = 'toast_github'
// 存储到缓存中的key值 ↑

// 活动限制局数 key ↓
const ACTIVITY_LOCAL_NUMBER = 'activity_local_number' // 本地局数限制，当前对局的局数
const ACTIVITY_LOCAL_DATE = 'activity_local_date' // 本地局数限制，写入的日期
// 活动限制局数 key 上

/**
 * 获取本地对战了的局数
 */
export const getLocalTimes = function() {
  const local = $.storage.get(ACTIVITY_LOCAL_NUMBER) || 0
  return local
}

/**
 * 设置本地对战局数
 * @param {Number} number 本地对战局数
 */
export const setLocalTimes = function(number) {
  $.storage.set(ACTIVITY_LOCAL_NUMBER, number)
  return number
}

export const getLocalDate = function() {
  return $.storage.get(ACTIVITY_LOCAL_DATE)
}

export const setLocalDate = function() {
  const now = dateFormat('YYYY-mm-dd')
  $.storage.set(ACTIVITY_LOCAL_DATE, now)
  return now
}

/**
 * 获取广告状态
 */
export const getADstate = function() {
  const state = $.storage.get(AD_STATE)
  if (typeof state !== 'boolean') {
    setADstate(DEFAULT_AD_STATE)
    return DEFAULT_AD_STATE
  }
  return state
}

export const setADstate = function(state = true) {
  if (typeof state === 'boolean') {
    $.storage.set(AD_STATE, state)
  }
}

/**
 * 获取每局对战的词汇数量，创房时使用
 */
export const getCombatSubjectNumber = function() {
  const number = $.storage.get(SUBJECT_NUMBER)
  if (typeof number !== 'number' || !PK_SUBJECTS_NUMBER.includes(number)) {
    setCombatSubjectNumber(DEFAULT_PK_SUBJECT_NUMBER)
    return DEFAULT_PK_SUBJECT_NUMBER
  }
  return number
}

/**
 * 设置每局对战的词汇数量
 */
export const setCombatSubjectNumber = function(number) {
  if (PK_SUBJECTS_NUMBER.includes(number)) {
    $.storage.set(SUBJECT_NUMBER, number)
  }
}

/**
 * 获取是否播放背景音乐
 */
export const getBgmState = function() {
  const check = $.storage.get(BGM_STATE)
  if (typeof check !== 'boolean') {
    setBgmState(DEFAULT_BGM_STATE)
    return DEFAULT_BGM_STATE
  }
  return check
}

/**
 * 设置是否播放背景音
 * @param {Boolean} state 背景音状态
 */
export const setBgmState = function(state) {
  if (typeof state === 'boolean') {
    $.storage.set(BGM_STATE, state)
  }
}

/**
 * 获取是否播放单词发音
 */
export const getPronunciationState = function() {
  const check = $.storage.get(PRONUNCIATION_STATE)
  if (typeof check !== 'boolean') {
    setPronunciationState(DEFAULT_PRONUNCIATION_STATE)
    return DEFAULT_PRONUNCIATION_STATE
  }
  return check
}

/**
 * 设置是否播放单词发音
 * @param {Boolean} state 状态
 */
export const setPronunciationState = function(state) {
  if (typeof state === 'boolean') {
    $.storage.set(PRONUNCIATION_STATE, state)
  }
}

/**
 * 获取是否添加生词到生词本
 */
export const getIsAddUserWords = function() {
  const check = $.storage.get(IS_ADD_USERWORDS)
  if (typeof check !== 'boolean') {
    setIsAddUserWords(DEFAULT_IS_ADD_USERWORDS)
    return DEFAULT_IS_ADD_USERWORDS
  }
  return check
}

/**
 * 设置是否添加生词到生词本
 * @param {Boolean} state 状态
 */
export const setIsAddUserWords = function(state) {
  if (typeof state === 'boolean') {
    $.storage.set(IS_ADD_USERWORDS, state)
  }
}

/**
 * 获取是否震动
 */
export const getIsVibrate = function() {
  const check = $.storage.get(VIBRATE_STATE)
  if (typeof check !== 'boolean') {
    setIsVibrate(DEFAULT_VIBRATE)
    return DEFAULT_VIBRATE
  }
  return check
}

/**
 * 设置是否震动
 * @param {Boolean} state 状态
 */
export const setIsVibrate = function(state) {
  if (typeof state === 'boolean') {
    $.storage.set(VIBRATE_STATE, state)
  }
}

/**
 * 是否弹窗github开源提示，只显示一次
 * return false => 不弹出
 *        true => 弹出
 */
export const getToastGithub = function() {
  const check = $.storage.get(TOAST_GITHUB)
  if (typeof check !== 'boolean' || check) {
    $.storage.set(TOAST_GITHUB, false)
    return true
  }
  return check
}
