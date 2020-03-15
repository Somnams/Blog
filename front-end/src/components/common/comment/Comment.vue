<template>
  <div id="message-form">
    <form @submit.prevent="onSubmitMessage"
          @reset.prevent="onResetMessage">
      <textarea v-model="MessageForm.body" cols="30" rows="10"
                placeholder="Please input your comment." class="MessageFormBody"></textarea>
      <small v-show="MessageForm.bodyError">{{MessageForm.bodyError}}</small>
      <div class="operation">
        <button class="icon-btn" type="submit">Submit</button>
        <button class="icon-btn" type="reset">Cancel</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'Comment',
  data () {
    return {
      MessageForm: {
        body: '',
        bodyError: null,
        errors: 0
      }
    }
  },
  methods: {
    onSubmitMessage (e) {
      this.MessageForm.errors = 0
      if (!this.MessageForm.body) {
        this.MessageForm.bodyError = 'Body is required.'
        this.MessageForm.errors++
      }
      if (this.MessageForm.errors > 0) {
        return false
      }
      const Form = this.MessageForm
      this.$emit('onSubmitMessage', Form)
      this.onResetMessage()
    },
    onResetMessage () {
      const tmpForm = {
        body: '',
        bodyError: null,
        errors: 0
      }
      this.MessageForm = tmpForm
      this.$emit('onResetMessage')
    }
  }
}
</script>

<style>
  #message-form {
    display: block;
    height: 160px;
    width: 80%;
  }
  .MessageFormBody {
    padding: 20px;
    width: 100%;
    border: 2px solid rgba(0, 0, 0, 0);
    height: 60px;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.1);
  }
  .MessageFormBody:focus {
    outline: none;
    background: rgba(0, 0, 0, 0);
    border: 2px solid rgba(255, 255, 255, 0.5);
    transition: all 0.5s ease-in-out;
  }
  textarea {
    color: #fff;
    font-size: 18px;
  }
  .operation {
    margin-top: 10px;
    float: right;
  }
  button {
    margin-left: 40px;
  }
</style>
