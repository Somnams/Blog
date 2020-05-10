<template>
    <div>
      <header>
        <h3>Comments-likes</h3>
      </header>
      <div class="main-content">
        <div v-if="likes">
          <div v-for="(like, index) in likes.items" :key="index">
            <div v-if="like">
              <div v-if="like.comment.disabled">
                This comment is disabled.
              </div>
              <div class="like-row" v-else>
                <div>
                  <img src="../../../assets/icon-img/zantuijian.svg" alt="" class="icon-img">
                  <span  class="like-person">{{like.user.username}}</span>... {{like.comment.likers_id.length}} persons like
                </div>
                <div class="like-comment">
                  <router-link :to="{ path: `/blog/post/${like.comment.post.id}#c${like.comment.id}` }">
                    <img src="../../../assets/icon-img/kanjian.svg" alt="" title="check comment" class="icon-img">
                  </router-link>
                  <span class="icon-font">{{$moment(like.timestamp).format('YYYY/MM/DD HH:mm:ss')}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="likes && likes._meta.total_pages > 1">
          <pagination :per-page="likes._meta.per_page"
                      :cur-page="likes._meta.page"
                      :total-pages="likes._meta.total_pages"/>
        </div>
      </div>
    </div>
</template>

<script>
import Pagination from '../../../components/common/pagination/Pagination'
import store from '../../../store/store'
export default {
  name: 'CommentsLikes',
  components: {
    Pagination
  },
  data () {
    return {
      sharedState: store.state,
      likes: ''
    }
  },
  methods: {
    getUserReceivedCommentsLikes (id) {
      const page = 1
      // eslint-disable-next-line camelcase
      const per_page = 10
      // eslint-disable-next-line camelcase
      const path = `/users/${id}/recived-comments-likes/?page=${page}&per_page=${per_page}`
      this.$axios.get(path)
        .then((res) => {
          this.likes = res.data
        })
        .catch((err) => {
          console.error(err)
        })
    }
  },
  created () {
    this.getUserReceivedCommentsLikes(this.sharedState.user_id)
  }
}
</script>

<style scoped>
  .like-row {
    position: relative;
    display: inline-flex;
    width: 100%;
    margin: 10px;
    border-bottom: 1px #928bad dashed;
  }
  .like-comment {
    position: absolute;
    right: 0;
  }
  .like-person {
    font-weight: bold;
    padding: 10px;
  }
</style>
