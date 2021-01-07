import {
  setBgmState,
  setPronunciationState,
  setIsAddUserWords,
  getBgmState,
  getPronunciationState,
  getIsAddUserWords
} from '../../../../utils/setting'

Component({
  data: {
    bgm: true,
    pronunciation: true,
    addUserWords: true
  },
  lifetimes: {
    attached() {
      this.setData({
        bgm: getBgmState(),
        pronunciation: getPronunciationState(),
        addUserWords: getIsAddUserWords()
      })
    }
  },
  methods: {
    onSwitchChange(e) {
      const {
        detail: { value: state },
        target: {
          dataset: { key }
        }
      } = e
      switch (key) {
        case 'bgm':
          setBgmState(state)
          break
        case 'pronunciation':
          setPronunciationState(state)
          break
        case 'addUserWords':
          setIsAddUserWords(state)
          break
      }
    }
  }
})
