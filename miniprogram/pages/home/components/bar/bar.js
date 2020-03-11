const loadingText = '···'

Component({
  properties: {
    tipNumber: {
      type: String,
      value: loadingText,
      optionalTypes: [Number]
    },
    bookDesc: {
      type: String,
      value: loadingText
    }
  },
  methods: {
    onSelectBook() {
      this.triggerEvent('onSelectBook')
    },
    onTip() {
      this.selectComponent('#message').show()
    }
  }
})
