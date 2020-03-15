<template>
    <div class="register">
      <h2 class="active">Register</h2>
      <form @submit.prevent="onSubmit">
        <input class="text" v-model="registerForm.username" type="text"
               value="" id="register_username" required/>
        <span>username</span><span v-show="registerForm.usernameError"
                                   class="invalid-feedback">{{ registerForm.usernameError }}</span>
        <br/>
        <input class="text" v-model="registerForm.password" type="text" value=""
               id="register_password" required minlength="8" />
        <span>password</span><span v-show="registerForm.passwordError"
                                   class="invalid-feedback">{{ registerForm.passwordError }}</span>
        <br/>
        <input class="text" name="email" v-model="registerForm.email"
               type="email" value=""
               id="register_email" required />
<!--               pattern="/^\w+((.\w+)|(-\w+))@[A-Za-z0-9]+((.|-)[A-Za-z0-9]+).[A-Za-z0-9]+$/" />-->
        <span>email</span><span v-show="registerForm.emailError"
                                class="invalid-feedback">{{ registerForm.emailError }}</span>
        <button class="sign_btn">Submit</button>
      </form>
      <div class="tip">
        <p class="tip-text">
          * 我们将不会向其他网站透露您的信息，注册一个账号～更方便留言讨论哦～
        </p>
      </div>
    </div>
</template>

<script>
export default {
  name: 'Register',
  data () {
    return {
      registerForm: {
        username: '',
        password: '',
        email: '',
        submitted: false,
        errors: 0,
        usernameError: null,
        passwordError: null,
        emailError: null
      }
    }
  },
  methods: {
    onSubmit (e) {
      this.registerForm.submitted = true
      this.registerForm.errors = 0

      if (!this.registerForm.username) {
        this.registerForm.usernameError = 'Username required.'
        this.registerForm.errors++
      } else {
        this.registerForm.usernameError = null
      }

      if (!this.registerForm.password) {
        this.registerForm.password = 'Password required.'
        this.registerForm.errors++
      } else {
        this.registerForm.passwordError = null
      }

      if (!this.registerForm.email) {
        this.registerForm.emailError = 'Email required.'
        this.registerForm.errors++
      } else if (!this.valid_email(this.registerForm.email)) {
        this.registerForm.emailError = 'Valid email required.'
      } else {
        this.registerForm.emailError = null
      }

      if (this.registerForm.errors > 0) {
        return false
      }

      const path = '/users'
      const payload = {
        username: this.registerForm.username,
        password: this.registerForm.password,
        email: this.registerForm.email
      }
      this.$axios.post(path, payload)
        .then((response) => {
          this.$router.push('/login')
        })
        .catch((error) => {
          for (const field in error.response.data.message) {
            // eslint-disable-next-line eqeqeq
            if (field === 'username') {
              this.registerForm.usernameError = error.response.data.message.username
            } else if (field === 'password') {
              this.registerForm.passwordError = error.response.data.message.password
            } else if (field === 'email') {
              this.registerForm.emailError = error.response.data.message.email
            }
          }
        })
    },
    valid_email (email) {
      // eslint-disable-next-line no-useless-escape
      const pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return pattern.test(email)
    }
  }
}
</script>

<style scoped>
  .register {
    position: relative;
    height: 560px;
    width: 405px;
    padding: 40px 40px;
    margin: 20px auto;
  }
  .tip{
    position: fixed;
    right: 50px;
    bottom: 30px;
    width: 200px;
  }
  .tip-text {
    opacity: 0.8;
    color: #e8cbc0;
  }
  form {
    padding-top: 30px;
  }

  .active {
    /*border-bottom: 2px solid #1161ed;*/
    border-bottom: 2px solid #928bad;
  }

  .nonactive {
    color: rgba(255, 255, 255, 0.2);
  }

  h2 {
    padding-left: 12px;
    font-size: 22px;
    text-transform: uppercase;
    padding-bottom: 5px;
    letter-spacing: 2px;
    display: inline-block;
    font-weight: 100;
  }

  h2:first-child {
    padding-left: 0px;
  }

  span {
    text-transform: uppercase;
    font-size: 12px;
    opacity: 0.8;
    display: inline-block;
    position: relative;
    top: -75px;
    transition: all 0.5s ease-in-out;
  }

  .text {
    width: 89%;
    padding: 10px 20px;
    display: block;
    height: 15px;
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.1);
    border: 2px solid rgba(255, 255, 255, 0);
    overflow: hidden;
    margin-top: 15px;
    transition: all 0.5s ease-in-out;
  }

  .text:focus {
    outline: 0;
    border: 2px solid rgba(255, 255, 255, 0.5);
    border-radius: 20px;
    background: rgba(0, 0, 0, 0);
  }

  .text:focus + span {
    opacity: 0.6;
  }

  input[type="text"],
  input[type="email"],
  input[type="password"] {
    font-family: 'Montserrat', sans-serif;
    color: #fff;
  }

  input {
    display: inline-block;
    padding-top: 20px;
    font-size: 14px;
  }

  h2,
  span,
  .custom-checkbox {
    margin-left: 20px;
  }

  .custom-checkbox {
    -webkit-appearance: none;
    background-color: rgba(255, 255, 255, 0.1);
    padding: 8px;
    border-radius: 2px;
    display: inline-block;
    position: relative;
    top: 6px;
  }

  .custom-checkbox:checked {
    background-color: rgba(17, 97, 237, 1);
  }

  .custom-checkbox:checked:after {
    content: '\2714';
    font-size: 10px;
    position: absolute;
    top: 1px;
    left: 4px;
    color: #fff;
  }

  .custom-checkbox:focus {
    outline: none;
  }

  label {
    display: inline-block;
    padding-top: 10px;
    padding-left: 5px;
  }

  .sign_btn {
    background-color: #928bad;
    font-family: 'Montserrat', sans-serif;
    color: #fff;
    width: 80%;
    padding: 10px 20px;
    display: block;
    height: 39px;
    border-radius: 20px;
    margin-top: 30px;
    transition: all 0.5s ease-in-out;
    border: none;
    text-transform: uppercase;
  }

  .sign_btn:hover {
    background: #948e99;
    box-shadow: 0px 4px 35px -5px #948e99;
    cursor: pointer;
  }

  .sign_btn:focus {
    outline: none;
  }

  hr {
    border: 1px solid rgba(255, 255, 255, 0.1);
    top: 85px;
    position: relative;
  }

  a {
    text-align: center;
    display: block;
    top: 120px;
    position: relative;
    text-decoration: none;
    color: rgba(255, 255, 255, 0.2);
  }
  .tip{
    position: fixed;
    right: 50px;
    bottom: 30px;
    width: 200px;
  }
  .tip-text {
    opacity: 0.8;
    color: #e8cbc0;
  }
</style>
