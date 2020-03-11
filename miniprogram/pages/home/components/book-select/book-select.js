Component({
  options: {
    addGlobalClass: true
  },
  properties: {
    bookList: {
      type: Array,
      value: []
    }
  },
  data: {
    show: false
  },
  methods: {
    show() { this.setData({ show: true }) },
    hide() { this.setData({ show: false }) },
    onChangeBook(e) {
      const { currentTarget: { dataset: { bookId, name, desc } } } = e
      this.triggerEvent('onChangeBook', { bookId, name, desc })
      this.hide()
    }
  }
})
