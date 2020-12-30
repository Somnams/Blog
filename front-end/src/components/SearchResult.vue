<template>
  <div class="page">
    <nav-bar class="nav-bar" />
    <div>
      <header>
        <nav-header />
      </header>
      <div class="main-content">
        <h3>
          All posts <small v-if="posts">({{ posts._meta.total_items }} / {{ posts._meta.total_pages }})</small>
        </h3>
        <div v-if="posts">
          <div
            v-for="(post, index) in posts.items"
            :key="index"
          >
            <div class="result">
              <div class="res-title">
                <router-link :to="{ name: 'Post', params: { id: post.id } }">
                  <vue-markdown :source="post.title" />
                </router-link>
              </div>
              <div class="res-body">
                <vue-markdown :source="post.summary" />
              </div>
              <ul class="res-other">
                <li>
                  <img
                    :src="imageDatas.iconzhucetouxiang"
                    class="icon-img"
                  >
                  <router-link :to="{ path: `/user/${post.author.id}` }">
                    {{ post.author.username }}
                  </router-link>
                </li>
                <li>
                  <img
                    :src="imageDatas.shijian"
                    class="icon-img"
                  ><span class="icon-font">{{
                    $moment(post.timestamp).format('YYYY/MM/DD HH:mm:ss')
                  }}</span>
                </li>
                <li>
                  <img
                    :src="imageDatas.chakancishu"
                    class="icon-img"
                  >{{ post.views }}
                </li>
              </ul>
            </div>
          </div>
        </div>
        <confirm ref="confirm" />
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
</template>

<script>
import NavHeader from './common/nav/NavHeader';
import NavBar from './common/nav/NavBar';
import Pagination from './common/pagination/Pagination';
import store from '@/store/store';
import VueMarkdown from 'vue-markdown';
import { confirmMiXin } from '@/common/mixin';

export default {
  name: 'SearchResult',
  components: {
    NavHeader,
    NavBar,
    VueMarkdown,
    Pagination,
  },
  mixins: [confirmMiXin],
  data() {
    return {
      sharedState: store.state,
      imageDatas: store.state.imageData,
      posts: '',
      postForm: {
        title: '',
        summary: '',
        body: '',
        errors: 0,
        titleError: null,
        bodyError: null,
      },
      editPostForm: {
        title: '',
        summary: '',
        body: '',
        errors: 0,
        titleError: null,
        bodyError: null,
      },
    };
  },
  created() {
    this.getSearchResult();
  },
  methods: {
    getSearchResult() {
      const { q } = this.$route.query;
      let page = 1;
      // eslint-disable-next-line camelcase
      let per_page = 10;
      let path;
      if (typeof this.$route.query.page !== 'undefined') {
        page = this.$route.query.page;
      }
      if (typeof this.$route.query.per_page !== 'undefined') {
        // eslint-disable-next-line camelcase
        per_page = this.$route.query.per_page;
      }
      if (typeof q !== 'undefined') {
        // eslint-disable-next-line camelcase
        path = `/search/?q=${q}&page=${page}&per_page=${per_page}`;
      } else {
        // eslint-disable-next-line camelcase
        path = `/search/?page=${page}&per_page=${per_page}`;
      }
      this.$axios
        .get(path)
        .then(res => {
          this.posts = res.data.data;
          if (res.data.data._meta.total_items > 0) {
            this.$toasted.success(res.data.message, { icon: 'fingerprint' });
          } else {
            this.$toasted.error('Can not find any result', { icon: 'fingerprint' });
          }
        })
        .catch(err => {
          console.log(err.response.data);
          this.posts = '';
          this.$toasted.error(err.response.data.message, { icon: 'fingerrpint' });
        });
    },
    // onEditPost (post) {
    //   this.editForm = Object.assign({}, post)
    // },
    // onSubmitUpdatePost () {
    //   this.editForm.errors = 0
    //   if (!this.editPostForm.title) {
    //     this.editForm.errors++
    //     this.editForm.titleError = 'Title is required.'
    //   } else {
    //     this.editForm.titleError = null
    //   }
    //   if (!this.editForm.body) {
    //     this.editForm.errors++
    //     this.editForm.bodyError = 'Body is required.'
    //   } else {
    //     this.editForm.bodyError = null
    //   }
    //   if (this.editForm.errors > 0) {
    //     return false
    //   }
    //   const path = `/posts/${this.editForm.id}`
    //   const payload = {
    //     title: this.editForm.title,
    //     summary: this.editForm.summary,
    //     body: this.editForm.body
    //   }
    //   this.$axios.post(path, payload)
    //     .then((res) => {
    //       this.getSearchResult()
    //       this.$toasted.success('Successfully update this post', { icon: 'fingerprint' })
    //       this.editForm.title = ''
    //       this.editForm.summary = ''
    //       this.editForm.body = ''
    //     })
    //     .catch((err) => {
    //       for (const field in err.response.data.message) {
    //         if (field === 'title') {
    //           this.editForm.titleError = err.response.data.message[field]
    //         } else if (field === 'body') {
    //           this.editForm.bodyError = err.response.data.message[field]
    //         }
    //       }
    //     })
    // },
    // onResetUpdatePost () {
    //   this.$toasted.info('Cancelled, the post is not update.', { icon: 'fingerprint' })
    // },
    onDeletePost(post) {
      this.$refs.confirm.confirm().then(res => {
        const path = `/posts/${post.id}`;
        this.$axios
          .delete(path)
          .then(res => {
            this.$toasted.success('Delete successfully', { icon: 'fingerprint' });
            this.getSearchResult();
          })
          .catch(err => {
            console.log(err);
          });
      });
    },
  },
  beforeRouteUpdate(to, from, next) {
    next();
    this.getSearchResult();
  },
};
</script>

<style scoped>
.result {
  width: 100%;
  position: relative;
  right: 0;
}
.res-title {
  font-size: 20px;
  font-weight: bold;
  padding-top: 20px;
  border-bottom: 2px #928bad solid;
}
.res-body {
}
.res-other {
  display: inline-flex;
  float: right;
}
</style>
