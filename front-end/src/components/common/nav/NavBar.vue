<template>
  <div class="nav-bar">
    <div id="nav-header">
      <div>
        <img src="../../../assets/user.jpeg" alt="" class="img">
      </div>
      <p class="user-name">Tang YiGuang</p>
    </div>
    <div id="nav-ul">
      <div class="nav-title">
        <router-link to="/blog"><div class="anchor">My Blog</div></router-link>
      </div>
      <div class="nav-title">
        <router-link to="/life"><div class="anchor">My Life</div></router-link>
      </div>
      <div class="nav-title">
        <a @click="toMine">About Me</a>
      </div>
      <ul class="ul-mine">
        <li class="nav-link">
          <router-link :to="{ path: '/notice' }">Comments</router-link>
        </li>
        <li class="nav-link">
          <router-link :to="{ path: '/message' }">Message</router-link>
        </li>
        <br/>
        <br/>
      </ul>
    </div>
  </div>
</template>

<script>
import store from '../../../store/store'

export default {
  name: 'NavBar',
  data () {
    return {
      current_id: store.state.user_id
    }
  },
  methods: {
    toMine () {
      this.$router.push('/user/' + this.current_id)
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
    border-radius: 50%;
    margin: 0 auto;
  }
  #nav-header .user-name{
     font-size: 20px;
     font-weight: bold;
   }
  #nav-ul {
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
    margin-left: 60px;
  }
</style>
