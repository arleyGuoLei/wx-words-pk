Component({
  options: {
    addGlobalClass: true
  },
  properties: {
    activityList: {
      type: Array,
      value: []
    }
  },
  methods: {
    onToActivity(e) {
      const { currentTarget: { dataset: { id } } } = e
      this.triggerEvent('onToActivity', { id })
    }
  }
})
