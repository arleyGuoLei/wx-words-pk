import $ from './../../utils/Tool'

Component({
  options: {
    addGlobalClass: true,
    multipleSlots: true
  },
  data: {
    StatusBar: $.store.get('StatusBar'),
    CustomBar: $.store.get('CustomBar')
  }
})
