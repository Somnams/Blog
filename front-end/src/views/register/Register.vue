<template>
    <div class="register">
      <h2 class="active">Register</h2>
      <form @submit.prevent="onSubmit">
        <input class="text" v-model="registerForm.username" type="text"
               value="" id="register_username" required/>
        <span>username</span>
        <br/>
        <input class="text" v-model="registerForm.password" type="text" value=""
               id="register_password" required minlength="8" />
        <span>password</span>
        <br/>
        <input class="text" name="email" v-model="registerForm.email"
               type="email" value=""
               id="register_email" required />
        <span>email</span>
        <button class="sign_btn" type="submit">Submit</button>
      </form>
      <div class="tip">
        <p class="tip-text">
          *We promise not to disclose your personal information to other websites.
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
        email: ''
      }
    }
  },
  methods: {
    onSubmit (e) {
      const path = '/users';
      const payload = {
        confirm_email_base_url: window.location.href.split('/', 4).join('/') + '/unconfirmed/?token=',
        username: this.registerForm.username,
        password: this.registerForm.password,
        email: this.registerForm.email
      };
      this.$axios.post(path, payload)
        .then(() => {
          this.$alert('info', {
            title: 'infoTitle',
            message: 'Please open your email to confirm your account.',
            autoClose: 5
          });
        })
        .catch(err => {
          const errMsg = err.response.data.message;
          for (const field in errMsg) {
            this.$alert('error', {
              title: field,
              message: errMsg[field],
              autoClose: false
            });
          }
        });
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

  label {
    display: inline-block;
    padding-top: 10px;
    padding-left: 5px;
  }

  .sign_btn {
    background-color: #948e99;
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
    background: #928bad;
    box-shadow: 0 0 6px #928bad;
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
    right: 30px;
    bottom: 10px;
    width: 300px;
  }
  .tip-text {
    opacity: 0.8;
    color: #e8cbc0;
  }
</style>
