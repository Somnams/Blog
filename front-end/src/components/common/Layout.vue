<template>
  <div class="page">
    <nav-bar class="sidebar"/>
    <div>
      <header><nav-header/></header>
      <div class="main-content">
        <slot name="content"></slot>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from '@components/common/nav/NavBar';
import NavHeader from '@components/common/nav/NavHeader';
export default {
  name: 'Layout',
  components: {
    NavBar,
    NavHeader
  }
}
</script>

<style scoped>

</style>
