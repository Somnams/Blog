<template>
  <div class="page">
    <nav-bar class="nav-bar" id="blog-nav"/>
    <div>
      <header>
        Blog  List
      </header>
      <div class="main-content" id="blog-content">
        <div v-if="posts" class="content">
          <div v-for="(item, index) in posts.items" :key="index">
            <list :article="item" class="article-area"/>
          </div>
        </div>
        <div v-if="posts && posts._meta.total_pages > 1">
          <pagination :cur-page="posts._meta.page"
                      :per-page="posts._meta.per_page"
                      :total-pages="posts._meta.total_pages" class="list-nav">
          </pagination>
        </div>
        <div>
          <router-link to="/add">
            <button class="common-btn">Add</button>
          </router-link>
        </div>
      </div>
    </div>
    <br>
    <br>
  </div>
</template>

<script>
import NavBar from '../../components/common/nav/NavBar'
import List from '../../components/common/list/List'
import Pagination from '../../components/common/pagination/Pagination'
import store from '../../store/store'

export default {
  name: 'Blog',
  components: {
    NavBar,
    List,
    Pagination
  },
  data () {
    return {
      sharedState: store.state,
      posts: ''
    }
  },
  methods: {
    getPosts () {
      // eslint-disable-next-line no-unused-vars
      let page = 1
      // eslint-disable-next-line camelcase,no-unused-vars
      let per_page = 5
      if (typeof this.$route.query.page !== 'undefined') {
        page = this.$route.query.page
      }

      if (typeof this.$route.query.per_page !== 'undefined') {
        // eslint-disable-next-line camelcase
        per_page = this.$route.query.per_page
      }

      // eslint-disable-next-line camelcase
      const path = `/posts/?page=${page}&per_page=${per_page}`
      this.$axios.get(path)
        .then((res) => {
          this.posts = res.data
        })
        .catch((err) => {
          console.error(err)
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
  #blog-content {
    clear: both;
    display: block;
  }
  .content {
    width: 100%
  }
  .article-area {
    margin-bottom: 30px;
  }
  button {
    float: right;
  }
  .list-nav {
    margin-bottom: 40px;
  }
</style>
