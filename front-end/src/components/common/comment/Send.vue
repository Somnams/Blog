<template>
  <div>
    <transition name="fade">
      <div class="group-messages" v-if="isShow">
        <div class="msg-form">
          <img :src="imageDatas.youjianxinjian" class="icon-img">Group Messages
          <form @submit.prevent="onSendMessages" @reset.prevent="onResetMessages">
            <textarea name="" id="" cols="30" rows="20"
                      class="msg-input" placeholder="Please input message."
                      v-model="groupForm.body"></textarea>
            <span>{{ groupForm.bodyError }}</span>
            <div class="msg-bottom">
              <button type="submit" class="icon-btn">submit</button>
              <button type="reset" class="icon-btn">reset</button>
            </div>
          </form>
          <div>
            <alert v-for="(alert, index) in alerts" :key="index"
                   :id="alert.id"
                   :variant="alert.variant"
                   :message="alert.message">
            </alert>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import Alert from '../alert/BlogAlert'
import store from '@store/store'
export default {
  name: 'Send',
  components: { Alert },
  props: {
    routeId: String
  },
  data () {
    return {
      imageDatas: store.state.imageData,
      promiseStatus: null,
      isShow: false,
      alerts: [],
      groupForm: {
        body: '',
        bodyError: null
      }
    }
  },
  methods: {
    send () {
      const _this = this
      this.isShow = true
      return new Promise(function (resolve, reject) {
        _this.promiseStatus = { resolve, reject }
      })
    },
    onResetMessages () {
      this.isShow = false
      this.groupForm.body = ''
      this.groupForm.bodyError = null
      this.promiseStatus && this.promiseStatus.reject()
    },
    onSendMessages () {
      this.groupForm.bodyError = null
      if (!this.groupForm.body) {
        this.groupForm.bodyError = 'Body is required'
      } else {
        this.groupForm.bodyError = null
      }
      if (this.groupForm.bodyError) {
        return false
      }
      const path = '/send-messages'
      const payload = {
        body: this.groupForm.body
      }
      this.$axios.post(path, payload)
        .then((res) => {
          // 重新加载，看是否有后台任务
          this.get_user_tasks_in_progress(this.routeId)
          this.$toasted.success(res.data.message, { icon: 'fingerprint' })
          this.groupForm.body = ''
        })
        .catch((err) => {
          this.$toasted.error(err.response.data.message, { icon: 'fingerprint' })
        })
      this.isShow = false
      this.promiseStatus && this.promiseStatus.resolve()
    },
    get_user_tasks_in_progress (id) {
      const path = `/users/${id}/tasks`
      this.$axios.get(path)
        .then((res) => {
          this.alerts = []
          for (let i = 0; i < res.data.items.length; i++) {
            // eslint-disable-next-line no-new-object
            const alert = new Object()
            alert.id = res.data.items[i].id
            alert.variant = 'info'
            alert.message = res.data.items[i].description + '' + res.data.items[i].progress + '%'
            this.alerts.push(alert)
          }
        })
        .catch((err) => {
          console.error(err)
        })
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
  .group-messages {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    z-index: 990;
  }
  .msg-form {
    position: absolute;
    top: 50px;
    left: 20%;
    bottom: 50px;
    width: 60%;
    text-align: center;
    background: #000;
    /*border-image-source: linear-gradient(#9757CD, #3F51B5);*/
    /*border-image-slice: 15;*/
    /*border-style: solid;*/
  }
  .msg-input {
    padding: 20px;
    width: 80%;
    height: 100%;
  }
</style>
