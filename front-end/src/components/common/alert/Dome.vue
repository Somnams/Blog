<template>
  <div>
    <blog-alert
      type="success"
      title="error"
      message="hi~welcome to my blog!"
    />
    <blog-alert
      type="success"
      title="error"
      message="hi~welcome to my blog!"
    />
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
