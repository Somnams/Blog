<template>
  <div>
    <blog-alert
      type="error"
      title="errorTitle"
      message="????"/>
  </div>
</template>

<script>
import BlogAlert from '@components/common/alert/BlogAlert'
export default {
  name: 'Dome',
  components: { BlogAlert },
  data () {
    return {

    }
  }
}
</script>

<style scoped>

</style>
