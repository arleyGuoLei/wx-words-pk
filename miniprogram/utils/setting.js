import $ from './Tool'

export const DEFAULT_PK_SUBJECT_NUMBER = 10 // 每局对战的默认词汇数量
export const PK_SUBJECTS_NUMBER = [8, 10, 12, 15, 20] // 每局对战可选的词汇数目
export const SUBJECT_HAS_OPTIONS_NUMBER = 4 // 每一个题目有多少个选项

const SUBJECT_NUMBER = 'setting_subject_number'

/**
 * 获取每局对战的词汇数量，创房时使用
 */
export const getCombatSubjectNumber = function() {
  const number = $.storage.get(SUBJECT_NUMBER)
  if (typeof number !== 'number') {
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
