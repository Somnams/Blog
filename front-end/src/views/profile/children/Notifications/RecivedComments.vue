<template>
  <div id="recived">
    <div>
      <header id="re-header">
        Recived Comments
        <small v-if="comments">(TOTAL:{{comments._meta.total_items}} PAGE:{{comments._meta.total_pages}})</small>
      </header>
    </div>
    <confirm ref="confirm"/>
    <div v-if="comments">
      <div v-for="(comment, index) in comments.items" :key="index" :id="'c' + comment.id">
        <div id="re-message">
          <div class="re-title">
            <router-link :to="{ path: `/user/${comment.author.id}` }">
            <span v-if="comment.is_new">
              <img :src="comment.author.avatar" class="user-img">new
            </span>
              <span v-else>
              <img :src="comment.author.avatar" alt="" class="user-img">old
            </span>
            </router-link>
            <span class="user-name">
            <p>{{comment.author.username}}</p>
            <p>{{ $moment(comment.timestamp).format('YYYY/MM/DD HH:mm:ss') }}</p>
            <p>( {{comment.post.title}} )</p>
          </span>
          </div>
          <div class="media-body">
            <div v-if="comment.disabled">
              <small>This comment has been disabled.</small>
            </div>
            <div v-else>
              {{comment.body}}
              <div class="bottom">
                <ul>
                  <li v-if="!comment.mark_read" class="icon-font">
                    <a @click="onMarkRead(comment)">mark_read</a>
                  </li>
                  <li v-else class="icon-font">
                    <span>read</span>
                  </li>
                  <li>
                    <a @click="onClickReply(comment)" class="icon-font">reply</a>
                  </li>
                  <li class="icon-font">
                    <router-link :to="{ path: `/blog/post/${comment.post.id}`}">checkChat</router-link>
                  </li>
                  <li v-if="comment.disabled"><button class="icon-btn">enable</button></li>
                  <li v-if="!comment.disabled">
                    <button @click="onDisabledComment(comment)" class="icon-btn">disabled</button>
                  </li>
                  <li v-if="!comment.disabled">
                    <button @click="onDeleteComment(comment)" class="icon-btn">delete</button></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div>
<!--      <pagination/>-->
    </div>
    <br>
    <br>
  </div>
</template>

<script>
import Confirm from '../../../../components/common/confirm/Confirm'
import store from '../../../../store/store'
// import Pagination from '../common/Pagination'
export default {
  name: 'RecivedComments',
  components: {
    Confirm
  },
  data () {
    return {
      sharedState: store.state,
      isReply: false,
      comments: '',
      replyForm: {
        body: '',
        post_id: '',
        parent_id: '',
        author_id: '',
        author_name: '',
        errors: 0,
        bodyError: null
      }
    }
  },
  methods: {
    getUserRecivedComments (id) {
      let page = 1
      // eslint-disable-next-line camelcase
      let per_page = 5
      if (typeof this.$route.query.page !== 'undefined') {
        page = this.$route.query.page
      }

      if (typeof this.$route.query.per_page !== 'undefined') {
        // eslint-disable-next-line camelcase
        per_page = this.$route.query.per_page
      }

      // eslint-disable-next-line camelcase
      const path = `/users/${id}/recived-comments/?page=${page}&per_page=${per_page}`
      this.$axios.get(path)
        .then((res) => {
          this.comments = res.data
          console.log(this.comments)
        })
        .catch((err) => {
          console.error(err)
        })
    },
    onClickReply (comment) {
      this.isReply = true
      this.replyForm.post_id = comment.post.id
      this.replyForm.parent_id = comment.id
      this.replyForm.author_id = comment.author.id
      this.replyForm.author_name = comment.author.username
    },
    onSubmitReply () {
      this.replyForm.errors = 0

      if (!this.replyForm.body) {
        this.replyForm.errors++
        this.replyForm.bodyError = 'Body is required.'
      } else {
        this.replyForm.bodyError = null
      }

      if (this.replyForm.errors > 0) {
        return false
      }

      // eslint-disable-next-line camelcase,no-unused-vars
      const at_who = `<a href="/user/${this.replyForm.author_id}">@${this.replyForm.author_name}</a>`
      const path = '/comments/'
      const payload = {
        // eslint-disable-next-line camelcase
        body: at_who + this.replyForm.body,
        post_id: this.replyForm.post_id,
        parent_id: this.replyForm.parent_id
      }
      this.$axios.post(path, payload)
        .then((res) => {
          this.$toasted.success('Success reply to the comment.', { icon: 'fingerprint' })
          this.onRestReply()
        })
        .catch((err) => {
          console.error(err)
        })
    },
    onRestReply () {
      this.isReply = false
      this.replyForm.body = ''
      this.replyForm.post_id = ''
      this.replyForm.parent_id = ''
      this.replyForm.author_id = ''
      this.replyForm.author_name = ''
      this.replyForm.bodyError = null
    },
    onMarkRead (comment) {
      const path = `/comments/${comment.id}`
      const payload = {
        mark_read: true
      }
      this.$axios.put(path, payload)
        .then((res) => {
          this.$toasted.success('Success mark this comment.', { icon: 'fingerprint' })
          this.getUserRecivedComments(this.sharedState.user_id)
        })
        .catch((err) => {
          console.error(err)
        })
    },
    onDeleteComment (comment) {
      this.$refs.confirm.confirm()
        .then((res) => {
          const path = `/comments/${comment.id}`
          this.$axios.delete(path)
            .then((res) => {
              this.getPostComments(this.$route.params.id)
            })
            .catch((error) => {
              console.error(error)
            })
        })
        // eslint-disable-next-line handle-callback-err
        .catch((err) => {
          console.log('the comment is safe.')
        })
    },
    onDisabledComment (comment) {
      const path = `/comments/${comment.id}`
      this.$axios.put(path, { disabled: true })
        .then((res) => {
          this.$toasted.success('disabled success', { icon: 'fingerprint' })
          this.getUserRecivedComments(this.sharedState.user_id)
        })
        .catch((err) => {
          console.error(err)
        })
    },
    onEnabledComment (comment) {
      const path = `/comments/${comment.id}`
      this.$axios.put(path, { disabled: false })
        .then((res) => {
          this.$toasted.success('enable success', { icon: 'fingerprint' })
          this.getUserRecivedComments(this.sharedState.user_id)
        })
        .catch((err) => {
          console.error(err)
        })
    }
  },
  created () {
    this.getUserRecivedComments(this.sharedState.user_id)
  },
  beforeRouteUpdate (to, from, next) {
    next()
    this.getUserRecivedComments(this.sharedState.user_id)
  }
}
</script>

<style scoped>
  #recived {
    width: 100%;
    height: 100%;
  }
  #re-header {
    width: 80%;
    font-size: 26px;
  }
  #re-message {
    width: 80%;
    border: 1px solid #fff;
    margin-bottom: 20px;
  }
  .re-title {
    display: flex;
    padding: 30px 0 0 50px;
  }
  p {
    margin-right: 30px;
  }
  .user-img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }
  .user-name {
    font-weight: bold;
    display: flex;
  }
  .media-body {
    padding-left: 100px;
    font-size: 20px;
  }
  .bottom {
    display: flex;
    padding-left: 180px;
    margin-top: -10px;
  }
  ul { display: flex }
  li { margin-right: 20px; }
</style>
