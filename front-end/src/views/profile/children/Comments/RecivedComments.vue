<template>
  <div class="page">
    <nav-bar class="nav-bar"/>
    <div>
      <div class="main-content">
        <div>
          <header id="re-header">
            Recived Comments
            <small v-if="comments">(TOTAL:{{comments._meta.total_items}} PAGE:{{comments._meta.total_pages}})</small>
          </header>
        </div>
        <div v-if="comments">
          <div v-for="(comment, index) in comments.items" :key="index" :id="'c' + comment.id">
            <div class="detail-body">
              <div class="comment">
                <div class="comment-title">
                  <router-link :to="{ path: `/user/${comment.author.id}` }" class="comment-img">
                <span v-if="comment.is_new">
                  <img :src="comment.author.avatar" class="user-img">
                  <img src="../../../../assets/icon-img/tubiaozhizuo-.svg" class="icon-img-dian">
                </span>
                    <span v-else>
              <img :src="comment.author.avatar" alt="" class="user-img">
            </span>
                  </router-link>
                  <span class="user-name">
                <span>{{comment.author.username}}</span>
                <span>{{ $moment(comment.timestamp).format('YYYY/MM/DD HH:mm:ss') }}</span>
                <span>( {{comment.post.title}} )</span>
            </span>
                </div>
                <div class="comment-body">
                  <div v-if="comment.disabled">
                    <small>This comment has been disabled.</small>
                  </div>
                  <div v-else>
                    {{comment.body}}
                  </div>
                </div>
                <div class="comment-bottom">
                  <ul>
                    <li v-if="!comment.mark_read">
                      <a @click="onMarkRead(comment)" title="mark_read">
                        <img src="../../../../assets/icon-img/978weiduxinxi.svg" alt="" class="icon-img">
                      </a>
                    </li>
                    <li v-else>
                      <img src="../../../../assets/icon-img/biaoshilei_yiduxinxi.svg" alt="" class="icon-img">
                    </li>
                    <li>
                      <a @click="onClickReply(comment)" title="reply">
                        <img src="../../../../assets/icon-img/tubiaozhizuo-_1.svg" alt="" class="icon-img">
                      </a>
                    </li>
                    <li>
                      <router-link :to="{ path: `/blog/post/${comment.post.id}`}" title="passage">
                        <img src="../../../../assets/icon-img/wenzhangguanli.svg" alt="" class="icon-img">
                      </router-link>
                    </li>
                    <li v-if="comment.disabled">
                      <a @click="onEnabledComment(comment)" title="enabled">
                        <img src="../../../../assets/icon-img/kanjian.svg" alt="" class="icon-img">
                      </a>
                    </li>
                    <li v-if="!comment.disabled">
                      <a @click="onDisabledComment(comment)" title="disabled">
                        <img src="../../../../assets/icon-img/lahei.svg" alt="" class="icon-img">
                      </a>
                    </li>
                    <li v-if="!comment.disabled">
                      <a @click="onDeleteComment(comment)" title="delete">
                        <img src="../../../../assets/icon-img/shanchu.svg" alt="" class="icon-img">
                      </a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="comments">
          <pagination :cur-page="comments._meta.page"
                      :per-page="comments._meta.per_page"
                      :total-pages="comments._meta.total_pages" class="list-nav">
          </pagination>
        </div>
        <br>
        <br>
        <confirm ref="confirm"/>
        <reply ref="reply"/>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from '../../../../components/common/nav/NavBar'
import store from '../../../../store/store'
import Pagination from '../../../../components/common/pagination/Pagination'
import Reply from '../../../../components/common/comment/Reply'
import { confirmMiXin } from '../../../../common/mixin'
export default {
  name: 'RecivedComments',
  components: {
    NavBar,
    Pagination,
    Reply
  },
  mixins: [confirmMiXin],
  data () {
    return {
      sharedState: store.state,
      user: '',
      notifications: {
        unread_recived_comments_counts: 0,
        unread_follows_count: 0,
        unread_likes_count: 0,
        unread_followeds_posts_count: 0
      },
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
    },
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
      if (!this.sharedState.is_authenticated) {
        this.$toasted.error('You should login', { icon: 'fingerprint' })
        this.$router.replace({
          path: '/login',
          query: { redirect: this.$route.path + '#c' + comment.id }
        })
      } else {
        this.$refs.reply.confirm()
          .then((res) => {
            this.replyForm.parent_id = comment.id
            this.replyForm.author_id = comment.post.author_id
            this.replyForm.author_name = comment.author.username
            this.replyForm.post_id = comment.post.id
            const Form = this.$refs.reply.Form
            const path = '/comments/'
            // 回复评论
            // eslint-disable-next-line camelcase
            const at_who = `@${this.replyForm.author_name}  `
            const payload = {
              // eslint-disable-next-line camelcase
              body: at_who + Form.body,
              post_id: this.replyForm.post_id,
              parent_id: this.replyForm.parent_id
            }

            this.$axios.post(path, payload)
              .then((res) => {
                this.$toasted.success('Successed add a new comment', { icon: 'fingerprint' })
              })
              .catch((err) => {
                console.log(err.res.data)
                this.$toasted.error(err.res.data.message, { icon: 'fingerprint' })
              })
            // eslint-disable-next-line handle-callback-err
          }).catch(err => { console.log('this box is cloesed') })
      }
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
    // eslint-disable-next-line camelcase
    const user_id = this.sharedState.user_id
    this.getUser(user_id)
    this.getUserNotifications(user_id)
    this.getUserRecivedComments(user_id)
  },
  beforeRouteUpdate (to, from, next) {
    next()
    this.getUserNotifications(this.sharedState.user_id)
    this.getUserRecivedComments(this.sharedState.user_id)
  }
}

</script>

<style scoped>
  .detail-body {
    margin-bottom: 20px;
    display: flex;
  }
  .comment {
    width: 90%;
    margin-left: 30px;
    border: 1px #ddd solid;
    border-radius: 8px;
    display: inline-block;
  }
  .comment-title {
    display: flex;
    margin: 20px 0 0 20px;
    -webkit-box-orient: horizontal;
    border-bottom: 1px #928bad solid;
  }
  .comment-title span {
    margin-right: 20px;
  }
  .comment-body {
    margin-left: 20px;
  }
  .comment-bottom {
    float: right;
  }
  #re-header {
    width: 80%;
    font-size: 26px;
  }
  .user-name {
    margin-top: 20px;
  }
  ul li {
    display: inline;
    margin-right: 15px;
  }
</style>
