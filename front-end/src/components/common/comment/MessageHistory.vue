<template>
    <div class="page">
      <nav-bar class="nav-bar"/>
      <div class="main-content">
        <header class="chat-header">
          <h3>Session with {{user.username}}</h3>
        </header>
        <vuescroll :ops="ops" ref="area">
          <div class="chat-area" ref="inner">
            <div v-for="(item, index) in mockData" :key="index"> {{ item.content }}</div>
            <comment @onSubmitMessage="onSubmitMessage"/>
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
        </vuescroll>
      </div>
    </div>
</template>

<script>
import NavBar from '../nav/NavBar'
import Comment from './Comment'
import store from '../../../store/store'
import vuescroll from 'vuescroll'

export default {
  name: 'MessageHistory',
  components: {
    NavBar,
    vuescroll,
    Comment
  },
  data () {
    return {
      mockData: [{
        content: '第一条第一条第一条第一条第一条第一条'
      }, {
        content: '第二条第二条第二条第二条第二条第二条第二条第二条第二条第二条第二条第二条第二条第二条第二条第二条第二条第二条第二条第二条第二条第二条第二条第二条第二条第二条第二条第二条第二条第二条第二条第二条第二条第二条第二条第二条第二条第二条第二条第二条第二条第二条第二条第二条第二条第二条第二条第二条第二条第二条第二条第二条第二条第二条第二条第二条第二条第二条第二条第二条第二条第二条第二条第二条第二条第二条第二条第二条第二条第二条第二条第二条第二条第二条第二条第二条第二条第二条第二条第二条第二条第二条第二条第二条'
      }, {
        content: '第三条'
      }, {
        content: '第四条'
      }, {
        content: '第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条'
      }, {
        content: '第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条'
      }, {
        content: '第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条'
      }, {
        content: '第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条'
      }, {
        content: '第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条'
      }, {
        content: '第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条'
      }, {
        content: '第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条'
      }, {
        content: '第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条第五条'
      }],
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
    mockData: {
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
    // getUserHistoryMessages (id) {
    //   const page = 1
    //   // eslint-disable-next-line camelcase
    //   const per_page = 20
    //   // eslint-disable-next-line camelcase
    //   const path = `/users/${id}/history-messages/?from=${this.$route.query.from}&page=${page}&per_page=${per_page}`
    //   this.$axios.get(path)
    //     .then((res) => {
    //       this.messages = res.data
    //     })
    //     .catch((err) => {
    //       console.error(err)
    //     })
    // },
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
  mounted () {
    this.$nextTick(() => {
      this.$refs.area.scrollTo({
        x: 0,
        y: '100%'
      }, 0)
    })
    // mock
    setTimeout(() => {
      this.mockData.push({
        content: '新加的内容新加的内容新加的内容新加的内容新加的内容新加的内容新加的内容新加的内容新加的内容新加的内容新加的内容新加的内容新加的内容新加的内容新加的内容新加的内容新加的内容新加的内容新加的内容新加的内容新加的内容新加的内容新加的内容新加的内容新加的内容新加的内容新加的内容新加的内容新加的内容新加的内容新加的内容新加的内容新加的内容新加的内容新加的内容新加的内容新加的内容'
      })
    }, 2000)
  }
  // created () {
  //   // this.getUser(this.$route.query.from)
  //   // this.getUserHistoryMessages(this.sharedState.user_id)
  // }
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
