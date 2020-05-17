<template>
    <div class="page">
      <nav-bar class="nav-bar"/>
      <header>
        <h2>Change Your password</h2>
      </header>
      <div class="main-content edit-content">
        <div>
          <form @submit.prevent="onSubmitChange" class="edit-form">
            <div class="edit-clo">
              <label for="oldPassword" class="edit-label">oldPassword</label>
              <input type="text" v-model="changePasswordForm.oldPassword" id="oldPassword" required class="edit-input">
            </div>
            <div class="edit-clo">
              <label for="newPassword" class="edit-label">newPassword</label>
              <input type="text" v-model="changePasswordForm.newPassword" id="newPassword" required class="edit-input">
              <small class="error-tip" v-show="changePasswordForm.newPasswordError">{{changePasswordForm.newPasswordError}}</small>
            </div>
            <button type="submit" class="common-btn edit-btn">Submit</button>
          </form>
        </div>
      </div>
    </div>
</template>

<script>
import NavBar from '../../../../components/common/nav/NavBar'
export default {
  name: 'Account',
  components: {
    NavBar
  },
  data () {
    return {
      changePasswordForm: {
        oldPassword: '',
        newPassword: '',
        errors: 0,
        oldPasswordError: null,
        newPasswordError: null
      }
    }
  },
  methods: {
    onSubmitChange (e) {
      this.changePasswordForm.errors = 0
      if (!this.changePasswordForm.oldPassword) {
        this.changePasswordForm.errors++
        this.changePasswordForm.oldPasswordError = 'required'
      } else {
        this.changePasswordForm.oldPasswordError = null
      }
      if (!this.changePasswordForm.newPassword) {
        this.changePasswordForm.errors++
        this.changePasswordForm.newPasswordError = 'required'
      } else {
        this.changePasswordForm.newPasswordError = null
      }
      if (this.changePasswordForm.errors > 0) {
        return false
      } else if (this.changePasswordForm.oldPassword === this.changePasswordForm.newPassword) {
        this.changePasswordForm.newPasswordError = 'cannot same with old password'
        return false
      }

      const path = '/update-password'
      const payload = {
        old_password: this.changePasswordForm.oldPassword,
        new_password: this.changePasswordForm.newPassword
      }
      this.$axios.post(path, payload)
        .then((res) => {
          this.$toasted.success('Change success', { icon: 'fingerprint' })
          this.$router.push({ name: 'Login' })
        })
        .catch((err) => {
          console.error(err)
        })
    }
  }
}
</script>

<style scoped>
  .edit-content {
    clear: both;
    top: 50px;
  }
  .edit-form {
    width: 60%;
  }
  .edit-clo {
    position: relative;
    display: flex;
    margin: 30px;
    width: 100%;
  }
  .error-tip {
    position: absolute;
    top: 50px;
    right: 0;
  }
  .edit-label {
    font-size: 20px;
    padding: 5px;
    width: 160px;
    text-align: center;
    height: 40px;
  }
  .edit-input {
    padding: 10px;
    width: 80%;
  }
  .edit-btn {
    width: 160px;
    margin-top: 30px;
  }
</style>
