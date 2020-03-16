<template>
  <div class="page">
    <nav-bar class="nav-bar" id="mine-nav"/>
    <header class="page-header">
      Personal Profile
    </header>
    <main class="main-content" id="mine-content">
      {{ user.username }}
      {{ user.location }}
      <!-- Member since -->
      <h4>
        <i></i> Member since : <span v-if="user">
        {{ $moment(user.member_since).format('LLL') }}</span>
      </h4>
      <!-- End Member since -->

      <!-- Last seen -->
      <h4>
        <i></i> Last seen : <span v-if="user">
        {{ $moment(user.last_seen).fromNow() }}</span>
      </h4>
      <!-- End Last seen -->
      <router-link v-if="$route.params.id == sharedState.user_id" to='/edit-profile'>
        <button class="sign_btn">EDIT</button>
      </router-link>

      <div v-if="$route.params.id != sharedState.user_id">
        <router-link :to="{ path: '/message' }" title="send message">
          <img src="../../assets/icon-img/youjianxinjian.svg" alt="" class="icon-img">
        </router-link>
      </div>
    </main>
  </div>
</template>

<script>
import store from '../../store/store'
import NavBar from '../../components/common/nav/NavBar'

export default {
  name: 'Mine',
  components: {
    NavBar
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
        })
        .catch((error) => {
          // eslint-disable-next-line
            console.error(error)
        })
    }
  },
  created () {
    // eslint-disable-next-line camelcase
    const user_id = this.$route.params.id
    this.getUser(user_id)
  },
  // 当 id 变化后重新加载数据
  beforeRouteUpdate (to, from, next) {
    this.getUser(to.params.id)
    next()
  }
}
</script>

<style scoped>
  #mine-content {
    clear: both;
    display: block;
  }
  #mine .main-content .infor-card {
    width: 100%;

  }
  .infor-card {
    font-size: 60px;
    font-weight: 500;
    letter-spacing: 5px;
  }
  .infor-card .detail-card {
    width: 80%;
    margin-left: 100px;
    border-radius: 26px;
    border-style: solid;
    border-width: 1px 0 1px 0;
    border-color: #c0c0c0;

  }
  .detail-card .detail-info {
    width: 100%;
    margin-left: 20px;
    display: flex;
  }
  .detail-info .infor-title {
    font-size: 30px;
    font-weight: bold;
    flex: 1;
  }
  .detail-info .infor-detail {
    flex: 1;
  }
  .sign_btn {
    background-color: #928bad;
    font-family: 'Montserrat', sans-serif;
    color: #fff;
    width: 180px;
    padding: 10px 20px;
    display: block;
    height: 39px;
    border-radius: 20px;
    margin-top: 30px;
    transition: all 0.5s ease-in-out;
    border: none;
    text-transform: uppercase;
  }

  .sign_btn:hover {
    background: #948e99;
    box-shadow: 0px 4px 35px -5px #948e99;
    cursor: pointer;
  }

  .sign_btn:focus {
    outline: none;
  }
</style>
