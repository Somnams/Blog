<template>
    <div class="alert" role="alert" :class="'alert-' + variant">
      {{ message }}
    </div>
</template>

<script>
export default {
  name: 'Alert',
  props: ['id', 'variant', 'message']
}
</script>

<style scoped>
  .alert {
    background: #ee9ca7;
  }
</style>
