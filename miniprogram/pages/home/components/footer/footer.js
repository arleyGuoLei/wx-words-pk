import router from '../../../../utils/router'
import { previewAdmire } from '../../../../utils/util'
import { getToastGithub } from '../../../../utils/setting'

Component({
  methods: {
    onZan() {
      previewAdmire()
    },
    onToRanking() {
      router.push('ranking')
    },
    onGithub() {
      this.selectComponent('#message').show()
    },
    onCopyWechat() {
      wx.setClipboardData({ data: 'arley_GuoLei' })
      // wx.setClipboardData({ data: 'https://github.com/arleyGuoLei/wx-words-pk' })
    },
    showGithubAuto() {
      getToastGithub() && this.onGithub()
    }
  }
})
