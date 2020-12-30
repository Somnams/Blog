<template>
  <div class="page">
    <nav-bar class="nav-bar" id="diary-nav"/>
    <div>
      <header></header>
      <main class="main-content" v-if="diary.author">
        <div class="passage">
          <h1>{{diary.title}}</h1>
          <div id="post-other">
            <div><img :src="imageDatas.iconzhucetouxiang" alt="" class="icon-img">: {{diary.author.username}}</div>
            <div><img :src="imageDatas.shijian" alt="" class="icon-img">{{diary.timestamp}}</div>
            <div><img :src="imageDatas.chakancishu" alt="" class="icon-img">{{diary.views}}</div>
          </div>
          <article>
            <vue-markdown
              :source="diary.body"
              :toc-first-level="1"
              :toc-last-level="3"/>
            <br>
          </article>
          <div class="operation" v-if="diary.author.id == sharedState.user_id">
            <a @click="onDeleteDiary(diary)" title="delete this diary">
              <img :src="imageDatas.shanchu" alt="" class="icon-img"></a>
            <a @click="toEdit" title="edit this diary">
              <img :src="imageDatas.bianji" alt="" class="icon-img"></a>
          </div>
        </div>
      </main>
      <confirm ref="confirm"/>
      <br>
      <br>
    </div>
  </div>
</template>

<script>
import NavBar from '@/components/common/nav/NavBar'
import store from '@/store/store'
import { confirmMiXin } from '@/common/mixin'
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
    VueMarkdown
  },
  mixins: [confirmMiXin],
  data () {
    return {
      sharedState: store.state,
      imageDatas: store.state.imageData,
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
              if (typeof this.$route.query.redirect === 'undefined') {
                this.$router.push('/life')
              } else {
                this.$router.push(this.$route.query.redirect)
              }
            })
        })
      // eslint-disable-next-line handle-callback-err
        .catch((err) => {
          this.$toasted.success('This Passage is safety.')
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
  .passage {
    margin-top: 50px;
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
  .operation a {
    margin-right: 50px;
  }
  textarea {
    color: #fff;
  }
  #replyForm textarea{
    border: 2px solid rgba(255, 255, 255, 0.5);
  }
</style>
