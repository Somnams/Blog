<template>
  <div id="nav">
    <div id="nav-header">
      <img src="../assets/user.jpeg" alt="" class="user-img">
      <p class="user-name">Tang YiGuang</p>
    </div>
    <div id="nav-ul">
      <div class="nav-title">
        <router-link to="/blog"><div class="anchor">My Blog</div></router-link>
      </div>
      <div id="ul-blog">
        <ul v-for="(item, index) in posts.items" :key="index">
          <li><a class="nav-link" @click="toPost(item.id)">{{item.title}}</a></li>
        </ul>
      </div>
      <br/>
      <div class="nav-title">
        <router-link to="/life"><div class="anchor">My Life</div></router-link>
      </div>
      <ul class="ul-life">
        <li><a class="nav-link" href="">XXXXX</a></li>
      </ul>
      <br/>
      <div class="nav-title">
        <a @click="toMine">About Me</a>
      </div>
      <ul class="ul-mine">
        <li><a class="nav-link" href="">xxxx</a></li>
        <li>11</li>
        <li>21</li>
        <li>31</li>
        <li>22</li>
        <li>22</li>
        <li>22</li>
        <li>22</li>
        <li>33</li>
        <br/>
        <br/>
      </ul>
    </div>
  </div>
</template>

<script>
import store from '../store/store'

export default {
  name: 'NavBar',
  inject: ['reload'],
  data () {
    return {
      current_id: store.state.user_id,
      posts: {}
    }
  },
  methods: {
    toMine () {
      this.$router.push('/user/' + this.current_id)
    },
    toPost (id) {
      this.$router.push('/blog/post/' + id)
      this.reload()
    },
    getPosts () {
      let page = 1
      // eslint-disable-next-line camelcase
      let per_page = 3
      if (typeof this.$route.query.per_page !== 'undefined') {
        page = this.$route.query.page
      }
      if (typeof this.$route.query.per_page !== 'undefined') {
        // eslint-disable-next-line camelcase
        per_page = this.$route.query.per_page
      }

      // eslint-disable-next-line camelcase
      const path = `/posts?page=${page}&per_page=${per_page}`
      this.$axios.get(path)
        .then((res) => {
          this.posts = res.data
        })
        .catch((error) => {
          console.error(error)
        })
    }
  },
  created () {
    this.getPosts()
  }
  // beforeRouteUpdate (to, from, next) {
  //   next()
  //   this.toPost(to.params.id)
  // }
}
</script>

<style scoped>
  #nav-header {
    margin: 30px;
    text-align: center;
    display: flex;
    flex-direction: column;
  }
  #nav-header .user-img{
    width: 200px;
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
    margin-left: 30px;
    font-weight: bold;
    font-size: 20px;

  }
  .nav-link{
    margin-left: 50px;
  }
</style>
