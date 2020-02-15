<template>
  <div class="page">
    <nav-bar class="nav-bar" id="blog-nav"/>
    <div>
      <header>
        blog
      </header>
      <div class="main-content">
        <router-link to="/add">
          <button class="common-btn">Add</button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from '../NavBar'
export default {
  name: 'Blog',
  data () {
    return {
      posts: ''
    }
  },
  components: {
    NavBar
  }
}
</script>

<style scoped>
</style>
