<template>
    <div class="page">
      <nav-bar class="nav-bar"/>
      <div class="main-content">
        <header class="chat-header">
          <h3>Session with {{user.username}}</h3>
        </header>
        <vuescroll :ops="ops" ref="area">
          <div class="chat-area" ref="inner">
            <div v-for="(message, index) in messages.items" :key="index">
              <section v-if="message.sender.id == sharedState.user_id" class="chat-sender">
                <div class="chat-p sender-p">{{message.body}}</div>
                <img :src="user._links.avatar" alt="" class="user-img">
              </section>
              <section v-else class="chat-recipient">
                <img :src="message.sender._links.avatar" alt="" class="user-img">
                <div class="chat-p recipient-p">{{message.body}}</div>
              </section>
            </div>
            <comment @onSubmitMessage="onSubmitMessage"/>
          </div>
        </vuescroll>
      </div>
    </div>
</template>

<script>
import NavBar from '../nav/NavBar'
import Comment from './Comment'
import store from '../../../store/store'
import Pagination from '../pagination/Pagination'
import vuescroll from 'vuescroll'

export default {
  name: 'MessageHistory',
  components: {
    NavBar,
    Comment,
    // eslint-disable-next-line vue/no-unused-components
    Pagination,
    vuescroll
  },
  data () {
    return {
      ops: {
        rail: {
          gutterOfSide: '0px',
          keepShow: false,
          opacity: 0,
          size: '10px'
        },
        bar: {
          disable: true
        }
      },
      sharedState: store.state,
      messages: '',
      user: ''
    }
  },
  watch: {
    messages: {
      handler: function () {
        this.$nextTick(() => {
          this.$refs.area.scrollTo({
            x: 0,
            y: '100%'
          }, 0)
        })
      },
      deep: true
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
    }
  },
  created () {
    this.getUser(this.$route.query.from)
    this.getUserHistoryMessages(this.sharedState.user_id)
  },
  // 当路由变化后(比如变更查询参数 page 和 per_page)重新加载数据
  beforeRouteUpdate (to, from, next) {
    next()
    this.getUser(this.$route.query.from)
    this.getUserHistoryMessages(this.sharedState.user_id)
  },
  mounted () {
    this.$nextTick(() => {
      this.$refs.area.scrollTo({
        x: 0,
        y: '100%'
      }, 0)
    })
  }
}
</script>

<style scoped>
  .page {
    overflow: hidden;
  }
  .main-content {
    transform: translate(0, 0);
    height: 100vh;
    clear: both;
    border: 1px solid transparent;
  }

  .chat-header {
    position: fixed;
    background: #212121;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.4);
    z-index: 1;
    top: 0;
    margin: 0;
    width: 90%;
  }
  .chat-area {
    padding-top: 80px;
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
