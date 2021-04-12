<template>
  <div class="page">
    <nav-bar class="nav-bar" id="post-nav"/>
    <div>
      <header></header>
      <main class="main-content" v-if="post.author">
        <div class="post">
          <h1 id="post-title">{{post.title}}</h1>
          <div id="post-other">
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
          <reply ref="reply"/>
          <div class="operation" v-if="post.author.id == sharedState.user_id">
            <a @click="onDeletePost(post)" title="delete this post">
              <img :src="imageData.shanchu" alt="" class="icon-img"></a>
            <a @click="toEdit" title="edit this post">
              <img :src="imageData.bianji" alt="" class="icon-img"></a>
          </div>
          <!-- 评论区 -->
          <div class="comments">
            <div v-if="sharedState.is_authenticated">
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
                      :comment="child" class="comment-children"
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
import Reply from '@/components/common/comment/Reply'
import store from '@/store/store'

import {MarkdownPreview} from 'vue-meditor';
import CommentsList from '@components/common/comment/CommentsList';
import CommentForm from '@components/common/comment/CommentForm';


export default {
  name: 'Post',
  components: {
    NavBar,
    Confirm,
    Reply,
    MarkdownPreview,
    CommentsList,
    CommentForm
  },
  data () {
    return {
      sharedState: store.state,
      showToc: true,
      post: {},
      comments: '',
      parentId: 0,
      authorId: 0,
      authorName: '',
      postId: 0,
      commentsForm: {
        body: '',
        author_id: '',
        parent_id: '',
        author_name: '',
        errors: 0,
        bodyError: null
      }
    }
  },
  computed: {
    imageData() {
      return store.state.imageData;
    }
  },
  methods: {
    getPost(id) {
      const path = `/posts/${id}`;
      this.$axios.get(path)
        .then(({data}) => {
          this.post = data;
        })
        .catch(e => {
          console.ror(e);
        });
    },
    onDeletePost(post) {
      this.$refs.confirm.confirm()
        .then(() => {
          const path = `/posts/${post.id}`;
          this.$axios.delete(path)
            .then(res => {
              // TODO:: Toasted!
              this.$toasted.success('Delete success.', {icon: 'fingerprint'});
              const redirect = this.$route.query.redirect;
              if (redirect === 'undefined') {
                this.$router.push('/blog');
              } else {
                this.$router.push(redirect);
              }
            });
        })
        .catch(() => {
          return false;
        });
    },
    getPostComments (id) {
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
    onResetAddComment () {
      this.commentsForm.body = ''
      this.commentsForm.parent_id = ''
      this.commentsForm.author_id = ''
      this.commentsForm.author_name = ''
      this.commentsForm.bodyError = null
    },
    onSubmitAddComment (e) {
      this.commentsForm.errors = 0
      if (!this.commentsForm.body) {
        this.commentsForm.error++
        this.commentsForm.bodyError = 'Body is required.'
      } else {
        this.commentsForm.bodyError = null
      }

      if (this.commentsForm.errors > 0) {
        return false
      }

      const path = '/comments/'
      let payload = ''
      if (this.commentsForm.parent_id) {
        // 说明是回复评论
        // eslint-disable-next-line camelcase
        const at_who = `<a href="/user/${this.commentsForm.author_id}">@${this.commentsForm.author_name}</a>`
        payload = {
          // eslint-disable-next-line camelcase
          body: at_who + this.commentsForm.body,
          post_id: this.$route.params.id,
          parent_id: this.commentsForm.parent_id
        }
      } else {
        // 说明是发表一级评论
        payload = {
          body: this.commentsForm.body,
          post_id: this.$route.params.id
        }
      }

      this.$axios.post(path, payload)
        .then((res) => {
          this.getPostComments(this.$route.params.id)
          this.$toasted.success('Successed add a new comment', { icon: 'fingerprint' })
          this.onResetAddComment()
        })
        .catch((err) => {
          console.log(err.res.data)
          this.$toasted.error(err.res.data.message, { icon: 'fingerprint' })
        })
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
          this.getPostComments(this.$route.params.id)
          this.$toasted.success(res.data.message, { icon: 'fingerprint' })
        })
        .catch((error) => {
          console.error(error.res.data)
          this.$toasted.error(error.res.data.message, { icon: 'fingerprint' })
        })
    },
    onClickReply (comment) {
      if (!this.sharedState.is_authenticated) {
        this.$toasted.error('You should login', { icon: 'fingerprint' })
        this.$router.replace({
          path: '/login',
          query: { redirect: this.$route.path + '#c' + comment.id }
        })
      } else {
        this.$refs.reply.confirm()
          .then((res) => {
            this.parentId = comment.id;
            this.authorId = comment.post.author_id;
            this.authorName = comment.author.username;
            this.commentsForm.parent_id = comment.id
            this.commentsForm.author_id = comment.post.author_id
            this.commentsForm.author_name = comment.author.username
            const Form = this.$refs.reply.Form
            const path = '/comments/'
            // 回复评论
            // eslint-disable-next-line camelcase
            const at_who = `@${this.commentsForm.author_name}  `
            const payload = {
              // eslint-disable-next-line camelcase
              body: at_who + Form.body,
              post_id: this.$route.params.id,
              parent_id: this.commentsForm.parent_id
            }

            this.$axios.post(path, payload)
              .then((res) => {
                this.getPostComments(this.$route.params.id)
                this.$toasted.success('Successed add a new comment', { icon: 'fingerprint' })
                this.onResetAddComment()
              })
              .catch((err) => {
                console.log(err.res.data)
                this.$toasted.error(err.res.data.message, { icon: 'fingerprint' })
              })
            // eslint-disable-next-line handle-callback-err
          }).catch(err => { console.log('this box is cloesed') })
      }
    },
    refreshComment() {
      this.getPostComments(this.$route.params.id);
    },
    onResetReply () {
      console.log('reset')
    },
    onDeleteComment (comment) {
      this.$refs.confirm.confirm()
        .then((res) => {
          const path = `/comments/${comment.id}`
          this.$axios.delete(path)
            .then((res) => {
              this.getPostComments(this.$route.params.id)
            })
            .catch((error) => {
              console.error(error)
            })
        })
        // eslint-disable-next-line handle-callback-err
        .catch((err) => {
          console.log('the comment is safe.')
        })
    },
    onDisabledComment (comment) {
      this.$refs.confirm.confirm()
        .then((res) => {
          const path = `/comments/${comment.id}`
          this.$axios.put(path, { disabled: true })
            .then((res) => {
              this.getPostComments(this.$route.params.id)
            })
            .catch((error) => {
              console.error(error)
            })
        })
    },
    onEnabledComment (comment) {
      const path = `/comments/${comment.id}`
      this.$axios.put(path, { disabled: false })
        .then((response) => {
          this.getPostComments(this.$route.params.id)
        })
        .catch((error) => {
          console.error(error)
        })
    },
    toEdit () {
      this.$router.push('/test/' + this.$route.params.id)
    }
  },
  created () {
    // eslint-disable-next-line camelcase
    this.postId = Number(this.$route.params.id);
    const post_id = this.$route.params.id
    this.getPost(post_id)
    this.getPostComments(post_id)
  }
}
</script>

