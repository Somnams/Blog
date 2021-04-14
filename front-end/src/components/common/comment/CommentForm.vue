<template>
  <div>
    <form @submit.prevent="onSubmit">
      <input type="text" v-model="formData" class="cf-input">
      <button
        type="submit"
        :disabled="disabled"
        class="cf-btn"
      >
        submit
      </button>
    </form>
  </div>
</template>

<script>
import {debounce} from '@/common/utils';
export default {
  name: 'CommentForm.vue',
  props: {
    postId: {
      type: Number,
      required: true
    },
    parentId: {
      type: Number,
      default: 0
    },
    authorId: {
      type: Number,
      default: 0
    },
    authorName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      formData: '',
      disabled: true
    }
  },
  watch: {
    formData: function () {
      this.onChange();
    }
  },
  methods: {
    onChange: debounce(function () {
      if (this.formData) {
        this.disabled = false
      } else {
        this.disabled = true;
      }
    }, 500),
    onSubmit() {
      const path = '/comments/';
      const payload = this.parentId === 0 ? {
        body: this.formData,
        post_id: this.postId
      } : {
        body: `@ ${this.authorName} ${this.formData}`,
        post_id: this.postId,
        parent_id: this.parentId
      };
      this.$axios.post(path, payload)
        .then(() => {
          this.$toasted.success('Add a new comment.');
          this.$emit('addComment');
        })
        .catch((e) => {
          this.$toasted.error(`Error: ${e.message}`);
        })
        .finally(() => {
          this.formData = '';
        });
    }
  }
}
</script>

<style lang="scss" scoped>
$disabled: #f5f5f5;
$paddingLeft: 8px;
.cf-icon {
  padding-left: $paddingLeft;
}
.cf-btn {
  outline: none;
  border: 0;
  width: 100px;
  text-align: center;
  line-height: 30px;
  border-radius: 5px;
  transition: all .5s ease-out;
}
button[disabled] {
  background-color: $disabled;
}
.cf-input {
  width: 300px;
  line-height: 30px;
  padding: 0 $paddingLeft;
}

</style>
