<template>
  <div class="page">
    <nav-bar class="nav-bar" id="life-nav"/>
    <div>
      <header>
        Life  List
      </header>
      <div class="main-content" id="life-content">
        <div v-if="diaries" class="content">
          <div v-for="(item, index) in diaries.items" :key="index">
            <list :article="item" class="article-area"/>
          </div>
        </div>
        <div v-if="diaries && diaries._meta.total_pages > 1">
          <pagination :cur-page="diaries._meta.page"
                      :per-page="diaries._meta.per_page"
                      :total-pages="diaries._meta.total_pages" class="list-nav">
          </pagination>
        </div>
        <router-link to="/addlife">
          <button class="common-btn">Add</button>
        </router-link>
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
export default {
  name: 'Life',
  components: {
    NavBar,
    List,
    Pagination
  },
  data () {
    return {
      diaries: ''
    }
  },
  methods: {
    getDiaries () {
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
      const path = `/diaries/?page=${page}&per_page=${per_page}`
      this.$axios.get(path)
        .then((res) => {
          this.diaries = res.data
        })
        .catch((err) => {
          console.error(err)
        })
    }
  },
  created () {
    this.getDiaries()
  },
  beforeRouteUpdate (to, from, next) {
    next()
    this.getDiaries()
  }
}
</script>

<style scoped>
  #life-content {
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
