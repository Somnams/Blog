  <template>
    <div class="page">
<!--      <header>-->
<!--        <router-link :to="{path: '/'}">home</router-link>-->
<!--      </header>-->
<!--      <div class="main-content">-->
<!--        reset your password-->
<!--        <div class="reset-form"></div>-->
<!--      </div>-->
      <header>
        <router-link :to="{ path: '/' }" class="home-icon" title="Home"></router-link>
      </header>
      <div class="main-content">
        <div class="reset-password">
          <h1>Reset Your Password</h1>
          <div>
            <form @submit.prevent="onSubmit" class="reset-form">
              <label for="email"><h3>Email Address:</h3></label>
              <input type="email" v-model="resetEmail" id="email" class="reset-in" required>
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
      resetEmail: '',
      resetPasswordForm: {}
    }
  },
  methods: {
    onSubmit(e) {
      const path = '/reset-password-request';
      const payload = {
        confirm_email_base_url: window.location.href.split('/', 4).join('/') + 'reset-password/?token=',
        email: this.resetEmail
      };

      this.$axios.post(path, payload)
        .then(res => {
          this.$alert('success', {
            title: 'SUCCESS',
            message: res.data.message
          });
        })
        .catch(err => {
          this.$alert('error', {title: 'ERROR', message: err.response.data.message});
        });
    }
  }
}
</script>

