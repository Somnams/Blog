<template>
  <transition name="fade">
    <div id="reply" v-if="replyShow">
      <div id="reply-content">
        <form @submit.prevent="onSubmitReply" @reset.prevent="onRestReply">
          <textarea v-model="replyForm.body" cols="30" rows="10"
                    placeholder="Please input your comment." class="replay-form"></textarea>
          <small v-show="replyForm.bodyError">{{replyForm.bodyError}}</small>
          <div class="operation">
            <button class="reply-btn" type="submit">Submit</button>
            <button class="reply-btn" type="reset">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'Reply',
  data () {
    return {
      Form: '',
      replyShow: false,
      replyForm: {
        body: '',
        errors: 0,
        bodyError: null
      }
    }
  },
  methods: {
    confirm () {
      const _this = this
      this.replyShow = true
      return new Promise(function (resolve, reject) {
        _this.promiseStatus = { resolve, reject }
      })
    },
    onSubmitReply (e) {
      this.replyShow = false
      this.promiseStatus && this.promiseStatus.resolve()
      this.replyForm.errors = 0
      if (!this.replyForm.body) {
        this.replyForm.bodyError = 'Body is required.'
        this.replyForm.errors++
      }
      if (this.replyForm.errors > 0) {
        return false
      }
      this.Form = this.replyForm
      this.onRestReply()
    },
    onRestReply () {
      this.replyShow = false
      this.promiseStatus && this.promiseStatus.reject()
      const tmpForm = {
        body: '',
        bodyError: null,
        errors: 0
      }
      this.replyForm = tmpForm
      this.$emit('onResetReply')
    }
  }
}
</script>

<style scoped>
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
  #reply {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 990;
  }
  #reply-content {
    position: absolute;
    top: 30%;
    left: 20%;
    right: 0;
    margin: 0 auto;
    background: linear-gradient(180deg, #000, #434343);
    width: 600px;
    border-radius: 10px;
  }
 .replay-form {
   position: relative;
   padding: 20px;
   width: 556px;
   border: 2px solid rgba(0, 0, 0, 0);
   height: 80px;
   border-radius: 10px;
   background: #434343;
}
 .replay-form:focus {
  outline: none;
  background: rgba(0, 0, 0, 0);
  border: 2px solid rgba(255, 255, 255, 0.5);
  transition: all 0.5s ease-in-out;
}
 textarea {
  color: #fff;
}
  .reply-btn {
    border: none;
    background: transparent;
    padding: 5px;
    color: #fff;
    margin-right: 10px;
  }
  .reply-btn:hover {
    cursor: pointer;
    opacity: 0.6;
    border-bottom: 2px #928bad solid;
  }
</style>
