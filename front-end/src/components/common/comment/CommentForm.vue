<template>
  <div>
    <img src="" alt="">Comments Area
    <form>
      <textarea v-model="formData" cols="30" rows="10" placeholder="Please input your comment."></textarea>
      <button type="submit" :disabled="disabled">submit</button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'CommentForm.vue',
  data() {
    return {
      formData: '',
      disabled: true
    }
  },
  methods: {
    onSubmit() {
      if (!this.formData) {
        this.disabled = true;
        return false;
      }
      this.disabled = false;
      console.log(this.formData);
    }
  }
}
</script>

<style scoped>

</style>
