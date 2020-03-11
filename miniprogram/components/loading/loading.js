Component({
  options: {
    addGlobalClass: true
  },
  data: {
    show: false,
    mask: false,
    loadingText: '加载中···'
  },
  methods: {
    show(loadingText, mask) {
      this.setData({ loadingText, show: true, mask })
    },
    hide() {
      this.setData({ show: false, mask: false })
    }
  }
})
