<template>
  <div class="page">
    <nav-bar class="nav-bar" id="post-nav"/>
    <div>
      <header></header>
      <main class="main-content" v-if="post.author">
        <div class="post">
          <div class="post-header">
            <h1 class="post-title">{{post.title}}</h1>
            <div class="post-other">
              <img :src="imageData.iconzhucetouxiang" alt="" class="icon-img post-other-icon"><span class="post-other-font">{{post.author.username}}</span>
              <img :src="imageData.shijian" alt="" class="icon-img post-other-icon"><span class="post-other-font">{{post.timestamp}}</span>
              <img :src="imageData.chakancishu" alt="" class="icon-img post-other-icon"><span class="post-other-font">{{post.views}}</span>
            </div>
          </div>
          <article>
            <markdown-preview
              :initialValue="post.body"
              theme="dark"
            />
            <br>
          </article>
          <confirm ref="confirm" :content="confirmMsg"/>
          <div class="operation" v-if="post.author.id == sharedState.user_id">
            <a @click="onDeletePost(post)" title="delete this post">
              <img :src="imageData.shanchu" alt="" class="icon-img"></a>
            <router-link :to="{path: '/post-operation/edit', query: {id: postId}}" title="edit this post">
              <img :src="imageData.bianji" alt="" class="icon-img">
            </router-link>
          </div>
          <!-- 评论区 -->
          <div class="comments">
            <div v-if="sharedState.is_authenticated">
              <img :src="imageData.liuyan" alt="" class="icon-img cf-icon">Comments Area
              <comment-form
                :post-id="postId"
                @addComment="refreshComment"
              />
            </div>
            <div v-else>
              <router-link :to="{path: '/login', query: {redirect: $route.fullPath}}">
                Please login before commenting...
              </router-link>
            </div>
<!--            show comments-->
            <div v-if="comments" class="comments-detail">
              <div v-for="(comment, index) in comments.items" :key="index">
                <comments-list
                  :comment="comment"
                  @onLikeOrUnlike="onLikeOrUnlike"
                  @addComment="getPostComments"
                  @onDisabledComment="onDisabledComment"
                  @onEnabledComment="onEnabledComment"
                  @onDeleteComment="onDeleteComment"
                />
                <div v-if="comment.descendants">
                  <div v-for="(child, cIndex) in comment.descendants" :key="cIndex">
                    <comments-list
                      class="comment-children"
                      :comment="child"
                      @onLikeOrUnlike="onLikeOrUnlike"
                      @addComment="getPostComments"
                      @onDisabledComment="onDisabledComment"
                      @onEnabledComment="onEnabledComment"
                      @onDeleteComment="onDeleteComment"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <br>
      <br>
    </div>
  </div>
</template>

<script>
import NavBar from '@/components/common/nav/NavBar'
import Confirm from '@/components/common/confirm/Confirm'
import store from '@/store/store'

import {MarkdownPreview} from 'vue-meditor';
import CommentsList from '@components/common/comment/CommentsList';
import CommentForm from '@components/common/comment/CommentForm';


export default {
  name: 'Post',
  components: {
    NavBar,
    Confirm,
    MarkdownPreview,
    CommentsList,
    CommentForm
  },
  data () {
    return {
      sharedState: store.state,
      post: {},
      comments: '',
      postId: 0,
      confirmMsg: ''
    }
  },
  computed: {
    imageData() {
      return store.state.imageData;
    }
  },
  created () {
    this.postId = Number(this.$route.params.id);
    this.getPost(this.postId);
    this.getPostComments();
  },
  methods: {
    getPost(id) {
      const path = `/posts/${id}`;
      this.$axios.get(path)
        .then(({data}) => {
          this.post = data;
        })
        .catch(e => {
          this.$toasted.error(e);
          console.error(e);
        });
    },
    onDeletePost(post) {
      this.$refs.confirm.confirm()
        .then(() => {
          const path = `/posts/${post.id}`;
          this.$axios.delete(path)
            .then(res => {
              // TODO:: Toasted!
              this.$toasted.success('Delete success.');
              this.$router.replace(this.$route.query.redirect || '/blog');
            });
        })
        .catch(() => {
          return false;
        });
    },
    getPostComments () {
      const id = this.postId;
      const page = typeof this.$route.query.page === 'undefined' ? 1 : this.$route.query.page;
      const perPage = typeof this.$route.query.per_page === 'undefined' ? 10 : this.$route.query.per_page;
      const path = `/posts/${id}/comments/?page=${page}&per_page=${perPage}`;
      this.$axios.get(path)
        .then(({data}) => {
          this.comments = data;
        })
        .catch(e => {
          console.error(e);
          this.$toasted.error('Get comments Error.', {icon: 'fingerprint'});
        });
    },
    onLikeOrUnlike (comment) {
      if (!this.sharedState.is_authenticated) {
        this.$toasted.error('Please login...');
        this.$router.replace({
          path: '/login',
          query: {redirect: this.$route.path}
        });
      }
      const path = `/comments/${comment.id}` + (comment.likers_id.includes(this.userId) ? '/unlike' : '/like');
      this.$axios.get(path)
        .then((res) => {
          this.getPostComments();
          this.$toasted.success(res.data.message, { icon: 'fingerprint' })
        })
        .catch((error) => {
          this.$toasted.error(error.message);
        })
    },
    refreshComment() {
      this.getPostComments();
    },
    onDeleteComment (comment) {
      this.confirmMsg = 'Delete ?';
      this.$refs.confirm.confirm()
        .then((res) => {
          const path = `/comments/${comment.id}`;
          this.$axios.delete(path)
            .then((res) => {
              this.getPostComments();
            })
            .catch((error) => {
              this.$toasted.error(error.message);
            });
        })
        .catch(() => {
          return;
        });
    },
    onDisabledComment (comment) {
      this.confirmMsg = 'Disabled ?';
      this.$refs.confirm.confirm()
        .then((res) => {
          const path = `/comments/${comment.id}`;
          this.$axios.put(path, { disabled: true })
            .then((res) => {
              this.$toasted.success('Disabled this comment');
              this.getPostComments();
            })
            .catch((error) => {
              this.$toasted.info(error.message);
            });
        })
        .catch(() => {return ;});
    },
    onEnabledComment (comment) {
      const path = `/comments/${comment.id}`;
      this.$axios.put(path, { disabled: false })
        .then((res) => {
          this.$toasted.success('Enabled this comment');
          this.getPostComments();
        })
        .catch((error) => {
          this.$toasted.error(error.message);
        });
    },
    // TODO:: to Edit
    toEdit () {
      this.$router.push('/test/' + this.$route.params.id)
    }
  }
}
</script>

<style lang="scss" scoped>
  .post {
    margin-top: 50px;
  }
  .post-header {
    width: 100%;
    display: flex;
    height: 100px;
    .post-title {
      flex: 1
    }
    .post-other {
      flex: 1;
      margin-top: 30px;
      font-size: 14px;
      display: inline-flex;
      justify-content: flex-end;
      .post-other-icon {
        margin-top: -30px;
      }
    }
  }
  .operation {
    float: right;
  }
  .operation a {
    margin-right: 50px;
  }
  .comments {
    width: 100%;
    margin-top: 50px;
  }
  .comments-detail {
    width: 100%;
    margin-top: 100px;
  }
  .comment-title span {
    margin-right: 20px;
  }
  .comment-children {
    margin-left: 33px;
  }
</style>
