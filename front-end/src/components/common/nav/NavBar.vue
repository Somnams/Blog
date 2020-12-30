<template>
  <div class="nav-bar">
    <div id="nav-header">
      <div>
        <img src="@/assets/user.jpeg" alt="" class="img">
      </div>
      <router-link :to="{ path: `/user/${current_id}`}" class="user-name">{{ user_name }}</router-link>
    </div>
    <div id="nav-ul">
      <div class="nav-title">
        <router-link to="/blog"><div class="anchor">Blog</div></router-link>
      </div>
      <div class="nav-title">
        <router-link to="/life"><div class="anchor">Essay</div></router-link>
      </div>
      <div class="nav-title">
        <a @click="onClickShow">
          Settings +
        </a>
      </div>
      <ul v-if="isShow">
        <li class="nav-link">
          <router-link :to="{ name: 'Account' }">
            ChangePassword
          </router-link>
        </li>
        <li class="nav-link">
          <router-link :to="{ path: '/edit-profile' }">
            ChangeProfile
          </router-link>
        </li>
      </ul>
      <div class="nav-title">
        <a>webRTC...loading</a>
      </div>
      <div class="nav-title" v-if="sharedState.is_authenticated && sharedState.user_perms.includes('admin')">
        <router-link to="/admin">Admin</router-link>
      </div>
    </div>
    <br>
    <br>
  </div>
</template>

<script>
import store from '@/store/store'

export default {
  name: 'NavBar',
  data () {
    return {
      isShow: false,
      sharedState: store.state,
      current_id: store.state.user_id,
      user_name: store.state.user_name,
      user_avatar: store.state.user_avatar,
      total_count: 0
    }
  },
  methods: {
    onClickShow () {
      this.isShow = !this.isShow
    }
  }
}
</script>

<style scoped>
  #nav-header {
    margin: 30px;
    text-align: center;
    display: flex;
    flex-direction: column;
  }
  #nav-header .img{
    width: 80%;
    border-radius: 8px;
    margin: 0 auto;
  }
  #nav-header .user-name{
     font-size: 20px;
     font-weight: bold;
   }
  #nav-ul {
    scrollbar-width: none;
    height: 80%;
    width: 100%;
    overflow-y: auto;
  }
  #nav-ul::-webkit-scrollbar{
    display: none;
  }
  ul {
    padding: 0;
  }
  ul li{
    list-style: none;
    border-bottom: 1px solid #434343;
    width: 100%;
  }
  .nav-title{
    padding-left: 50px;
    font-weight: bold;
    font-size: 20px;
    border-bottom: 1px solid #434343;
    margin-top: 40px;
  }
  .nav-link{
    text-align: center;
    background: #212121;
  }
</style>
