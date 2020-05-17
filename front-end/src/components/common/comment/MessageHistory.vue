<template>
    <div class="page">
      <nav-bar class="nav-bar"/>
      <header class="chat-header" v-if="messages">
        <h3>
          <router-link :to="{ name: 'MessageIndex' }">Go Back</router-link> Session with {{user.username}} ({{messages._meta.total_items}} / {{messages._meta.total_pages}})</h3>
      </header>
      <div class="main-content" ref="chat" v-if="messages">
        <div class="chat-area">
          <div v-for="(message, index) in messages.items" :key="index">
            <div>
              <section v-if="message.sender.id == sharedState.user_id" class="chat-sender">
                <div class="chat-p sender-p">{{message.body}}</div>
                <span class="icon-font">{{$moment(message.timestamp).format('YYYY-MM-DD HH:mm:ss')}}</span>
                <img :src="message.sender._links.avatar" alt="" class="user-img">
              </section>
              <section v-else class="chat-recipient">
                <img :src="message.sender._links.avatar" alt="" class="user-img">
                <div class="chat-p recipient-p">{{message.body}}</div>
              </section>
            </div>
          </div>
        </div>
        <comment @onSubmitMessage="onSubmitMessage" class="comment" ref="comment"/>
        <div v-if="messages && messages._meta.total_pages > 1">
          <pagination :cur-page="messages._meta.page"
                      :per-page="messages._meta.per_page"
                      :total-pages="messages._meta.total_pages"/>
        </div>
      </div>
    </div>
</template>

<script>
import NavBar from '../nav/NavBar'
import Comment from './Comment'
import store from '../../../store/store'
import Pagination from '../pagination/Pagination'

export default {
  name: 'MessageHistory',
  components: {
    NavBar,
    Comment,
    Pagination
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
      let page = 1
      // eslint-disable-next-line camelcase
      let per_page = 200
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
      const path = '/messages/'
      const payload = {
        body: Form.body,
        recipient_id: this.user.id
      }
      this.$axios.post(path, payload)
        .then((res) => {
          this.$toasted.success('Success send message.')
          this.getUserHistoryMessages(this.sharedState.user_id)
        })
        .catch((err) => {
          console.error(err)
        })
    },
    Init () {
      window.scrollTo(0, 1200)
      console.log(window.scrollTop)
    }
  },
  created () {
    this.getUser(this.$route.query.from)
    this.getUserHistoryMessages(this.sharedState.user_id)
  },
  mounted () {
    this.Init()
  },
  // 当路由变化后(比如变更查询参数 page 和 per_page)重新加载数据
  beforeRouteUpdate (to, from, next) {
    next()
    this.getUser(this.$route.query.from)
    this.getUserHistoryMessages(this.sharedState.user_id)
  }
}
</script>

<style scoped>
  .main-content {
    clear: both;
  }
  .comment {
    margin-top: 50px;
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
    position: relative;
    margin: 14px;
    padding: 5px;
    word-break: break-word;
    text-align: left;
    border-radius: 6px;
    box-shadow: 0 5px 14px rgba(0, 0, 0, 0.7);
  }
  .icon-font {
    position: absolute;
    margin-top: 70px;
    right: 150px;
  }
  .sender-p {
    color: rgb(192, 233, 122);
  }
</style>
