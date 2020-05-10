<template>
    <div class="grid-list" v-if="article">
      <div class="article-list">
        <div class="article-title" v-if="currentPath == 'Life'">
          <a @click="toPassage(article.id)">
            {{article.title}}
          </a>
        </div>
        <div class="article-title" v-else>
          <a @click="toPost(article.id)">
            {{article.title}}
          </a>
        </div>
        <div class="article-other">
          <img src="../../../assets/icon-img/iconzhucetouxiang.svg" alt="" class="icon-img">
          :{{article.author.username}}
          <span>
            <img src="../../../assets/icon-img/shijian.svg" alt="" class="icon-img">
            :{{article.timestamp}}</span></div>
        <div class="article-body">SUMMARY:{{article.summary}}</div>
      </div>
    </div>
</template>

<script>
export default {
  name: 'List',
  data () {
    return {
      currentPath: ''
    }
  },
  props: {
    article: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  methods: {
    toPassage (id) {
      this.$router.push(`/life/diary/${id}`)
    },
    toPost (id) {
      this.$router.push(`/blog/post/${id}`)
    }
  },
  created () {
    this.currentPath = this.$route.name.name
  }
}
</script>

<style scoped>
  .article-list {
    width: 80%;
    margin: 0 auto;
    padding: 30px;
    border-radius: 20px;
  }
  .article-title {
    font-size: 28px;
    font-weight: bold;
    border-bottom: 2px solid #fff;
  }
  .article-other {
    float: right;
    border-bottom: 1px solid #fff;
  }
  .article-body {
    margin-top: 50px;
  }
</style>
