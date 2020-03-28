import $ from './../../utils/Tool'
import log from './../../utils/log'
import router from '../../utils/router'
import { userModel } from '../../model/index'

Page({
  data: {
    listHeight: $.store.get('screenHeight') - $.store.get('CustomBar') - 62,
    rankingList: [],
    myInfo: {},
    activeIndex: '-1'
  },
  onLoad({ index = 0 }) {
    const obj = { currentTarget: { dataset: { index: String(index) } } }
    this.tapRanking(obj)
  },
  tapRanking(e) {
    const { currentTarget: { dataset: { index } } } = e
    const { data: { activeIndex } } = this
    if (activeIndex !== index) {
      this.setData({ activeIndex: index })
      if (index === '1') {
        this.getWordChallengeRank()
      } else if (index === '0') {
        this.getGradeRank()
      } else if (index === '2') {
        this.getSignRank()
      }
    }
  },
  async getSignRank() {
    try {
      $.loading('加载中...')
      const res = await userModel.getSignRank()
      const { list, myInfo } = res
      this.setData({ rankingList: list, myInfo })
      $.hideLoading()
    } catch (error) {
      log.error(error)
      this.selectComponent('#errorMessage').show('获取失败, 请重试...', 2000, () => { router.toHome() })
    }
  },
  async getGradeRank() {
    try {
      $.loading('加载中...')
      const res = await userModel.getGradeRank()
      const { list, myInfo } = res
      this.setData({ rankingList: list, myInfo })
      $.hideLoading()
    } catch (error) {
      log.error(error)
      this.selectComponent('#errorMessage').show('获取失败, 请重试...', 2000, () => { router.toHome() })
    }
  },
  async getWordChallengeRank() {
    try {
      $.loading('加载中...')
      const res = await userModel.getWordChallengeRank()
      const { list, myInfo } = res
      this.setData({ rankingList: list, myInfo })
      $.hideLoading()
    } catch (error) {
      log.error(error)
      this.selectComponent('#errorMessage').show('获取失败, 请重试...', 2000, () => { router.toHome() })
    }
  },
  onTapBack() { router.toHome() },
  onShareAppMessage() {
    return {
      title: `❤ 来一起学习吧，轻松掌握【四六级/考研】必考单词 ~ 👏👏`,
      path: `/pages/home/home`,
      imageUrl: './../../images/share-default-bg.png'
    }
  }
})
