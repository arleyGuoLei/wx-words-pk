import router from '../../../../utils/router'
import { previewAdmire } from '../../../../utils/util'

Component({
  methods: {
    onZan() {
      previewAdmire()
    },
    onToRanking() {
      router.push('ranking')
    }
  }
})
