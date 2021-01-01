<template>
  <div class="page">
    <nav-bar class="nav-bar" id="post-nav"/>
    <div>
      <header></header>
      <main class="main-content" v-if="post.author">
        <div class="post">
          <h1 id="post-title">{{post.title}}</h1>
          <div id="post-other">
            <div><img :src="imageDatas.iconzhucetouxiang" alt="" class="icon-img">{{post.author.username}}</div>
            <div><img :src="imageDatas.shijian" alt="" class="icon-img">{{post.timestamp}}</div>
            <div><img :src="imageDatas.chakancishu" alt="" class="icon-img">{{post.views}}</div>
          </div>
          <article>
            <vue-markdown
              :source="post.body"
              :toc="showToc"
              :toc-first-level="1"
              :toc-last-level="3"/>
            <br>
          </article>
          <confirm ref="confirm"/>
          <reply ref="reply"/>
          <div class="operation" v-if="post.author.id == sharedState.user_id">
            <a @click="onDeletePost(post)" title="delete this post">
              <img :src="imageDatas.shanchu" alt="" class="icon-img"></a>
            <a @click="toEdit" title="edit this post">
              <img :src="imageDatas.bianji" alt="" class="icon-img"></a>
          </div>
          <!-- 评论区 -->
          <div class="comments">
            <div class="comments-title">
              <img :src="imageDatas.liuyan" alt="" class="icon-img">Comments
            </div>

            <form v-if="sharedState.is_authenticated" @submit.prevent="onSubmitAddComment"
                  @reset.prevent="onResetAddComment">
              <textarea v-model="commentsForm.body" class="commentsFormBody" cols="30" rows="10" placeholder="Please input your comment."></textarea>
              <small v-show="commentsForm.bodyError">{{commentsForm.bodyError}}</small>
              <div class="operation">
                <button class="icon-btn" type="submit">Submit</button>
                <button class="icon-btn" type="reset">Cancel</button>
              </div>
            </form>
            <div v-else>
              <router-link :to="{ path: '/login', query: { redirect: $route.fullPath } }">
                Please log in before commenting...
              </router-link>
            </div>
            <div v-if="comments" class="comments-detail">
              <div v-for="(comment, index) in comments.items" :key="index">
                <div :id="'c' + comment.id">
                  <div class="detail-body">
                    <div class="comment-img">
                      <img class="user-img" :src="comment.author.avatar"
                           :alt="comment.author.name || comment.author.username">
                    </div>
                    <div class="comment">
                      <div class="comment-title">
                        <span v-if="comment.author.id == comment.post.author_id">
                          <router-link :to="{ path: `/user/${comment.author.id }`}">
                            {{comment.author.username}}</router-link>&lt; author &gt;
                        </span>
                        <span v-else><router-link :to="{ path: `/user/${comment.author.id}`}">
                          {{comment.author.username}}</router-link></span>
                        <span>{{ $moment(comment.timestamp).format('YYYY-MM-DD HH:mm:ss') }}</span>
                      </div>
                      <div class="comment-body" v-if="comment.disabled">The comment has been disabled.</div>
                      <div v-else>
                        <div class="comment-body">{{comment.body}}</div>
                      </div>
                      <div class="comment-bottom">
                        <ul>
                          <li v-if="!comment.disabled">
                            <a @click="onLikeOrUnlike(comment)" title="likes">
                              <span v-if="comment.likers_id.length > 0">{{comment.likers_id.length}}person likes</span>
                              <span v-else><img :src="imageDatas.zantuijian" class="icon-img"></span>
                            </a>
                          </li>
                          <li v-if="!comment.disabled">
                            <a @click="onClickReply(comment)" title="reply">
                              <img :src="imageDatas.tubiaozhizuo-_1" class="icon-img">
                            </a>
                          </li>
                          <li v-if="!comment.disabled && post.author.id == sharedState.user_id">
                            <a @click="onDisabledComment(comment)" title="disabled">
                              <img :src="imageDatas.lahei" alt=""  class="icon-img">
                            </a>
                          </li>
                          <li v-if="comment .disabled && post.author.id == sharedState.user_id">
                            <a @click="onEnabledComment(comment)" title="enabled">
                              <img :src="imageDatas.kanjian" alt="" class="icon-img">
                            </a>
                          </li>
                          <li v-if="!comment.disabled && comment.author.id == sharedState.user_id || post.author.id == sharedState.user_id">
                            <a  @click="onDeleteComment(comment)">
                              <img :src="imageDatas.shanchu" alt="delete" title="delete" class="icon-img">
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- 子级评论，按时间正序排列 -->
                <div v-if="comment.descendants">
                  <div v-for="(child, cindex) in comment.descendants" :key="cindex">
                    <div :id="'c' + child.id">
                      <div class="detail-body comment-children">
                        <div class="comment-img">
                          <img class="user-img" :src="child.author.avatar" :alt="child.author.name || child.author.username">
                        </div>
                        <div class="comment">
                          <div class="comment-title">
                            <span v-if="child.author.id == child.post.author_id">
                              <router-link :to="{ path: `/user/${child.author.id }`}">{{child.author.username}}</router-link> <span>author</span>
                            </span>
                            <span v-else><router-link :to="{ path: `/user/${child.author.id}`}">{{child.author.username}}</router-link></span>
                            <span>{{ $moment(child.timestamp).format('YYYY-MM-DD HH:mm:ss') }}</span>
                          </div>
                          <div class="comment-body">
                            <div v-if="child.disabled">The comment has been disabled.</div>
                            <div v-else>
                              &nbsp;&nbsp;{{child.body}}
                            </div>
                          </div>
                          <div class="comment-bottom">
                            <ul>
                              <li v-if="!child.disabled">
                                <a @click="onLikeOrUnlike(child)" title="likes">
                                  <span v-if="child.likers_id.length > 0">{{child.likers_id.length}}人赞</span>
                                  <span v-else><img :src="imageDatas.zantuijian" class="icon-img"></span>
                                </a>
                              </li>
                              <li v-if="!child.disabled">
                                <a @click="onClickReply(child)">
                                  <img :src="imageDatas.tubiaozhizuo-_1" alt="" class="icon-img">
                                </a>
                              </li>
                              <li v-if="!child.disabled && post.author.id == sharedState.user_id">
                                <a @click="onDisabledComment(child)" title="disabled">
                                  <img :src="imageDatas.lahei" alt="" class="icon-img">
                                </a>
                              </li>
                              <li v-if="child.author.id == sharedState.user_id || post.author.id == sharedState.user_id">
                                <a @click="onDeleteComment(child)" title="delete">
                                  <img :src="imageDatas.shanchu" alt="" class="icon-img">
                                </a>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
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
import VueMarkdown from 'vue-markdown'
import hljs from 'highlight.js'

