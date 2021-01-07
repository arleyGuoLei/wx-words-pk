import router from '../../../../utils/router'
import $ from './../../../../utils/Tool'

Component({
  options: {
    multipleSlots: true,
    addGlobalClass: true
  },
  properties: {
    rank: {
      type: String,
      value: '...'
    }
  },
  data: {
    show: false,
    type: 'share',
    adState: $.store.get('adState')
  },
  methods: {
    hide() { this.setData({ show: false, type: '' }) },
    show(type = 'share') {
      this.setData({ show: true, type })
    },
    onHome() { router.toHome() },
    onAgain() { this.triggerEvent('onAgain') },
    onShowVideoAd() {
      this.triggerEvent('onShowVideoAd')
    }
  }
})
