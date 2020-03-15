<template>
  <div id="message">
    <comment @onSubmitMessage="onSubmitMessage"
             @onResetMessage="onResetMessage"/>
    {{user.username}}
  </div>
</template>

<script>
import store from '../../../../store/store'
import Comment from '../../../../components/common/comment/Comment'
export default {
  name: 'Message',
  components: {
    Comment
  },
  data () {
    return {
      sharedState: store.state,
      user: '',
      MessageForm: {
        body: '',
        bodyError: null,
        error: 0
      }
    }
  },
  methods: {
    getUser (id) {
      const path = `/users/${id}`
      this.$axios.get(path)
        .then((res) => {
          this.user = res.data
          console.log(this.user)
        })
        .catch((error) => {
          console.error(error)
        })
    },
    onSubmitMessage (Form) {
      const path = '/messages/'
      const payload = {
        body: Form.body,
        recipient_id: this.user.id
      }
      this.$axios.post(path, payload)
        .then((res) => {
          this.$toasted.success(`Success send the private message to ${this.user.username}`)
        })
        .catch((error) => {
          console.error(error)
        })
    },
    onResetMessage () {
      console.log('rest')
    }
  },
  created () {
    // this.getUserHistoryMessage(this.sharedState.user_id)
  },
  // beforeRouteUpdate (to, from, next) {
  //   next()
  //   console.log(to)
  //   console.log(this.user)
  //   console.log(from)
  // },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.getUser(from.params.id)
    })
  }
}
</script>

<style scoped>

</style>
