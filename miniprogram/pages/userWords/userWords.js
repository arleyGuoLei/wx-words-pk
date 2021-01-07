import $ from './../../utils/Tool'
import log from './../../utils/log'
import router from '../../utils/router'
import { playPronunciation } from '../../utils/util'
import { userWordModel } from '../../model/index'

Page({
  data: {
    adState: $.store.get('adState'),
    listHeight: $.store.get('screenHeight') - $.store.get('CustomBar'),
    wordsList: [],
    refresh: false,
    page: 1,
    size: 0,
    total: 0,
    onBottom: false
  },
  onLoad() {
    this.getData(1)
  },
  onPullDownRefresh() {
    this.setData({ onBottom: false }, async () => {
      await this.getData(1)
      this.setData({ refresh: false })
    })
  },

  async onReachBottom() {
    const { data: { page, size, total } } = this
    const pageSize = Math.ceil(total / size)
    if (page < pageSize) {
      this.getData(page + 1)
    } else {
      this.setData({ onBottom: true })
    }
  },
  async getData(page) {
    $.loading('加载中...')
    const res = await $.callCloud('model_userWords_get', { page })
    $.hideLoading()
    const { result: { code, data } } = res
    if (code === 0) {
      let { data: { wordsList } } = this
      if (page === 1) { wordsList = data.list } else { wordsList = wordsList.concat(data.list) }
      if (data.total <= data.size) { this.setData({ onBottom: true }) }
      this.setData({ wordsList, page: data.page, size: data.size, total: data.total })
    } else {
      this.selectComponent('#errorMessage').show('获取失败, 请重试...', 2000, () => { router.toHome() })
    }
  },
  longpress(e) {
    const { index } = e.currentTarget.dataset
    const { data: { wordsList } } = this
    wx.vibrateShort()
    const key = `wordsList[${index}].del`
    const value = !wordsList[index].del
    this.setData({ [key]: value })
  },
  onTapLine() {
    this.selectComponent('#errorMessage').show('长按可以切换[ 删除单词 / 播放发音 ]哦... 设置中可以一键清空生词本')
  },
  onTapPlay(e) {
    const { word } = e.currentTarget.dataset
    playPronunciation(word)
  },
  onTapDel(e) {
    const self = this
    wx.showModal({
      title: '提示',
      content: '是否确定删除当前生词?',
      confirmText: '删除',
      confirmColor: '#E95F56',
      async success(res) {
        if (res.confirm) {
          const { data: { wordsList } } = self
          const { wordId, index } = e.currentTarget.dataset
          try {
            wordsList.splice(index, 1)
            self.setData({ wordsList })
            userWordModel.delete(wordId)
          } catch (error) {
            log.error(error)
            self.selectComponent('#errorMessage').show('删除失败, 请重试...')
          }
        }
      }
    })
  },
  onTapBack() { router.toHome() }
})
