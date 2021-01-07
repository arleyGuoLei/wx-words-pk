import router from '../../utils/router'
import { rpx2Px, dateFormat, getMonthDays } from '../../utils/util'
import $ from './../../utils/Tool'
import { userModel, signModel } from './../../model/index'
import { SIGN_WIN_NUMBER, SIGN_PVP_NUMBER } from './../../utils/setting'
const date = dateFormat('YYYY-mm-dd')
const nowYearMonth = dateFormat('YYYY-mm')

Page({
  data: {
    adState: $.store.get('adState'),
    todayDate: date,
    SIGN_WIN_NUMBER,
    SIGN_PVP_NUMBER,
    signSumNumber: '',
    todayPvpNumber: '',
    todayWinNumber: '',
    lastSignDate: '0000-00',
    todayPvpNumberPercent: 0,
    todayWinNumberPercent: 0,
    tabIndex: 0,
    endDate: nowYearMonth,
    cellSize: 0,
    daysColor: []
  },
  onLoad() {
    this.setData({ cellSize: rpx2Px(36) })
    this.getTodaySignData()
    this.getSign(nowYearMonth, false)
  },
  async getTodaySignData() {
    $.loading()
    try {
      const { data } = await userModel.getUserInfo($.store.get('openid'))
      if (data.length !== 0) {
        const { todayWinNumber = 0, todayPvpNumber = 0, signSumNumber = 0, lastSignDate = '0000-00', signDate = '0000-00' } = data[0]
        let _todayWinNumber = todayWinNumber
        let _todayPvpNumber = todayPvpNumber
        if (signDate !== date) {
          _todayWinNumber = 0
          _todayPvpNumber = 0
        }
        this.setData({
          signSumNumber,
          todayWinNumber: _todayWinNumber,
          todayPvpNumber: _todayPvpNumber,
          lastSignDate,
          todayPvpNumberPercent: Math.floor(_todayPvpNumber / SIGN_PVP_NUMBER * 100),
          todayWinNumberPercent: Math.floor(_todayWinNumber / SIGN_WIN_NUMBER * 100)
        })
      } else { throw new Error('get userinfo fail!') }
    } catch (error) {
      this.selectComponent('#errorMessage').show('获取失败, 请重试...', 2000, () => { router.toHome() })
    }
    $.hideLoading()
  },
  recoverStyle(year, month) {
    const daysNumber = getMonthDays(year, month)
    const daysColor = []
    for (let index = 0; index < daysNumber; index++) {
      daysColor.push({
        month: 'current',
        day: index + 1,
        color: '#ffffff'
      })
    }
    this.setData({
      daysColor
    })
  },
  async getSign(yearMonth = nowYearMonth, showLoading = true) {
    showLoading && $.loading()
    const year = yearMonth.split('-')[0]
    const month = yearMonth.split('-')[1]
    this.recoverStyle(year, month)
    const daysNumber = getMonthDays(year, month)
    const { signDays } = await signModel.getSign(yearMonth)
    const daysColor = []
    for (let index = 0; index < daysNumber; index++) {
      const obj = {
        month: 'current',
        day: index + 1,
        color: '#ffffff'
      }
      if (signDays.includes(index + 1)) {
        daysColor.push({
          ...obj,
          background: '#7ECDF7'
        })
      } else {
        daysColor.push(obj)
      }
    }
    this.setData({
      daysColor
    })
    showLoading && $.hideLoading()
  },
  onNextMonth(event) {
    this.onDateChange(event)
  },
  onPrevMonth(event) {
    this.onDateChange(event)
  },
  onDateChange(event) {
    const { detail: { currentYear, currentMonth } } = event
    this.getSign(`${currentYear}-${String(currentMonth).padStart(2, '0')}`)
  },
  onChangeTab(event) {
    const { currentTarget: { dataset: { index } } } = event
    this.setData({ tabIndex: Number(index) })
  },
  onTapBack() { router.pop() },
  onToRank() {
    router.push('ranking', { index: 2 })
  }
})
