<template>
  <div class="page">
    <nav-bar class="nav-bar"/>
    <div>
      <div class="main-content">
        <recived-comments/>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from '../../../../components/common/nav/NavBar'
import store from '../../../../store/store'
import RecivedComments from './RecivedComments'
export default {
  name: 'Notification',
  components: {
    RecivedComments,
    NavBar
  },
  data () {
    return {
      sharedState: store.state,
      user: '',
      notifications: {
        unread_recived_comments_counts: 0,
        unread_follows_count: 0,
        unread_likes_count: 0,
        unread_followeds_posts_count: 0
      }
    }
  },
  methods: {
    getUser (id) {
      const path = `/users/${id}`
      this.$axios.get(path)
        .then((res) => {
          this.user = res.data
        })
        .catch((error) => {
          console.error(error)
        })
    },
    getUserNotifications (id) {
      let since = 0
      const path = `/users/${id}/notifications/?since=${since}`
      this.$axios.get(path)
        .then((res) => {
          const len = res.data.length
          for (let i = 0; i < len; i++) {
            if (res.data[i].name === 'unread_recived_comments_count') {
              this.unread_recived_comments_counts = res.data[i].payload
              break
            }
            since = res.data[i].timestamp
          }
        })
        .catch((error) => {
          console.error(error)
        })
    }
  },
  created () {
    // eslint-disable-next-line camelcase
    const user_id = this.sharedState.user_id
    this.getUser(user_id)
    this.getUserNotifications(user_id)
  },
  beforeRouteUpdate (to, from, next) {
    next()
    this.getUserNotifications(this.sharedState.user_id)
  }
}

</script>
