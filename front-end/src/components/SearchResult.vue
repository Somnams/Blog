<template>
  <div class="page">
    <nav-bar class="nav-bar" />
    <div>
      <header>
        <nav-header />
      </header>
      <div class="main-content" v-if="posts">
        <h3>
          All posts: total posts {{posts._meta.total_items}} total pages: {{ posts._meta.total_pages }}
        </h3>
        <div v-for="(post, index) in posts.items" :key="index">
          <div class="result-post">
            <router-link :to="{name: 'Post', params: {id: post.id}}">
              <markdown-preview :initialValue="post.summary" theme="dark" />
            </router-link>
            <div class="result-post-footer">
              <img :src="imageData.iconzhucetouxiang" alt="author" class="icon-img">{{post.author.username}}
              <img :src="imageData.shijian" alt="timestamp" class="icon-img">{{post.timestamp}}
              <img :src="imageData.chakancishu" alt="view" class="icon-img">{{post.views}}
            </div>
          </div>
        </div>
        <div>
        <div v-if="posts && posts._meta.total_pages > 1">
          <pagination
            :cur-page="posts._meta.page"
            :per-page="posts._meta.per_page"
            :total-pages="posts._meta.total_pages"
          />
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
import NavHeader from './common/nav/NavHeader';
import NavBar from './common/nav/NavBar';
import Pagination from './common/pagination/Pagination';
import store from '@/store/store';
import {MarkdownPreview} from 'vue-meditor';

export default {
  name: 'SearchResult',
  components: {
    NavHeader,
    NavBar,
    MarkdownPreview,
    Pagination,
  },
  data() {
    return {
      posts: ''
    };
  },
  computed: {
    imageData() {
      return store.state.imageData;
    }
  },
  created() {
    this.getSearchResult();
  },
  methods: {
    getSearchResult() {
      const {q} = this.$route.query;
      const page = typeof this.$route.query.page === 'undefined' ? 1 : this.$route.query.page;
      const perPage = typeof this.$route.query.per_page === 'undefined' ? 10 : this.$route.query.per_page;
      const path = typeof  q === 'undefined' ?
        `/search/?page=${page}&per_page=${perPage}`
        :
        `/search/?q=${q}&page=${page}&per_page=${perPage}`;
      this.$axios.get(path)
        .then(({data}) => {
          if (data.data._meta.total_items > 0) {
            this.posts = data.data;
            this.$toasted.success(data.message);
          } else {
            this.$toasted.error('Can not find anymore.');
          }
        })
        .catch(e => {
          console.log(e);
          this.$toasted.error(e.message);
        })
    },
  },
  beforeRouteUpdate(to, from, next) {
    next();
    this.getSearchResult();
  },
};
</script>

<style lang="scss" scoped>
$borderWidth: 3px;
.result-post {
  width: 100%;
  margin-bottom: 20px;
  position: relative;
  z-index: 2;
  border-radius: $borderWidth;
  .result-post-footer {
    display: flex;
    justify-content: flex-end;
  }
}
.result-post:after {
  content: "";
  position: absolute;
  top: calc(-1 * #{$borderWidth} * 2);
  left: 0;
  height: $borderWidth * 2;
  width: 100%;
  background: linear-gradient(60deg, #f79533, #f37055, #ef4e7b, #a166ab, #5073b8, #1098ad, #07b39b, #6fba82);
  z-index: -1;
}
</style>

