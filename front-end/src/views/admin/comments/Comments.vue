<template>
    <div>
      <header>
        <h3></h3>
      </header>
      <div class="admin-content">
        <div class="role-wrapper">
          <h3>Comments</h3>
          <div v-if="comments">
            <div v-for="(comment, index) in comments.items" :key="index" :id="'c' + comment.id">
              <div class="detail-body">
                <div class="comment">
                  <div class="comment-title">
                    <router-link :to="{ path: `/user/${comment.author.id}` }" class="comment-img">
                <span v-if="comment.is_new">
                  <img :src="comment.author.avatar" class="user-img">
                  <img src="../../../assets/icon-img/tubiaozhizuo-.svg" class="icon-img-dian">
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
                          <img src="../../../assets/icon-img/978weiduxinxi.svg" alt="" class="icon-img">
                        </a>
                      </li>
                      <li v-else>
                        <img src="../../../assets/icon-img/biaoshilei_yiduxinxi.svg" alt="" class="icon-img">
                      </li>
                      <li>
                        <router-link :to="{ path: `/blog/post/${comment.post.id}`}" title="passage">
                          <img src="../../../assets/icon-img/wenzhangguanli.svg" alt="" class="icon-img">
                        </router-link>
                      </li>
                      <li v-if="comment.disabled">
                        <a @click="onEnabledComment(comment)" title="enabled">
                          <img src="../../../assets/icon-img/kanjian.svg" alt="" class="icon-img">
                        </a>
                      </li>
                      <li v-if="!comment.disabled">
                        <a @click="onDisabledComment(comment)" title="disabled">
                          <img src="../../../assets/icon-img/lahei.svg" alt="" class="icon-img">
                        </a>
                      </li>
                      <li v-if="!comment.disabled">
                        <a @click="onDeleteComment(comment)" title="delete">
                          <img src="../../../assets/icon-img/shanchu.svg" alt="" class="icon-img">
                        </a></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <confirm ref="confirm"/>
        <div v-if="comments && comments._meta.total_pages > 1">
          <pagination :cur-page="comments._meta.page"
                      :per_page="comments._meta.per_page"
                      :total-pages="comments._meta.total_pages"/>
        </div>
      </div>
    </div>
</template>

<script>
import { confirmMiXin } from '../../../common/mixin'
import Pagination from '../../../components/common/pagination/Pagination'

export default {
  name: 'Comments',
  data () {
    return {
      comments: ''
    }
  },
  components: {
    Pagination
  },
  mixins: [confirmMiXin],
  methods: {
    getComments () {
      let page = 1
      // eslint-disable-next-line camelcase
      const per_page = 10
      // eslint-disable-next-line camelcase
      if (typeof this.$route.query.page !== 'undefined') {
        page = this.$route.query.page
      }
      // if (typeof this.$route.query.per_page !== 'undefined') {
      //   // eslint-disable-next-line camelcase
      //   per_page = this.$route.query.per_page
      // }
      // eslint-disable-next-line camelcase
      const path = `comments/?page=${page}&per_page=${per_page}`
      this.$axios.get(path)
        .then((res) => {
          this.comments = res.data
        })
        .catch((err) => {
          console.log(err)
        })
    },
    onDeleteComment (comment) {
      this.$refs.confirm.confirm()
        .then((res) => {
          const path = `comments/${comment.id}`
          this.$axios.delete(path)
            .then((res) => {
              this.$toasted.success('Delete this comment success', { icon: 'fingerprint' })
            })
            .catch((err) => {
              console.log(err)
            })
        })
        .catch((err) => {
          console.log(err)
          this.$toasted.success('This comment is safe', { icon: 'fingerprint' })
        })
    },
    onDisabledComment (comment) {
      const path = `comments/${comment.id}`
      this.$axios.put(path, { disabled: true })
        .then((res) => {
          this.$toasted.success('Disabled success', { icon: 'fingerprint' })
          this.getComments()
        })
        .catch((err) => {
          this.$toasted.error(err.response.data.message, { icon: 'fingerprint' })
        })
    },
    onEnabledComment (comment) {
      const path = `comments/${comment.id}`
      this.$axios.put(path, { disabled: false })
        .then((res) => {
          this.$toasted.success('enabled success', { icon: 'fingerprint' })
          this.getComments()
        })
        .catch((err) => {
          console.log(err)
        })
    },
    onMarkRead (comment) {
      const path = `/comments/${comment.id}`
      const payload = {
        mark_read: true
      }
      this.$axios.put(path, payload)
        .then((res) => {
          this.$toasted.success('Marked success', { icon: 'fingerprint' })
          this.getComments()
        })
        .catch((err) => {
          console.error(err)
        })
    }
  },
  created () {
    this.getComments()
  },
  beforeRouteUpdate (to, from, next) {
    next()
    this.getComments()
  }
}
</script>

<style scoped>
  .detail-body {
    margin: 20px auto;
    width: 90%;
    display: flex;
  }
  .comment {
    width: 90%;
    margin: 0 auto;
    border: 1px #ddd solid;
    border-radius: 8px;
    display: inline-block;
  }
  .comment-title {
    width: 90%;
    display: inline-block;
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
  ul li {
    display: inline;
    margin-right: 15px;
  }
  .user-name {
    margin-top: 20px;
  }
</style>
