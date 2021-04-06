<template>
  <div class="page">
    <header>
      <router-link :to="{ path: '/' }" class="home-icon" title="Home"></router-link>
    </header>
    <div class="main-content">
      <div class="reset-password">
        <h1>Reset Your Password</h1>
        <form @submit.prevent="onSubmit" class="reset-form">
          <label for="password"><h3>New Password</h3></label>
          <input type="password"
                 v-model="resetPasswordForm.password"
                 id="password" placeholder="" class="reset-in" required>
          <small v-show="resetPasswordForm.passwordError" class="error-tip">{{ resetPasswordForm.passwordError }}</small>
          <button type="submit" class="common-btn reset-btn">Reset Password</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ResetPassword', // this is the name of the component
  data () {
    return {
      resetPasswordForm: {
        password: '',
        errors: 0, // 表单是否在前端验证通过，0 表示没有错误，验证通过
        passwordError: null
      }
    }
  },
  methods: {
    onSubmit (e) {
      this.resetPasswordForm.errors = 0 // 重置
      if (!this.resetPasswordForm.password) {
        this.resetPasswordForm.errors++
        this.resetPasswordForm.passwordError = 'Password required.'
      } else {
        this.resetPasswordForm.passwordError = null
      }
      if (this.resetPasswordForm.errors > 0) {
        // 表单验证没通过时，不继续往下执行，即不会通过 axios 调用后端API
        return false
      }
      const token = this.$route.query.token
      const path = `/reset-password/${token}`
      const payload = {
        password: this.resetPasswordForm.password
      }
      this.$axios.post(path, payload)
        .then((response) => {
          // handle success
          this.$toasted.success(response.data.message, { icon: 'fingerprint' });
          this.$router.push('/login');
        })
        .catch((error) => {
          // handle error
          console.log(error.response.data)
          this.$toasted.error(error.response.data.message, { icon: 'fingerprint' })
        })
    }
  }
}
</script>
