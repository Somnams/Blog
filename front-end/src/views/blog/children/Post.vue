<template>
  <div class="page">
    <nav-bar class="nav-bar" id="post-nav"/>
    <div>
      <header></header>
      <main class="main-content" v-if="post.author">
        <div class="post">
          <h1 id="post-title">{{post.title}}</h1>
          <div class="post-other">
            <div><img :src="imageData.iconzhucetouxiang" alt="" class="icon-img">{{post.author.username}}</div>
            <div><img :src="imageData.shijian" alt="" class="icon-img">{{post.timestamp}}</div>
            <div><img :src="imageData.chakancishu" alt="" class="icon-img">{{post.views}}</div>
          </div>
          <article>
            <markdown-preview
              :initialValue="post.body"
              theme="dark"
            />
            <br>
          </article>
          <confirm ref="confirm"/>
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
                :parent-id="parentId"
                :post-id="postId"
                :author-id="authorId"
                :author-name="authorName"
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
                  @onClickReply="onClickReply"
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
                      @onClickReply="onClickReply"
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
      parentId: 0,
      authorId: 0,
      authorName: '',
      postId: 0,
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
    onClickReply (comment) {
      this.parentId = comment.id;
      this.authorId = comment.post.author_id;
      this.authorName = comment.post.username;
    },
    refreshComment() {
      this.getPostComments();
    },
    onDeleteComment (comment) {
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

<style scoped>
  .post {
    margin-top: 50px;
  }
  .post-other {
    width: 100%;
    display: flex;
    margin-left: 60%;
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
