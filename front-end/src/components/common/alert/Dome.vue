<template>
  <div class="demo">
    <blog-alert
      type="success"
      title="error"
      message="hi~welcome to my blog!"
    />
    <blog-alert
      type="error"
      title="error"
      message="hi~welcome to my blog!"
    />
    <blog-alert
      type="warn"
      title="warning"
    />
    <blog-alert
      type="info"
      title="info"
      message="oooooooo"
    />
    <blog-alert/>

    <div class="footer">
      <button @click="showAlert">click here</button>
    </div>
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
  },
  methods: {
    showAlert () {
      this.$alert('error', {
        title: 'err',
        message: 'this.$alert?????',
        autoClose: false
      })
    },
  }
}
</script>

<style scoped>
.demo {
  position: relative;
  top: 10px;
}
.footer {
  position: relative;
  top: 100px;
}
</style>
