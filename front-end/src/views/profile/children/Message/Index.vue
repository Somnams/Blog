<template>
  <div v-if="messages">
    <nav-bar/>
    <header>
      Total items: {{messages._meta.total_items}} Total Page: {{messages._meta.total_pages}}
    </header>
    <main class="main-content" id="index-content">
      <div v-for="(message, index) in messages.items" :key="index">
        <div id="index-list">
          <div v-if="message.sender">
            <router-link :to="{ path: `/users/${message.sender.id}` }">
            <span v-if="message.is_new">
              <img :src="message.sender._links.avatar" alt="" class="user-img">
              <img src="../../../../assets/icon-img/tubiaozhizuo-.svg" class="icon-img">
            </span>
              <span v-else>
              <img :src="message.sender._links.avatar" alt="" class="user-img">
            </span>
            </router-link>
          </div>
          <div v-if="message.sender" id="index-detail">
            <div>{{message.sender.username}} send {{message.new_count || 0}} messages to you.</div>
            <span>
              <span class="icon-font">{{$moment(message.recipient.last_seen).format('YYYY/MM/DD HH:mm:ss')}}</span>
              <router-link title="check chat" :to="{ path: `/message/list`, query: { from: message.sender.id, username: message.sender.username } }">
                <img src="../../../../assets/icon-img/wenzhangguanli.svg" alt="" class="icon-img">
              </router-link>
            </span>
            <span v-if="!message.is_blocking">
              <a @click="onBlock(message.sender.id)" title="block this person">
                <img src="../../../../assets/icon-img/lahei_1.svg" alt="" class="icon-img">
              </a>
            </span>
            <span v-else>
              <a @click="unBlock(message.sender.id)" title="unblock this person">
                <img src="../../../../assets/icon-img/iconfuzhi.svg" alt="" class="icon-img">
              </a>
            </span>
          </div>
        </div>
      </div>
      <div v-if="messages && messages._meta.total_pages > 1">
        <pagination :cur-page="messages._meta.page"
                    :per-page="messages._meta.per_page"
                    :total-pages="messages._meta.total_pages"/>
      </div>
    </main>
  </div>
</template>

<script>
import store from '../../../../store/store'
import Pagination from '../../../../components/common/pagination/Pagination'
import NavBar from '../../../../components/common/nav/NavBar'
export default {
  name: 'Index',
  components: {
    Pagination,
    NavBar
  },
  data () {
    return {
      sharedState: store.state,
      messages: ''
    }
  },
  methods: {
    getUserMessagesSenders (id) {
      let page = 1
      // eslint-disable-next-line camelcase
      let per_page = 5
      if (typeof this.$route.query.page !== 'undefined') {
        page = this.$route.query.page
      }
      if (typeof this.$route.query.per_page !== 'undefined') {
        // eslint-disable-next-line camelcase
        per_page = this.$route.query.per_page
      }

      // eslint-disable-next-line camelcase
      const path = `/users/${id}/messages-senders/?page=${page}&per_page=${per_page}`
      this.$axios.get(path)
        .then((res) => {
          this.messages = res.data
          console.log(this.messages)
        })
        .catch((error) => {
          console.error(error)
        })
    },
    onBlock (id) {
      const path = `/block/${id}`
      this.$axios.get(path)
        .then((res) => {
          this.$toasted.success('block this person success')
        }).catch((err) => {
          console.error(err)
        })
    },
    unBlock (id) {
      const path = `/unblock/${id}`
      this.$axios.get(path)
        .then((res) => {
          this.$toasted.success('unblock this person success')
        })
        .catch((err) => {
          console.error(err)
        })
    }
  },
  created () {
    this.getUserMessagesSenders(this.sharedState.user_id)
  }
}
</script>

<style scoped>
  #index-content {
    clear: both;
    display: block;
  }
  #index-list {
    border: 1px solid #fff;
    border-radius: 5px;
    width: 80%;
    padding: 20px;
  }
  #index-detail {
    margin-top: -30px;
    margin-left: 100px;
  }
  .btn {
    width: 100px;
    margin-top: 10px;
  }
</style>
