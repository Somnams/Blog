<template>
    <div class="page">
      <header>
        <router-link :to="{ path: '/' }" class="home-icon" title="Home"></router-link>
      </header>
      <div class="main-content">
        <div class="reset-password">
          <h1>Reset Your Password</h1>
          <div>
            <form @submit.prevent="onSubmit" class="reset-form">
              <label for="email"><h3>Email Address:</h3></label>
              <input type="email" v-model="resetPasswordForm.email" id="email" class="reset-in" required>
              <small class="error-tip">{{resetPasswordForm.emailError}}</small>
              <button type="submit" class="common-btn reset-btn">Reset Password</button>
            </form>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
export default {
  name: 'ResetPasswordRequest',
  data () {
    return {
      resetPasswordForm: {
        email: '',
        errors: 0,
        emailError: null
      }
    }
  },
  methods: {
    onSubmit (e) {
      this.resetPasswordForm.errors = 0
      if (!this.resetPasswordForm.email) {
        this.resetPasswordForm.errors++
        this.resetPasswordForm.emailError = 'Email required'
      } else if (!this.validEmail(this.resetPasswordForm.email)) {
        this.resetPasswordForm.errors++
        this.resetPasswordForm.emailError = 'Valid email required'
      } else {
        this.resetPasswordForm.emailError = null
      }

      if (this.resetPasswordForm.errors > 0) {
        return false
      }
      const path = '/reset-password-request'
      const payload = {
        confirm_email_base_url: window.location.href.split('/', 4).join('/') + 'reset-password/?token=',
        email: this.resetPasswordForm.email
      }
      this.$axios.post(path, payload)
        .then((res) => {
          this.$toasted.success(res.data.message)
          this.$router.push('/login')
        })
        .catch((err) => {
          console.log(err)
          this.$toasted.error(err.response.data.message)
        })
    },
    validEmail (email) {
      // eslint-disable-next-line no-useless-escape
      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return re.test(email)
    }
  }
}
</script>
