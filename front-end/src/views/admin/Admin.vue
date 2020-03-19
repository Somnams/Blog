<template>
    <div class="page">
      <!-- Sidebar -->
      <div class="nav-bar wrapper">
        <div class="sidebar-wrapper">
          <ul class="sidebar-nav">
            <li class="sidebar-brand">
              SideBar
            </li>
            <li>
              <img class="icon-img" src="../../assets/icon-img/iconfuzhi.svg">
              <router-link :to="{ name: 'AdminUsers' }">Users</router-link>
            </li>
            <li>
              <img src="../../assets/icon-img/iconzhucetouxiang.svg" alt="" class="icon-img">
              <router-link :to="{ name: 'AdminRoles' }">Roles</router-link>
            </li>
            <li>
              <img src="../../assets/icon-img/wenzhangguanli.svg" alt="" class="icon-img">
              <router-link :to="{ name: 'AdminPosts' }">Posts</router-link>
            </li>
            <li>
              <img src="../../assets/icon-img/liaotian.svg" alt="" class="icon-img">
              <router-link :to="{ name: 'AdminComments' }">Comments</router-link>
            </li>
          </ul>
        </div>
      </div>
      <div class="container-wrapper">
        <div class="bg-faded">
          <a id="menu-toggle">
            <img src="../../assets/icon-img/liebiao.svg" class="icon-img">
          </a>
          <span>List</span>
        </div>
        <div class="main-content">
          <router-view/>
        </div>
      </div>
    </div>
</template>

<script>
import store from '../../store/store'

export default {
  name: 'Admin',
  data () {
    return {
      sharedState: store.state,
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
    }
  },
  computed: {
  },
  created () {
    console.log(this.$route)
    // eslint-disable-next-line camelcase
    const user_id = this.sharedState.user_id
    this.getUser(user_id)
  }
}
</script>

<style scoped>
  .wrapper {
    transition: all .5s ease;
    -webkit-transition: all .5s ease;
    -moz-transition: all .5s ease;
    -o-transition: all .5s ease;
  }
  .container-wrapper {
    margin-left: 26%;
    position: absolute;
  }
</style>
