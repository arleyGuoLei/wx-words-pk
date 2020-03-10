Component({
  options: {
    multipleSlots: true
  },
  data: {
    show: false
  },
  methods: {
    hide() { this.setData({ show: false }) },
    show() { this.setData({ show: true }) }
  }
})
