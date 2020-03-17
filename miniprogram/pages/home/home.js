import $ from './../../utils/Tool'
import { userModel, bookModel, wordModel, roomModel } from './../../model/index'
import { getCombatSubjectNumber, SUBJECT_HAS_OPTIONS_NUMBER } from '../../utils/setting'
import { formatList } from '../../utils/util'
import router from './../../utils/router'

Page({
  data: {
    userInfo: {},
    bookList: []
  },
  /**
   * 好友对战或随机匹配没有房间的时候，创建单词PK房间
   * 1. 获取对局单词数目
   * 2. 生成随机单词
   * 3. 格式化随机单词，生成单词列表
   * 4. 创建房间
   */
  async createCombatRoom(isFriend = true) {
    try {
      $.loading('生成随机词汇中...')
      const { data: { userInfo: { bookId, bookDesc, bookName } } } = this
      const number = getCombatSubjectNumber()
      const { list: randomList } = await wordModel.getRandomWords(bookId, number * SUBJECT_HAS_OPTIONS_NUMBER)
      const wordList = formatList(randomList, SUBJECT_HAS_OPTIONS_NUMBER)
      $.loading('创建房间中...')
      const roomId = await roomModel.create(wordList, isFriend, bookDesc, bookName)
      $.hideLoading()
      router.push('combat', { roomId })
    } catch (error) {
      $.hideLoading()
      this.selectComponent('#createRoomFail').show()
    }
  },
  /**
   * 邀请好友对战
   */
  onChallengeFriend() {
    this.createCombatRoom(true)
  },
  /**
   * 随机匹配
   */
  async onRandomMatch() {
    try {
      $.loading('查找房间...')
      const { data: { userInfo: { bookDesc } } } = this
      const { data } = await roomModel.searchRoom(bookDesc)
      if (data.length === 0) {
        throw new Error('没有满足条件的房间')
      }
      const roomId = data[0]._id
      $.hideLoading()
      router.push('combat', { roomId })
    } catch (error) {
      this.createCombatRoom(false)
    }
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
    return {
      title: `❤ 来一起学习吧，轻松掌握【四六级/考研】必考单词 ~ 👏👏`,
      path: `/pages/home/home`,
      imageUrl: './../../images/share-default-bg.png'
    }
  }
})
