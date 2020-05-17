<template>
  <div class="unconfirmed">
    <header>
      <h3>Need another confirmation email?</h3>
    </header>
<!--    <h5 class="h5 g-color-gray-dark-v1 mb-0">-->
<!--      <span class="g-color-red">Need another confirmation email?</span>-->
<!--      <button v-on:click="onResendConfirm()" type="button" class="btn btn-primary">Click here</button>-->
<!--    </h5>-->
  </div>
</template>

<script>
import store from '../../../store/store'

export default {
  name: 'Unconfirmed',
  data () {
    return {
      sharedState: store.state,
      user: ''
    }
  },
  methods: {
    getUser (id) {
      const path = `/users/${id}`
      this.$axios.get(path)
        .then((response) => {
          // handle success
          this.user = response.data
          console.log(this.user)
        })
        .catch((error) => {
          // handle error
          console.error(error)
        })
    },
    onResendConfirm () {
      const path = '/resend-confirm'
      const payload = {
        confirm_email_base_url: window.location.href.split('/', 4).join('/') + '/unconfirmed/?token='
      }
      this.$axios.post(path, payload)
        .then((response) => {
          // handle success
          this.$toasted.success(response.data.message, { icon: 'fingerprint' })
        })
        .catch((error) => {
          // handle error
          console.log(error.response.data)
          this.$toasted.error(error.response.data.message, { icon: 'fingerprint' })
        })
    },
    onConfirm (token) {
      this.$axios.get(`/confirm/${token}`)
        .then((response) => {
          // handle success
          this.$toasted.success(response.data.message, { icon: 'fingerprint' })
          // 更新 JWT
          window.localStorage.setItem('madblog-token', response.data.token)
          store.loginAction()
          // 路由跳转
          this.$router.push('/')
        })
        .catch((error) => {
          // handle error
          console.log(error.response.data)
          this.$toasted.error(error.response.data.message, { icon: 'fingerprint' })
        })
    }
  },
  created () {
    // 点击邮件中的链接后，确认账户
    // 疑惑：query获取不到路径的查询参数
    console.log(typeof this.$route.query.redirect)
    const st = this.$route.query.redirect
    const res = st.split('token=')[1]
    console.log(res)
    if (res) {
      this.onConfirm(res)
      console.log('ok')
    }

    // 未确认的用户，显示提示信息
    // eslint-disable-next-line camelcase
    const user_id = this.sharedState.user_id
    this.getUser(user_id)
  }
}
</script>
