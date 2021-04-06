<template>
  <div class="page">
    <header><router-link :to="{path: '/'}">home</router-link></header>
    <main class="">
      <slot></slot>
    </main>
  </div>
</template>

<script>
export default {
  name: 'test'
}
</script>

<style scoped>

</style>
