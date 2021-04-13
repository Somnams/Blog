<template>
  <div class="markdown-edit">
    <div class="markdown-none-sidebar" @click="onClickSidebar"></div>
    <form class="markdown-sidebar" v-show="sidebarVisible">
      <span class="markdown-input-label">Title:</span>
      <input type="text" class="markdown-input" v-model="title" required />
      <span class="markdown-input-label">Category:</span>
      <input type="text" class="markdown-input" v-model="category" required />
      <button @click="onSubmit" class="common-btn markdown-btn">submit</button>
    </form>
    <div class="markdown">
      <Markdown
        theme="dark"
        v-model="markdownBody"
        :height="markdownHeight"
      />
    </div>
  </div>
</template>

<script>
import store from '@/store/store';
import Markdown from 'vue-meditor';

export default {
  name: 'Add',
  components: {
    Markdown
  },
  data () {
    return {
      markdownHeight: document.body.clientHeight,
      sharedState: store.state,
      sidebarVisible: true,
      title: '',
      summary: '',
      category: '',
      markdownBody: ''
    }
  },
  methods: {
    onClickSidebar() {
      this.sidebarVisible = !this.sidebarVisible;
    },
    clearEditForm() {
      this.title = '';
      this.category = '';
      this.summary = '';
      this.markdownBody = '';
    },
    onSubmit() {
      if (!this.title || !this.markdownBody) {
        this.$alert('error', {title: 'Error', message: 'Title and content are required.'});
        return false;
      }
      const path = '/posts/';
      const payload = {
        title: this.title,
        summary: this.summary,
        category: this.category,
        body: this.markdownBody
      };
      this.$axios.post(path, payload)
        .then(res => {
          this.clearEditForm();
          this.$router.replace({path: '/blog'});
        })
        .catch(e => {
          this.$alert('error', {title: 'Error', message: e});
          console.error(e);
        });
    },
  }
}
</script>

<style scoped>
.markdown-edit {
  position: relative;
  width: 100%;
  height: 100%;
}
.markdown-sidebar {
  padding: 8px;
  height: 200px;
  position: fixed;
  top: 30px;
  left: 20%;
  z-index: 9999999;
  background-color: rgba(0, 0, 0, .2);
  animation: ease-in-out 1s;
}
.markdown-btn {
  position: absolute;
  bottom: 0;
  right: -20px;
}
.markdown-none-sidebar {
  cursor: pointer;
  position: fixed;
  top: 20px;
  right: 200px;
  z-index: 9999999;
  width: 50px;
  height: 50px;
  background-color: indianred;
  transform: rotate(-45deg);
}
.markdown-none-sidebar:before {
  content: "";
  z-index: 999;
  width: 50px;
  height: 50px;
  border-radius: 100%;
  position: absolute;
  top: -25px;
  background-color: indianred;
}
.markdown-none-sidebar:after {
  content: "";
  z-index: 999;
  width: 50px;
  height: 50px;
  position: absolute;
  right: -25px;
  border-radius: 100%;
  background-color: indianred;
}
.markdown-input {
  display: block;
  margin-left: 20px;
  padding: 4px 10px;
  line-height: 20px;
  font-size: 16px;
}
.markdown-input-label {
  padding-left: 20px;
}
</style>
