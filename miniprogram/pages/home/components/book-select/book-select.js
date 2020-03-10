Component({
  options: {
    addGlobalClass: true
  },
  properties: {
  },
  data: {
    show: false,
    bookList: [
      {
        id: 'CET4',
        title: '四级核心词 『CET4』',
        wordsNumber: 1162,
        peopleNumber: 0,
        image: './../../../../images/book-CET4.png'
      },
      {
        id: 'CET6',
        title: '六级核心词 『CET6』',
        wordsNumber: 1228,
        peopleNumber: 0,
        image: './../../../../images/book-CET6.png'
      },
      {
        id: 'high',
        title: '高考大纲词汇 『高考』',
        wordsNumber: 3668,
        peopleNumber: 0,
        image: './../../../../images/book-high.png'
      },
      {
        id: 'kaoYan',
        title: '考研必考词 『考研』',
        wordsNumber: 1341,
        peopleNumber: 0,
        image: './../../../../images/book-kaoYan.png'
      },
      {
        id: 'middle',
        title: '中考大纲词 『中考』',
        wordsNumber: 1420,
        peopleNumber: 0,
        image: './../../../../images/book-middle.png'
      },
      {
        id: 'primary',
        title: '小学词汇 『小学』',
        wordsNumber: 611,
        peopleNumber: 0,
        image: './../../../../images/book-primary.png'
      },
      {
        id: 'random',
        title: '随机所有词汇 『随机』',
        wordsNumber: 9430,
        peopleNumber: '1万+',
        image: './../../../../images/book-random.png'
      }
    ]
  },
  methods: {
    show() { this.setData({ show: true }) },
    hide() { this.setData({ show: false }) }
  }
})
