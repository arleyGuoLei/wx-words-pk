import $ from './../../utils/Tool'
import router from '../../utils/router'
import { activityModel, userActivityModel } from '../../model/index'
import log from './../../utils/log'
import { rpx2Px, throttle } from '../../utils/util'

Page({
  data: {
    listHeight: $.store.get('screenHeight') - $.store.get('CustomBar') - rpx2Px(470),
    rankingList: [],
    myInfo: {},
    ruleHtmlSnip: '',
    chatCodeImg: '',
    chatDesc: '',
    title: '',
    headImg: '',
    headText: '',
    shareText: '',
    id: '',
    status: '',
    inProgress: false,
    page: 1,
    size: 0,
    total: 0,
    onBottom: false,
    todaySurplus: 0
  },
  onLoad(options) {
    const { activityId } = options
    this.getData(activityId)
  },
  onReachBottom: throttle(async function() {
    const { data: { page, size, total, id } } = this
    const pageSize = Math.ceil(total / size)
    if (page < pageSize) {
      this.getListData(id, page + 1)
    } else {
      this.setData({ onBottom: true })
    }
  }, 1000),
  async getListData(id, page) {
    if (page !== 1) {
      $.loading('加载中...')
      const { data } = await userActivityModel.getGradeRank(id, page)
      const { data: { rankingList } } = this
      this.setData({ rankingList: rankingList.concat(data.list), page })
      $.hideLoading()
    }
  },
  async getData(id) {
    try {
      $.loading('加载中...')
      const [{ data: activityDetail }, { list, myInfo, data }] = await Promise.all([
        activityModel.getDetail(id),
        userActivityModel.getGradeRank(id)
      ])
      const { title, rule, headImg, headText, chatCodeImg, chatDesc, shareText, inProgress, _id, gameLimit } = activityDetail[0]
      if (data.total <= data.size) { this.setData({ onBottom: true }) }
      const todaySurplus = activityModel.getTodaySurplus(gameLimit)
      this.setData({
        title,
        ruleHtmlSnip: rule,
        headImg,
        headText,
        chatCodeImg,
        chatDesc,
        shareText,
        status: inProgress ? '活动中' : '不在活动时间',
        inProgress,
        id: _id,
        rankingList: list,
        myInfo,
        size: data.size,
        total: data.total,
        todaySurplus: todaySurplus > 0 ? todaySurplus : 0
      })
      $.hideLoading()
    } catch (error) {
      log.error(error)
      this.selectComponent('#errorMessage').show('获取失败, 请重试...', 2000, () => { this.onTapBack() })
    }
  },
  onTapBack() { router.toHome() },
  onShareAppMessage() {
    const { data: { id, shareText = '' } } = this
    return {
      title: shareText !== '' ? shareText : '❤ 来一起学习吧，轻松掌握【四六级/考研】必考单词 ~ 👏👏',
      path: `/pages/activity/activity?activityId=${id}`,
      imageUrl: './../../images/activity_share_default_bg.jpg'
    }
  },
  onRule() {
    this.selectComponent('#message').show('', 0, () => {}, 620, 560)
  },
  onChat() {
    this.selectComponent('#chatMessage').show('', 0, () => {}, 620, 560)
  }
})
