<template>
    <div class="page">
      <!-- Sidebar -->
      <div class="nav-bar" :class="{ close: isHidden }">
        <div class="sidebar-wrapper">
          <a @click="onShow" class="closeBtn">&times;</a>
          <ul class="sidebar-nav">
            <li class="sidebar-brand">
              SideBar
            </li>
            <li>
              <img class="icon-img" src="../../assets/icon-img/iconfuzhi.svg">
              <router-link :to="{ name: 'AdminUsers' }">Users</router-link>
            </li>
            <li class="active">
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
      <main class="main-content" :class="{ open: isHidden }">
        <header>Hello, {{ user.username }}(Admin)</header>
        <a @click="onHidden" class="openBtn">&#9776;</a>
        <div>
          <router-view/>
        </div>
      </main>
    </div>
</template>

<script>
import store from '../../store/store'

export default {
  name: 'Admin',
  data () {
    return {
      sharedState: store.state,
      user: '',
      isHidden: false
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
    onShow () {
      this.isHidden = true
    },
    onHidden () {
      this.isHidden = false
    }
  },
  computed: {
  },
  created () {
    // eslint-disable-next-line camelcase
    const user_id = this.sharedState.user_id
    this.getUser(user_id)
  }
}
</script>

<style scoped>
  .close {
    left: -300px;
  }
  .open {
    margin-left: 0;
  }
  .closeBtn {
    position: absolute;
    top: 10px;
    right: 25px;
    font-size: 28px;
  }
  .openBtn {
    position: absolute;
    top: 0;
    left: 20px;
  }
  .active {
    border-right: 4px solid #fff;
  }
</style>
