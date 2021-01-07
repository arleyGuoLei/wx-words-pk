Component({
  options: {
    multipleSlots: true
  },
  data: {
    show: false,
    messageText: '',
    showClose: true,
    mWidth: 500,
    contentWidth: 350
  },
  methods: {
    hide() { this.setData({ show: false, messageText: '', showClose: true }) },
    show(messageText = '', duration = 0, callback, mWidth = 500, contentWidth = 350) {
      this.setData({ show: true, messageText, mWidth, contentWidth })
      if (duration !== 0) {
        this.setData({ showClose: false })
        setTimeout(() => {
          this.hide()
          callback()
        }, duration)
      }
    }
  }
})
