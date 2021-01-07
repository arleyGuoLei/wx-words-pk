const loadingText = '···'

Component({
  options: {
    addGlobalClass: true
  },
  properties: {
    tipNumber: {
      type: String,
      value: loadingText,
      optionalTypes: [Number]
    },
    bookDesc: {
      type: String,
      value: loadingText
    },
    videoAdState: {
      type: Boolean
    }
  },
  methods: {
    onSelectBook() {
      this.triggerEvent('onSelectBook')
    },
    onTip() {
      this.selectComponent('#message').show()
    },
    onCreateVideoAd() {
      this.triggerEvent('onCreateVideoAd')
    }
  }
})
