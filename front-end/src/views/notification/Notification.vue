<template>
    <div class="page">
      <header></header>
      <nav class="nav-bar">
        <ul>
          <li>
            <router-link :to="{ path: '/blog' }">
              >>Go Back
            </router-link>
          </li>
          <li class="nav-row">
            <router-link :to="{ name: 'ReceivedComments' }">
              <img src="../../assets/icon-img/liuyan.svg" alt="" class="icon-img">Comments
              <div v-if="notifications.unread_received_comments_count" class="icon-noti"></div>
            </router-link>
          </li>
          <li class="nav-row">
            <router-link :to="{ name: 'MessageIndex' }">
              <img src="../../assets/icon-img/liaotian.svg" alt="" class="icon-img">Messages
              <div v-if="notifications.unread_messages_count > 0" class="icon-noti"></div>
            </router-link>
          </li>
          <li class="nav-row">
            <router-link :to="{ name: 'CommentsLikes' }">
              <img src="../../assets/icon-img/shoucang.svg" alt="" class="icon-img">Comments-Likes
              <div v-if="notifications.unread_comments_likes_count" class="icon-noti"></div>
            </router-link>
          </li>
        </ul>
      </nav>
      <div>
        <router-view></router-view>
      </div>
    </div>
</template>

<script>
import store from '../../store/store'
export default {
  name: 'Notification',
  data () {
    return {
      sharedState: store.state,
      user: '',
      notifications: {
        unread_received_comments_count: 0,
        unread_messages_count: 0,
        unread_comments_likes_count: 0
      }
    }
  },
  methods: {
    getUserNotifications (id) {
      let since = 0
      const path = `/users/${id}/notifications/?since=${since}`
      this.$axios.get(path)
        .then((res) => {
          const len = res.data.length
          for (let i = 0; i < len; i++) {
            switch (res.data[i].name) {
              case 'unread_recived_comments_count':
                this.notifications.unread_received_comments_count = res.data[i].payload
                break
              case 'unread_messages_count':
                this.notifications.unread_messages_count = res.data[i].payload
                break
              case 'unread_comments_likes_count':
                this.notifications.unread_comments_likes_count = res.data[i].payload
                break
            }
            since = res.data[i].timestamp
          }
        })
        .catch((err) => {
          console.log(err)
        })
    }
  },
  created () {
    // eslint-disable-next-line camelcase
    const user_id = this.sharedState.user_id
    this.getUserNotifications(user_id)
  }
}
</script>

<style scoped>
  .nav-row {
    display: inline-flex;
    position: relative;
  }
</style>
