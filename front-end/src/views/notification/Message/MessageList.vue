<template>
  <div v-if="messages">
    <nav-bar/>
    <header>Session With {{this.$route.query.username}}</header>
    <main class="main-content">
      <div v-for="(message, index) in messages.items" :key="index">
        <div v-if="message.sender" id="message-area">
          <section v-if="message.sender.id == sharedState.user_id">
            <div id="sender">
              <div class="other">
                <article class="message-detail">{{message.body}}</article>
                <span class="detail-time icon-font">
                {{$moment(message.timestamp).format('YYYY/MM/DD HH:mm:ss')}}</span>
              </div>
              <router-link :to="{ path: `/user/${sharedState.user_id}` }">
                <img :src="message.sender._links.avatar" alt="" class="user-img"></router-link>
            </div>
          </section>
          <section v-else>
            <div id="recipient">
              <router-link :to="{ path: `/user/${message.sender.id}` }">
                <img :src="message.sender._links.avatar" alt="" class="user-img">
              </router-link>
              <div class="other">
                <article class="message-detail">{{message.body}}</article>
                <span class="detail-time icon-font">
                {{$moment(message.timestamp).format('YYYY/MM/DD HH:mm:ss')}}</span>
              </div>
            </div>
          </section>
        </div>
      </div>
      <comment @onSubmitMessage="onSubmitMessage" @onResetMessage="onResetMessage"/>
      <div v-if="messages && messages._meta.total.pages > 1">
        <pagination :cur-page="messages._meta.page"
                    :per-page="messages._meta.per_page"
                    :total-pages="messages._meta.total_pages"/>
      </div>
    </main>
    <br>
    <br>
  </div>
</template>

<script>
import store from '../../../store/store'
import Comment from '../../../components/common/comment/Comment'
import Pagination from '../../../components/common/pagination/Pagination'
export default {
  name: 'MessageList',
  inject: ['reload'],
  data () {
    return {
      sharedState: store.state,
      messages: '',
      user: ''
    }
  },
  components: {
    Comment,
    Pagination
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
      let page = 1
      // eslint-disable-next-line camelcase
      let per_page = 10
      if (typeof this.$route.query.page !== 'undefined') {
        page = this.$route.query.page
      }
      if (typeof this.$route.query.per_page !== 'undefined') {
        // eslint-disable-next-line camelcase
        per_page = this.$route.query.per_page
      }

      // eslint-disable-next-line camelcase
      const path = `/users/${id}/history-messages/?from=${this.$route.query.from}&page=${page}&per_page=${per_page}`
      this.$axios.get(path)
        .then((response) => {
          // handle success
          this.messages = response.data
        })
        .catch((error) => {
          // handle error
          console.error(error)
        })
    },
    onSubmitMessage (Form) {
      console.log(Form)
      const path = '/messages/'
      const payload = {
        body: Form.body,
        recipient_id: this.$route.query.from
      }
      this.$axios.post(path, payload)
        .then((res) => {
          this.$toasted.success('Success send message.')
          this.reload()
        })
        .catch((err) => {
          console.error(err)
        })
    },
    onResetMessage () {
      // console.log('rest')
    }
  },
  created () {
    // eslint-disable-next-line camelcase
    const user_id = this.sharedState.user_id
    this.getUser(user_id)
    this.getUserHistoryMessages(user_id)
  },
  beforeRouteUpdate (to, from, next) {
    next()
    this.getUserHistoryMessages()
  }
}
</script>

<style scoped>
  #message-area {
    width: 90%;
    border-radius: 5px;
    display: flex;
    flex-direction: column;
  }
  #sender {
    flex: 1;
    display: flex;
    padding: 30px;
    float: right;
  }
  .message-detail {
    padding: 10px;
    font-size: 20px;
    text-align: center;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 5px;
    color: #000;
  }
  .other {
    flex-direction: column;
    padding: 10px;
  }
  .detail-time {
    margin-left: 10px;
  }
  #recipient {
    flex: 1;
    display: flex;
    float: left;
  }
</style>
