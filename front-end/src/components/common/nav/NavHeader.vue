<template>
    <div class="nav-header">
      <form @submit.prevent class="search-form">
        <input
          type="text"
          v-model="searchKey"
          placeholder="search"
          class="search-input"
        />
        <button type="submit"
                class="nh-btn search-btn"
                @click="onSubmitSearch"
        >
          <img :src="imageData.sousuo" title="search" class="icon-img">
        </button>
      </form>
      <div class="nav-header-right">
        <div v-if="sharedState">
          <a class="nh-select">
            <router-link :to="{ path: '/notification' }">
              <img :src="imageData.tongzhi"
                   alt="" class="icon-img" :class="{ active: isActive }">
            </router-link>
            <div class="nh-options">
              <div v-if="isActive">New message...</div>
              <span v-else>No messages...</span>
            </div>
          </a>
          <router-link :to="{ name: 'About' }">
            <img :src="imageData.guanyuwomen" title="About us" class="icon-img">
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
      searchKey: null
    }
  },
  computed: {
    imageData() {
      return store.state.imageData
    }
  },
  methods: {
    logout () {
      store.logoutAction()
      this.$toasted.show('You have been logged out.', { icon: 'fingerprint' })
      this.$router.push('/login')
    },
    getUserNewNotifications () {
      let since = 0;
      let total_notifications_count = 0;
      let unread_comments = 0;
      let unread_messages = 0;
      let unread_likes = 0;
      setInterval(() => {
        if (this.sharedState) {
          const userId = this.sharedState;
          const path = `/users/${userId}/notifications/?since=${since}`;
          this.$axios.get(path)
            .then(({data}) => {
              data.forEach(value => {
                switch (value.name) {
                case 'unread_recived_comments_count':
                  unread_comments = value.payload;
                  break;
                case 'unread_messages_count':
                  unread_messages = value.payload;
                  break;
                case 'unread_comments_likes_count':
                  unread_likes = value.payload;
                  break;
                }
                since = value.timestamp;
              });
              total_notifications_count = unread_comments + unread_messages + unread_likes;
              this.isActive = total_notifications_count > 0;
            })
            .catch((err) => {
              console.error(err);
            });
        }
      }, 5000);
    },
    onSubmitSearch () {
      if (!this.searchKey) {
        return false;
      }
      const q = this.searchKey;
      const page = typeof this.$route.query.page !== 'undefined' ? this.$route.query.page : 1;
      const per_page = typeof this.$route.query.per_page !== 'undefined' ? this.$route.query.per_page : 10;
      this.$router.replace({
        path: '/search',
        query: {q, page, per_page}
      });
    }
  },
  mounted () {
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
    position: sticky;
    top: 50px;
    display: flex;
    justify-content: space-between;
    width: 100%;
    padding-bottom: 10px;
    border-bottom: 4px solid #928bad;
  }
  .search-form {
    position: relative;
    flex: 4;
  }
  .search-input {
    padding-left: 15px;
    height: 50px;
    width: 100%;
    font-size: 18px;
  }
  .nav-header-right {
    flex: 2;
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
