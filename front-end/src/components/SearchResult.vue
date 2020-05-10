<template>
  <div class="page">
    <nav-bar class="nav-bar"/>
    <div>
      <header>
        <nav-header/>
      </header>
      <div class="main-content">
        <div v-if="posts">
          <div v-for="(post, index) in posts" :key="index">
            <div class="result">
              {{post}}
            </div>
          </div>
        </div>
        <confirm ref="confirm"/>
        <div v-if="posts">
          <pagination/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NavHeader from './common/nav/NavHeader'
import NavBar from './common/nav/NavBar'
import Pagination from './common/pagination/Pagination'
import store from '../store/store'
import { confirmMiXin } from '../common/mixin'

export default {
  name: 'SearchResult',
  components: {
    NavHeader,
    NavBar,
    Pagination
  },
  mixins: [confirmMiXin],
  data () {
    return {
      sharedState: store.state,
      posts: '',
      postForm: {
        title: '',
        summary: '',
        body: '',
        errors: 0,
        titleError: null,
        bodyError: null
      },
      editPostForm: {
        title: '',
        summary: '',
        body: '',
        errors: 0,
        titleError: null,
        bodyError: null
      }
    }
  },
  methods: {
    getSearchResult () {
      const q = this.$route.query.q
      let page = 1
      // eslint-disable-next-line camelcase
      let per_page = 10
      let path
      if (typeof this.$route.query.page !== 'undefined') {
        page = this.$route.query.page
      }
      if (typeof this.$route.query.per_page !== 'undefined') {
        // eslint-disable-next-line camelcase
        per_page = this.$route.query.per_page
      }
      if (typeof q !== 'undefined') {
        // eslint-disable-next-line camelcase
        path = `/search/?q=${q}&per_page=${per_page}`
      } else {
        // eslint-disable-next-line camelcase
        path = `/search/?page=${page}&per_page=${per_page}`
      }
      this.$axios.get(path)
        .then((res) => {
          this.posts = res.data.data
          if (res.data.data_meta.total_items > 0) {
            this.$toasted.success(res.data.message, { icon: 'fingerprint' })
          } else {
            this.$toasted.error('Can not find any result', { icon: 'fingerprint' })
          }
        })
        .catch((err) => {
          console.log(err.response.data)
          this.posts = ''
          this.$toasted.error(err.response.data.message, { icon: 'fingerrpint' })
        })
    },
    onEditPost (post) {
      this.editForm = Object.assign({}, post)
    },
    onSubmitUpdatePost () {
      this.editForm.errors = 0
      if (!this.editPostForm.title) {
        this.editForm.errors++
        this.editForm.titleError = 'Title is required.'
      } else {
        this.editForm.titleError = null
      }
      if (!this.editForm.body) {
        this.editForm.errors++
        this.editForm.bodyError = 'Body is required.'
      } else {
        this.editForm.bodyError = null
      }
      if (this.editForm.errors > 0) {
        return false
      }
      const path = `/posts/${this.editForm.id}`
      const payload = {
        title: this.editForm.title,
        summary: this.editForm.summary,
        body: this.editForm.body
      }
      this.$axios.post(path, payload)
        .then((res) => {
          this.getSearchResult()
          this.$toasted.success('Successfully update this post', { icon: 'fingerprint' })
          this.editForm.title = ''
          this.editForm.summary = ''
          this.editForm.body = ''
        })
        .catch((err) => {
          for (const field in err.response.data.message) {
            if (field === 'title') {
              this.editForm.titleError = err.response.data.message[field]
            } else if (field === 'body') {
              this.editForm.bodyError = err.response.data.message[field]
            }
          }
        })
    },
    onResetUpdatePost () {
      this.$toasted.info('Cancelled, the post is not update.', { icon: 'fingerprint' })
    },
    onDeletePost (post) {
      this.$refs.confirm.confirm()
        .then((res) => {
          const path = `/posts/${post.id}`
          this.$axios.delete(path)
            .then((res) => {
              this.$toasted.success('Delete successfully', { icon: 'fingerprint' })
              this.getSearchResult()
            })
            .catch((err) => {
              console.log(err)
            })
        })
    }
  },
  created () {
    this.getSearchResult()
  },
  beforeRouteUpdate (to, from, next) {
    next()
    this.getSearchResult()
  }
}
</script>

<style scoped>

</style>