const highLightCode = () => {
  const blocks = document.querySelectorAll('pre code')
  blocks.forEach((block) => {
    hljs.highlightBlock(block)
  })
}

export default {
  name: 'Post',
  components: {
    NavBar,
    VueMarkdown,
    Confirm,
    Reply
  },
  data () {
    return {
      sharedState: store.state,
      imageDatas: store.state.imageData,
      showToc: true,
      post: {},
      comments: '',
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
  methods: {
    getPost (id) {
      const path = `/posts/${id}`
      this.$axios.get(path)
        .then((res) => {
          this.post = res.data
        })
        .catch((error) => {
          console.error(error)
        })
    },
    onDeletePost (post) {
      this.$refs.confirm.confirm()
        .then((res) => {
          const path = `/posts/${post.id}`
          this.$axios.delete(path)
            .then((res) => {
              // this.$toasted.error()
              this.$toasted.success('Delete success.', { icon: 'fingerprint' })
              if (typeof this.$route.query.redirect === 'undefined') {
                this.$router.push('/blog')
              } else {
                this.$router.push(this.$route.query.redirect)
              }
            })
        })
        // eslint-disable-next-line handle-callback-err
        .catch((err) => {
          console.log('this post is safity')
        })
    },
    getPostComments (id) {
      // eslint-disable-next-line no-unused-vars
      let page = 1
      // eslint-disable-next-line camelcase,no-unused-vars
      let per_page = 10
      if (typeof this.$route.query.page !== 'undefined') {
        page = this.$route.query.page
      }
      if (typeof this.$route.query.per_page !== 'undefined') {
        // eslint-disable-next-line camelcase
        per_page = this.$route.query.per_page
      }
      // eslint-disable-next-line camelcase
      const path = `/posts/${id}/comments/?page=${page}&per_page=${per_page}`
      this.$axios.get(path)
        .then((res) => {
          this.comments = res.data
        })
        .catch((error) => {
          console.error(error)
        })
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
        this.$toasted.error('You can comment with login...', { icon: 'fingerprint' })
        this.$router.replace({
          path: '/login',
          query: { redirect: this.$route.path + '#c' + comment.id }
        })
      }

      let path = ''
      // eslint-disable-next-line eqeqeq
      if (comment.likers_id.indexOf(this.sharedState.user_id) != -1) {
        path = `/comments/${comment.id}/unlike`
      } else {
        path = `/comments/${comment.id}/like`
      }
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
    const post_id = this.$route.params.id
    this.getPost(post_id)
    this.getPostComments(post_id)
  },
  mounted () {
    highLightCode();
  },
  updated () {
    highLightCode()
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
    margin-left: 80px;
  }
</style>
