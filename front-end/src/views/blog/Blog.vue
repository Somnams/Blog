<template>
  <div class="page">
    <nav-bar class="nav-bar" id="blog-nav"/>
    <div>
      <header>
        <nav-header/>
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
        <div v-if="sharedState.user_perms.includes('write')">
          <router-link to="/post-operation/add">
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
import NavBar from '@/components/common/nav/NavBar';
import NavHeader from '@/components/common/nav/NavHeader';
import List from '@/components/common/list/List';
import Pagination from '@/components/common/pagination/Pagination';
import store from '@/store/store';

export default {
  name: 'Blog',
  components: {
    NavBar,
    List,
    Pagination,
    NavHeader
  },
  data () {
    return {
      sharedState: store.state,
      posts: ''
    }
  },
  computed: {
    path() {
      return this.$route.path;
    }
  },
  watch: {
    path(newVal, oldVal) {
      newVal === '/blog' && this.getPosts();
    }
  },
  methods: {
    getPosts() {
      const page = typeof this.$route.query.page === 'undefined' ? 1 : this.$route.query.page;
      const perPage = typeof this.$route.query.per_page === 'undefined' ? 10 : this.$route.query.per_page;
      const path = `/posts/?page=${page}&per_page=${perPage}`;
      this.$axios.get(path)
        .then(({data}) => {
          this.posts = data;
        })
        .catch(e => {
          console.error(e);
          this.$alert('error', {title: 'Error', message: 'Request Error.'});
        });
    }
  },
  created () {
    this.getPosts();
  },
  // updated () {
  //   this.$bus.$on('deletePost', this.getPosts);
  // },
  beforeRouteUpdate (to, from, next) {
    next();
    this.getPosts();
  }
}
</script>

<style scoped>
  #blog-content {
    clear: both;
    top: 50px;
    display: block;
    margin-top: 200px;
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
