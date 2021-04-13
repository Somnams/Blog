<template>
  <div v-if="comment">
    <ul class="comment">
      <li class="comment-header">
        <router-link :to="{path: `/user/${comment.author.id}`}">
          <img class="comment-avatar" :src="comment.author.avatar" alt="avatar">
          <span class="comment-username">{{comment.author.username}}</span>
          <span v-if="comment.author.id === comment.post.author_id">(author)</span>
        </router-link>
        <span class="comment-timestamp">{{$moment(comment.timestamp).format('YYYY-MM-DD HH:mm:ss')}}</span>
      </li>
      <li class="comment-body">
        <div v-if="comment.disabled">
          This comment has been disabled.
        </div>
        <div v-else>{{comment.body}}</div>
      </li>
      <li class="comment-footer">
        <a v-if="!comment.disabled" @click="onLikeOrUnlike(comment)">
          <img :src="imageData.zantuijian" alt="like" class="icon-img">
          <span v-if="comment.likers_id.length > 0">{{comment.likers_id.length}}</span>
        </a>
        <a v-if="!comment.disabled" @click="onClickReply(comment)">
          <img :src="imageData.replay" alt="reply" class="icon-img">
        </a>
        <a v-if="!comment.disabled && authorId === userId" @click="onDisabledComment(comment)">
          <img :src="imageData.lahei" alt="disabled" class="icon-img">
        </a>
        <a v-if="comment.disabled && authorId === userId" @click="onEnabledComment(comment)">
          <img :src="imageData.kanjian" alt="able" class="icon-img">
        </a>
        <a v-if="!comment.disabled && comment.author.id === userId || authorId === userId" @click="onDeleteComment(comment)">
          <img :src="imageData.shanchu" alt="delete" class="icon-img">
        </a>
      </li>
      <li class="comment-reply" v-if="false">
        <comment-form
          :post-id="postId"
          :parent-id="parentId"
          :author-name="authorName"
          :author-id="authorId"
        />
      </li>
    </ul>
  </div>
</template>
<script>
import store from '@store/store';
import CommentForm from '@components/common/comment/CommentForm';
export default {
  name: 'CommentsList',
  components: {CommentForm},
  data() {
    return {
      isReply: false,
      parentId: 0,
      authorName: '',
      userId: store.state.user_id
    }
  },
  computed: {
    imageData() {
      return store.state.imageData;
    },
    authorId() {
      return this.comment.post.author_id;
    }
  },
  props: {
    comment: {
      type: Object,
      default() {
        return {};
      }
    },
    postId: {
      type: Number,
      default: 0
    }
  },
  methods: {
    onLikeOrUnlike (comment) {
      this.$emit('onLikeOrUnlike', comment);
    },
    onDisabledComment(comment) {
      this.$emit('onDisabledComment', comment);
    },
    onEnabledComment(comment) {
      this.$emit('onEnabledComment', comment);
    },
    onDeleteComment(comment) {
      this.$emit('onDeleteComment', comment);
    },
    onClickReply(comment) {
      this.isReply = !this.isReply;
      this.parentId = comment.id;
      this.authorName = comment.post.username;
      this.$emit('onClickReply', comment);
    }
  }
}

</script>

<style lang="scss" scoped>
.comment {
  width: 100%;
  rder-left: 2px solid rgba(255, 255, 255, .4);
  .comment-header {
    padding: 0 10px 0 10px;
    line-height: 24px;
    .comment-username {
      font-weight: 500;
    }
    .comment-timestamp {
      float: right;
      color: #8590a6;
      font-size: 14px;
    }
  }
  .comment-body {
    padding-left: 33px;
    line-height: 1.6;
    word-break: break-word;
    margin-bottom: 4px;
  }
  .comment-footer {
    display: flex;
    justify-content: flex-end;
  }
  .comment-reply {
    border-top: 1px #8590a6 solid;
    border-bottom: #8590a6 1px solid;
  }
}
</style>
