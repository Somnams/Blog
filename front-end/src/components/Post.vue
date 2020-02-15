<template>
  <div class="page">
    <nav-bar class="nav-bar" id="post-nav"/>
    <div>
      <header></header>
      <main class="main-content" v-if="post.author">
        <div>
          <div id="post-title">{{post.title}}</div>
          <div id="post-other">
            <span>{{post.author.username}}</span>
            <span>{{post.timestamp}}</span>
            <span>{{post.views}}次阅读</span>
          </div>
          <article>
            <vue-markdown
              :source="post.body"
              :toc="showToc"
              :toc-first-level="1"
              :toc-last-level="3"/>
            <br>
          </article>
          <confirm ref="confirm"/>
          <div class="operation" v-if="post.author.id == sharedState.user_id">
            <button @click="onDeletePost(post)" class="common-btn">delete</button>
            <button @click="toEdit" class="common-btn">edit</button>
          </div>
        </div>
      </main>
      <br>
      <br>
    </div>
  </div>
</template>

<script>
import NavBar from './NavBar'
import Confirm from './common/Confirm'
import store from '../store/store'
import VueMarkdown from 'vue-markdown'
import hljs from 'highlight.js'
const highLightCode = () => {
  const blocks = document.querySelectorAll('pre code')
  blocks.forEach((block) => {
    hljs.highlightBlock(block)
  })
}

export default {
  name: 'Post',
  components: {
    NavBar,
    VueMarkdown,
    Confirm
  },
  data () {
    return {
      sharedState: store.state,
      showToc: true,
      post: {}
    }
  },
  methods: {
    getPost (id) {
      const path = `/posts/${id}`
      this.$axios.get(path)
        .then((res) => {
          this.post = res.data
        })
        .catch((error) => {
          console.error(error)
        })
    },
    onDeletePost (post) {
      this.$refs.confirm.confirm()
        .then((res) => {
          console.log('delete.')
          const path = `/posts/${post.id}`
          this.$axios.delete(path)
            .then((res) => {
              console.log('delete successful')
              if (typeof this.$route.query.redirect === 'undefined') {
                this.$router.push('/blog')
              } else {
                this.$router.push(this.$route.query.redirect)
              }
            })
        })
        // eslint-disable-next-line handle-callback-err
        .catch((err) => {
          console.log('this post is safity')
        })
    },
    toEdit () {
      this.$router.push('/test/' + this.$route.params.id)
    }
  },
  created () {
    // eslint-disable-next-line camelcase
    const post_id = this.$route.params.id
    this.getPost(post_id)
  },
  mounted () {
    highLightCode()
  },
  updated () {
    highLightCode()
  }
}
</script>

<style scoped>
  #post-title {
    font-size: 30px;
    font-weight: bold;
    margin: 0;
  }
  #post-other {
    width: 100%;
    display: flex;
    margin-left: 60%;
  }
  span {
    margin-right: 20px;
    opacity: 0.6;
  }
  .operation {
    float: right;
  }
</style>
