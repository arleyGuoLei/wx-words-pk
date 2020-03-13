Component({
  options: {
    multipleSlots: true
  },
  data: {
    show: false,
    messageText: '',
    showClose: true
  },
  methods: {
    hide() { this.setData({ show: false, messageText: '', showClose: true }) },
    show(messageText = '', duration = 0, callback) {
      this.setData({ show: true, messageText })
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
