<template>
  <div class="page">
    <nav-bar class="nav-bar" id="diary-nav"/>
    <div>
      <header></header>
      <main class="main-content" v-if="diary.author">
        <div>
          <div id="post-title">{{diary.title}}</div>
          <div id="post-other">
            <span>{{diary.author.username}}</span>
            <span>{{diary.timestamp}}</span>
            <span>{{diary.views}}次阅读</span>
          </div>
          <article>
            <vue-markdown
              :source="diary.body"
              :toc-first-level="1"
              :toc-last-level="3"/>
            <br>
          </article>
          <confirm ref="confirm"/>
          <div class="operation" v-if="diary.author.id == sharedState.user_id">
            <button @click="onDeleteDiary(diary)" class="common-btn">delete</button>
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
import NavBar from '../../../components/common/nav/NavBar'
import Confirm from '../../../components/common/confirm/Confirm'
import store from '../../../store/store'
import VueMarkdown from 'vue-markdown'
import hljs from 'highlight.js'
const highLightCode = () => {
  const blocks = document.querySelectorAll('pre code')
  blocks.forEach((block) => {
    hljs.highlightBlock(block)
  })
}

export default {
  name: 'Passage',
  components: {
    NavBar,
    VueMarkdown,
    Confirm
  },
  data () {
    return {
      sharedState: store.state,
      diary: {}
    }
  },
  methods: {
    getDiary (id) {
      const path = `/diaries/${id}`
      this.$axios.get(path)
        .then((res) => {
          this.diary = res.data
        })
        .catch((error) => {
          console.error(error)
        })
    },
    onDeleteDiary (diary) {
      this.$refs.confirm.confirm()
        .then((res) => {
          const path = `/diaries/${diary.id}`
          this.$axios.delete(path)
            .then((res) => {
              console.log('delete successful')
              if (typeof this.$route.query.redirect === 'undefined') {
                this.$router.push('/life')
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
    const diary_id = this.$route.params.id
    this.getDiary(diary_id)
    this.onDeleteDiary(diary_id)
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
  textarea {
    color: #fff;
  }
  #replyForm textarea{
    border: 2px solid rgba(255, 255, 255, 0.5);
  }
</style>
