const defaultUserInfo = {
  avatarUrl: './../../../../images/combat-default-avatar.png',
  gender: 0,
  nickName: '神秘嘉宾',
  grade: 0,
  winRate: 0
}

Component({
  data: {
    usersInfo: []
  },
  properties: {
    users: {
      type: Array,
      value: [],
      observer([...usersInfo]) {
        if (usersInfo.length === 1) {
          usersInfo.push(defaultUserInfo)
        }
        this.setData({ usersInfo })
      }
    }
  },
  methods: {

  }
})
