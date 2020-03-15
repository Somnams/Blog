<template>
  <div id="app" class="page">
    <router-view v-if="isRouterAlive"/>
  </div>
</template>

<script>
export default {
  name: 'app',
  provide () {
    return {
      reload: this.reload
    }
  },
  data () {
    return {
      isRouterAlive: true
    }
  },
  methods: {
    reload () {
      this.isRouterAlive = false
      this.$nextTick(function () {
        this.isRouterAlive = true
      })
    }
  }
}
</script>

<style>
  @import "assets/commen.css";
</style>
