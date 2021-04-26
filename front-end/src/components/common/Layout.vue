<template>
  <div class="page">
    <nav-bar class="sidebar"/>
    <div>
      <header class="layout-header"><nav-header/></header>
      <div class="main-content layout-content">
        <slot name="content"></slot>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from '@components/common/nav/NavBar';
import NavHeader from '@components/common/nav/NavHeader';
// import Life from '@/views/life/Life';
export default {
  name: 'Layout',
  components: {
    NavBar,
    NavHeader,
    // Life
  }
}
</script>

<style scoped>
.layout-header {
  position: sticky;
  top: 10px;
}
.layout-content {
  top: 80px;
}
</style>
