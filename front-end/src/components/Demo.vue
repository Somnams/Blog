<template>
  <div class="mark-edit">
    <form @submit.prevent="onSubmitUpdate">
      <div class="mark-header">
        <div class="left">
          <span>Title</span>
          <input type="text" class="text" :value="editForm.title">
        </div>
        <div class="right">
          <span>Summary</span>
          <input type="text" class="text" :value="editForm.summary">
        </div>
      </div>
      <mavon-editor :ishljs="true" :value="editForm.body"/>
      <button class="mark-button">submit</button>
    </form>
    <div class="tip">
      *你可以点击编辑器的菜单栏进入全屏模式哦～编写完成后记得提交吖～
    </div>
  </div>
</template>

<script>
import store from '../store/store'
import hljs from 'highlight.js'
const highLightCode = () => {
  const blocks = document.querySelectorAll('pre code')
  blocks.forEach((block) => {
    hljs.highlightBlock(block)
  })
}

export default {
  name: 'About',
  data () {
    return {
      sharedState: store.state,
      post: {},
      editForm: {
        title: '',
        summary: '',
        body: '',
        errors: 0,
        titleError: null,
        bodyError: null
      }
    }
  },
  methods: {
    getPost (id) {
      const path = `/posts/${id}`
      this.$axios.get(path)
        .then((res) => {
          this.post = res.data
          this.editForm = Object.assign({}, this.post)
        })
        .catch((err) => {
          console.error(err)
        })
    },
    onSubmitUpdate (e) {
      this.editForm.errors = 0
      const path = `/posts/${this.$route.params.id}`
      const payload = {
        title: this.editForm.title,
        summary: this.editForm.summary,
        body: this.editForm.body
      }

      this.$axios.put(path, payload)
        .then((res) => {
          console.log('put created Ok.')
          // this.getPost(this.editForm.id)
          this.getPost(this.$route.params.id)
          this.editForm.title = ''
          this.editForm.summary = ''
          this.editForm.body = ''
        })
        .catch((err) => {
          console.error(err)
        })
    }
  },
  created () {
    // eslint-disable-next-line camelcase
    const edit_id = this.$route.params.id
    this.getPost(edit_id)
  },
  mounted () {
    highLightCode()
  },
  updated () {
    highLightCode()
  }
}
</script>

<style scoped>
  .text {
    margin-left: 10px;
    width: 300px;
    height: 20px;
    padding: 10px;
    outline: none;
    border: 2px solid rgba(0, 0, 0, 0);
    background: rgba(255, 255, 255, 0.2);
    border-radius: 10px;
    color: #fff;
    transition: all 0.5s ease-in-out;
  }
  .text:focus {
    border: 2px solid rgba(255, 255, 255, 0.5);
    background: rgba(0, 0, 0, 0);
  }
  .mark-header {
    display: flex;
    margin: 20px;
  }
  .left {
    flex: 1;
  }
  .right {
    flex: 1;
  }
  span {
    font-size: 28px;
    font-weight: bold;
  }
  .mark-button {
    width: 20%;
    margin-left: 40%;
    margin-top: 50px;
    height: 40px;
    border-radius: 20px;
    background: #948e99;
    border: none;
    color: #fff;
    font-size: 18px;
    transition: all 0.5s ease-in-out;
  }
  .mark-button:hover {
    cursor: pointer;
    transform: scale(1.1);
  }
  .tip {
    opacity: 0.4;
    color: #ee9ca7;
    margin: 100px 0 0 100px;
  }
</style>
