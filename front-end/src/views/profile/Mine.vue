<template>
  <div class="page">
    <nav-bar class="nav-bar" id="mine-nav"/>
    <header>
      <h2>Personal Profile</h2>
    </header>
    <main class="main-content" id="mine-content">
      <div class="mine-detail">
        <h3>
          <img src="../../assets/icon-img/iconfuzhi.svg" alt="" class="icon-img">
          {{ user.username }}
        </h3>
        <h3>
          <img src="../../assets/icon-img/dingweidizhigpsditu.svg" alt="" class="icon-img">
          {{ user.location }}
        </h3>
        <h3>
          <img src="../../assets/icon-img/shoucang.svg" alt="" class="icon-img">
          {{ user.about_me }}
        </h3>
        <!-- Member since -->
        <h4>
          <img src="../../assets/icon-img/shijian.svg" alt="" class="icon-img">
          Member since: <span v-if="user">{{ $moment(user.member_since).format('LLL') }}</span>
        </h4>
      </div>

      <div v-if="$route.params.id != sharedState.user_id">
        <router-link :to="{ name: 'MessagesHistoryResource', query: { from: $route.params.id } }" title="send message">
          <img src="../../assets/icon-img/youjianxinjian.svg" alt="" class="icon-img">
        </router-link>
      </div>

      <div v-if="$route.params.id == sharedState.user_id && sharedState.user_perms.includes('admin')">
        <send ref="send" :route-id="$route.params.id"/>
        <a @click="sendMessages()">
          <img src="../../assets/icon-img/fasong.svg" title="chain-message" class="icon-img">(send message by group)
        </a>
      </div>
    </main>
  </div>
</template>

<script>
import store from '../../store/store'
import NavBar from '../../components/common/nav/NavBar'
import Send from '../../components/common/comment/Send'

export default {
  name: 'Mine',
  components: {
    NavBar,
    Send
  },
  data () {
    return {
      sharedState: store.state,
      user: {
        username: '',
        email: '',
        name: '',
        location: '',
        about_me: '',
        member_since: '',
        last_seen: '',
        _links: {
          self: '',
          avatar: ''
        }
      }
    }
  },
  methods: {
    getUser (id) {
      const path = `/users/${id}`
      this.$axios.get(path)
        .then((response) => {
          this.user = response.data
          console.log(this.user)
        })
        .catch((error) => {
          // eslint-disable-next-line
            console.error(error)
        })
    },
    sendMessages () {
      this.$refs.send.send()
    }
  },
  created () {
    // eslint-disable-next-line camelcase
    const user_id = this.$route.params.id
    this.getUser(user_id)
  },
  // mounted () {
  //   console.log(this.$route)
  // },
  // 当 id 变化后重新加载数据
  beforeRouteUpdate (to, from, next) {
    next()
    this.getUser(to.params.id)
  }
}
</script>

<style scoped>
  #mine-content {
    clear: both;
    display: block;
  }
</style>