<style scoped>
  .post {
    margin-top: 50px;
  }
  #post-other {
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
  .comments-title {}
  .commentsFormBody {
    padding: 20px;
    width: 90%;
    border: 2px solid rgba(0, 0, 0, 0);
    height: 60px;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.1);
  }
  .commentsFormBody:focus {
    outline: none;
    background: rgba(0, 0, 0, 0);
    border: 2px solid rgba(255, 255, 255, 0.5);
    transition: all 0.5s ease-in-out;
  }
  textarea {
    color: #fff;
  }
  .comments-detail {
    width: 100%;
    margin-top: 100px;
  }
  .detail-body {
    margin-bottom: 20px;
    display: flex;
  }
  .comment-img {
  }
  .comment {
    width: 90%;
    margin-left: 30px;
    border: 1px #ddd solid;
    border-radius: 8px;
    display: inline-block;
  }
  .comment-title {
    margin-left: 20px;
    -webkit-box-orient: horizontal;
    border-bottom: 1px #928bad solid;
  }
  .comment-title span {
    margin-right: 20px;
  }
  .comment-body {
    margin-left: 20px;
  }
  .comment-bottom {
    float: right;
  }
  ul li {
    display: inline;
    margin-right: 15px;
  }
  .comment-children {
    margin-left: 33px;
  }
</style>
