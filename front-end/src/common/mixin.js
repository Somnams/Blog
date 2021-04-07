import Confirm from '@/components/common/confirm/Confirm';

export const confirmMiXin = {
  components: {
    Confirm
  },
  props: {
    content: {
      type: String,
      default: 'delete sure?'
    }
  },
  data () {
    return {
      promiseStatus: null,
      confirmShow: false
    }
  },
  methods: {
    confirm () {
      const _this = this
      this.confirmShow = true
      return new Promise(function (resolve, reject) {
        _this.promiseStatus = { resolve, reject }
      })
    },
    noClick () {
      this.confirmShow = false
      this.promiseStatus && this.promiseStatus.reject()
    },
    yesClick () {
      this.confirmShow = false
      this.promiseStatus && this.promiseStatus.resolve()
    }
  }
}
