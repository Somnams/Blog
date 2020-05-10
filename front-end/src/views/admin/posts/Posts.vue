<template>
  <div>
    <header><h3></h3></header>
    <div class="admin-content">
      <div class="role-wrapper">
        <h3>Posts</h3>
        <table class="table-reason" cellspacing="0" cellpadding="0">
          <thead>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Time</th>
            <th>Author</th>
            <th>Action</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(post, index) in posts.items" :key="index">
            <th>{{ index + 1 }}</th>
            <td>
              <router-link :to="{name: 'Post', params: { id: post.id}}">
                {{ post.title }}
              </router-link>
            </td>
            <td>
              <span>{{ $moment(post.timestamp).format('YYYY-MM-DD HH:mm:ss') }}</span>
            </td>
            <td>
              <router-link :to="{ path: `user/${post.author.id}`}">
                {{post.author.username}}
              </router-link>
            </td>
            <td>
              <a @click="onDeletePost(post)">
                <img src="../../../assets/icon-img/shanchu.svg" alt="" title="delete this post" class="icon-img">
              </a>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
      <confirm ref="confirm"/>
      <div v-if="posts && posts._meta.total_pages > 1">
        <pagination :cur-page="posts._meta.page"
                    :per-page="posts._meta.per_page"
                    :total-pages="posts._meta.total_pages"/>
      </div>
    </div>
  </div>
</template>

<script>
import Pagination from '../../../components/common/pagination/Pagination'
import { confirmMiXin } from '../../../common/mixin'

export default {
  name: 'Posts',
  data () {
    return {
      posts: ''
    }
  },
  components: {
    Pagination
  },
  mixins: [confirmMiXin],
  methods: {
    getPosts () {
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
      // eslint-disable-next-line camelcase
      const path = `posts/?page=${page}&per_page=${per_page}`
      this.$axios.get(path)
        .then((res) => {
          this.posts = res.data
        })
        .catch((err) => {
          console.error(err)
        })
    },
    onDeletePost (post) {
      this.$refs.confirm.confirm()
        .then((res) => {
          const path = `posts/${post.id}`
          this.$axios.delete(path)
            .then((res) => {
              this.$toasted.success('delete this post success', { icon: 'fingerprint' })
              this.getPosts()
            })
            .catch((err) => {
              console.log(err)
            })
        })
        .catch((err) => {
          console.log(err)
          this.$toasted.success('This post is safe', { icon: 'fingerprint' })
        })
    }
  },
  created () {
    this.getPosts()
  },
  beforeRouteUpdate (to, from, next) {
    next()
    this.getPosts()
  }
}
</script>

<style scoped>

</style>
