<template>
    <div class="page">
      <nav-bar class="nav-bar"/>
      <header class="chat-header">
        <h3>Session with {{user.username}}</h3>
      </header>
      <div class="main-content">
        <div v-if="messages"  class="chat-area">
          <div v-for="(message, index) in messages.items" :key="index">
            <div>
              <section v-if="message.sender.id == sharedState.user_id" class="chat-sender">
                <div class="chat-p sender-p">{{message.body}}</div>
                <img :src="user._links.avatar" alt="" class="user-img">
              </section>
              <section v-else class="chat-recipient">
                <img :src="message.sender._links.avatar" alt="" class="user-img">
                <div class="chat-p recipient-p">{{message.body}}</div>
              </section>
            </div>
          </div>
        </div>
        <comment @onSubmitMessage="onSubmitMessage"/>
      </div>
    </div>
</template>

<script>
import NavBar from '../nav/NavBar'
import Comment from './Comment'
import store from '../../../store/store'

export default {
  name: 'MessageHistory',
  components: {
    NavBar,
    Comment
  },
  data () {
    return {
      sharedState: store.state,
      messages: '',
      user: ''
    }
  },
  methods: {
    getUser (id) {
      const path = `/users/${id}`
      this.$axios.get(path)
        .then((res) => {
          this.user = res.data
        })
        .catch((err) => {
          console.error(err)
        })
    },
    getUserHistoryMessages (id) {
      const page = 1
      // eslint-disable-next-line camelcase
      const per_page = 20
      // eslint-disable-next-line camelcase
      const path = `/users/${id}/history-messages/?from=${this.$route.query.from}&page=${page}&per_page=${per_page}`
      this.$axios.get(path)
        .then((res) => {
          this.messages = res.data
        })
        .catch((err) => {
          console.error(err)
        })
    },
    onSubmitMessage (Form) {
      const path = '/messages/'
      const payload = {
        body: Form.body,
        recipient_id: this.$route.query.from
      }
      this.$axios.post(path, payload)
        .then((res) => {
          this.$toasted.success('Success send message.')
        })
        .catch((err) => {
          console.error(err)
        })
    }
  },
  created () {
    this.getUser(this.$route.query.from)
    this.getUserHistoryMessages(this.sharedState.user_id)
  }
}
</script>

<style scoped>
  .main-content {
    clear: both;
  }
  .chat-header {
    position: sticky;
    background: #212121;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.4);
    z-index: 1;
    top: 0;
  }
  .chat-area {
    width: 90%;
    display: flex;
    flex-direction: column;
  }
  .chat-sender {
    flex: 1;
    display: flex;
    float: right;
  }
  .chat-recipient {
    flex: 1;
    display: flex;
    float: left;
  }
  .chat-p {
    margin: 14px;
    padding: 5px;
    word-break: break-word;
    text-align: left;
    border-radius: 6px;
    box-shadow: 0 5px 14px rgba(0, 0, 0, 0.7);
  }
  .sender-p {
    color: rgb(192, 233, 122);
  }
</style>
