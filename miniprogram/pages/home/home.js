import $ from './../../utils/Tool'
import { userModel, bookModel } from './../../model/index'

Page({
  data: {
    userInfo: {},
    bookList: []
  },
  /**
   * 获取页面服务端数据
   */
  async getData() {
    $.loading()
    const userInfo = await userModel.getOwnInfo()
    const bookList = await bookModel.getInfo()
    this.setData({ userInfo, bookList })
    $.hideLoading()
  },
  /**
   * 弹出单词书选择卡片列表
   */
  onSelectBook() {
    this.selectComponent('#book-select').show()
  },
  /**
   * 用户选择了一本单词书
   * @param {Obejct} data 子组件传出来的数据
   */
  async onChangeBook(data) {
    const { detail: { name, desc, bookId } } = data
    const { data: { userInfo: { bookId: oldBookId } } } = this
    if (oldBookId !== bookId) {
      $.loading('正在改变单词书...')
      const bookList = await bookModel.changeBook(bookId, oldBookId)
      this.setData({
        'userInfo.bookId': bookId,
        'userInfo.bookName': name,
        'userInfo.bookDesc': desc,
        bookList
      })
      $.hideLoading()
    }
  },
  /**
   * 下拉刷新
   */
  async onPullDownRefresh() {
    await this.getData()
    wx.stopPullDownRefresh()
  },
  async onLoad() {
    this.getData()
  },
  onShareAppMessage() {

  }
})
