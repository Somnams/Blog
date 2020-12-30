<template>
    <div class="nav-header">
      <form @submit.prevent class="nh-form">
        <input
          type="text"
          v-model="searchForm.body"
          placeholder="search"
          class="nh-in"
        />
        <button type="submit"
                class="nh-btn search-btn"
                @click="onSubmitSearch"
        >
          <img :src="imageDatas.sousuo" title="search" class="icon-img">
        </button>
      </form>
      <div class="nh-right">
        <div v-if="sharedState">
          <a class="nh-select">
            <router-link :to="{ path: '/notification' }">
              <img :src="imageDatas.tongzhi"
                   alt="" class="icon-img" :class="{ active: isActive }">
            </router-link>
            <div class="nh-options">
              <div v-if="isActive">New message...</div>
              <span v-else>No messages...</span>
            </div>
          </a>
          <router-link :to="{ name: 'About' }">
            <img :src="imageDatas.guanyuwomen" title="About us" class="icon-img">
          </router-link>
          <a>
            <button class="nh-btn login-btn" @click="logout()">Logout</button>
          </a>
        </div>
        <div v-else>
          <router-link :to="{ path: '/register'}">
            <button class="nh-btn register-btn">Sign Up</button>
          </router-link>
          <router-link :to="{ path: '/login'}">
            <button class="nh-btn login-btn">Login In</button>
          </router-link>
        </div>
      </div>
    </div>
</template>

<script>
import store from '@/store/store';

export default {
  name: 'NavHeader',
  data () {
    return {
      isActive: false,
      sharedState: store.state.user_id,
      searchForm: {
        body: ''
      },
      imageDatas: store.state.imageData
    }
  },
  methods: {
    logout () {
      store.logoutAction()
      this.$toasted.show('You have been logged out.', { icon: 'fingerprint' })
      this.$router.push('/login')
    },
    getUserNewNotifications () {
      let since = 0
      // eslint-disable-next-line camelcase,no-unused-vars
      let total_notifications_count = 0
      // eslint-disable-next-line camelcase
      let unread_recived_comments_count = 0
      // eslint-disable-next-line camelcase
      let unread_messages_count = 0
      // eslint-disable-next-line camelcase
      let unread_comments_likes_count = 0
      // 记坑：不使用箭头函数回报错TypeError:get is not defined 因为找不到这时this中没有axios实例对象
      setInterval(() => {
        if (this.sharedState) {
          // eslint-disable-next-line camelcase
          const user_id = this.sharedState
          // eslint-disable-next-line camelcase
          const path = `/users/${user_id}/notifications/?since=${since}`
          this.$axios.get(path)
            .then((res) => {
              for (let i = 0; i < res.data.length; i++) {
                switch (res.data[i].name) {
                case 'unread_recived_comments_count':
                  // eslint-disable-next-line camelcase
                  unread_recived_comments_count = res.data[i].payload;
                  break;
                case 'unread_messages_count':
                  // eslint-disable-next-line camelcase
                  unread_messages_count = res.data[i].payload;
                  break;
                case 'unread_comments_likes_count':
                  // eslint-disable-next-line camelcase
                  unread_comments_likes_count = res.data[i].payload;
                  break;
                }
                since = res.data[i].timestamp
              }
              // eslint-disable-next-line camelcase
              total_notifications_count = unread_recived_comments_count + unread_messages_count + unread_comments_likes_count
              // eslint-disable-next-line camelcase
              this.isActive = total_notifications_count > 0
            })
            .catch((err) => {
              console.error(err)
            })
        }
      }, 5000)
    },
    onSubmitSearch () {
      if (!this.searchForm.body) {
        return false
      }
      const q = this.searchForm.body
      let page = 1
      // eslint-disable-next-line camelcase
      let per_page = 10
      if (typeof this.$route.query.page !== 'undefined') {
        page = this.$route.query.page
      }
      if (typeof this.$route.query.per_page !== 'undefined') {
        // eslint-disable-next-line camelcase
        per_page = this.$route.query.per_page
      }
      this.$router.replace({
        path: '/search',
        query: {
          q: q,
          page: page,
          per_page: per_page
        }
      })
    }
  },
  mounted () {
    // notifications
    this.getUserNewNotifications()
  }
}
</script>

<style scoped>
  .active {
    transform-origin: 50% 0;
    animation-name: news;
    animation-duration: 2s;
    animation-iteration-count: infinite;
    /* Firefox */
    -moz-transform-origin: 50% 0;
    -moz-animation-name: news;
    -moz-animation-duration: 2s;
    -moz-animation-iteration-count: infinite;
    /* Safari Chrome */
    -webkit-transform-origin: 50% 0;
    -webkit-animation-name: news;
    -webkit-animation-duration: 2s;
    -webkit-animation-iteration-count: infinite;
  }
  @keyframes news {
    0% {
      transform: rotate(35deg);
    }
    /*25% {*/
    /*  transform: rotate(35deg);*/
    /*}*/
    50% {
      transform: rotate(-30deg);
    }
    100% {
      transform: rotate(35deg);
    }
  }
  .nav-header {
    display: flex;
    width: 100%;
    padding-bottom: 10px;
    border-bottom: 4px solid #928bad;
  }
  .nh-form {
    position: relative;
    flex: 4;
    float: left;
  }
  .nh-in {
    padding-left: 15px;
    height: 50px;
    width: 100%;
  }
  .nh-right {
    flex: 2;
    float: right;
    margin-left: 20px;
  }
  .nh-select {
    position: relative;
  }
  .nh-select:hover .nh-options {
    display: block;
  }
  .nh-options {
    display: none;
    text-align: center;
    font-weight: bold;
    top: 16px;
    width: 160px;
    position: absolute;
  }
  .nh-options::after {
    content: '';
    border: 8px solid;
    border-color: transparent transparent #928bad transparent;
    position: absolute;
    top: -8px;
    left: 12px;
  }
  .nh-btn {
    height: 53px;
    width: 100px;
    outline: none;
    border: none;
    font-weight: bold;
    margin-left: 30px;
  }

  .search-btn {
    position: absolute;
    top: 0;
    right: 0;
    background: transparent;
  }
  .register-btn {
    background: #0f9b0f;
    border-radius: 10px;
  }
  .login-btn {
    border-radius: 10px;
    background: #928bad;
  }
</style>
