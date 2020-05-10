<template>
  <div>
    <header>
      <h3>List of messages</h3>
    </header>
    <div class="main-content">
      <div v-for="(item, index) in messages.items" :key="index">
        <div v-if="item" class="msg-row">
          <router-link :to="{ path: `/user/${item.sender.id}` }">
            <img :src="item.sender._links.avatar" alt="" class="user-img">
          </router-link>
          {{item.sender.username}}
          <small  v-if="item.new_count">send you {{item.new_count}} messages</small>
          <div class="msg-bottom">
            <span class="icon-font">{{$moment(item.timestamp).format('YYYY/MM/DD HH:mm:ss')}}</span>
            <ul class="msg-options">
              <li v-if="!item.is_blocking">
                <a @click="onBlock(item.sender.id)"><img src="../../../assets/icon-img/lahei.svg" alt="" class="icon-img">Disabled</a>
              </li>
              <li v-else>
                <a @click="onEnable(item.sender.id)">
                  <img src="../../../assets/icon-img/kanjian.svg" alt="" class="icon-img">Enabled
                </a>
              </li>
              <li>
                <router-link :to="{ name:'MessagesHistoryResource', query: { from: item.sender.id }}">
                  <img src="../../../assets/icon-img/wenzhangguanli.svg" alt="" class="icon-img">Chat
                </router-link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <confirm ref="confirm"/>
      <div v-if="messages && messages._meta.total_pages > 1">
        <pagination :per-page="messages._meta.per_page"
                    :cur-page="messages._meta.page"
                    :total-pages="messages._meta.total_pages"/>
      </div>
    </div>
  </div>
</template>

<script>
import store from '../../../store/store'
import { confirmMiXin } from '../../../common/mixin'
import Pagination from '../../../components/common/pagination/Pagination'

export default {
  name: 'List',
  components: {
    Pagination
  },
  data () {
    return {
      sharedState: store.state,
      messages: ''
    }
  },
  mixins: [confirmMiXin],
  methods: {
    getUserMessagesSenders (id) {
      const page = 1
      // eslint-disable-next-line camelcase
      const per_page = 5
      // eslint-disable-next-line camelcase
      const path = `/users/${id}/messages-senders/?page=${page}&per_page=${per_page}`
      this.$axios.get(path)
        .then((res) => {
          this.messages = res.data
          console.log(res.data)
        })
        .catch((err) => {
          console.error(err)
        })
    },
    onBlock (id) {
      this.$refs.confirm.confirm()
        .then((res) => {
          const path = `/block/${id}`
          this.$axios.get(path)
            .then((response) => {
              this.$toasted.success('Blocking success', { icon: 'fingerprint' })
              this.getUserMessagesSenders(this.sharedState.user_id)
            })
            .catch((err) => {
              console.error(err)
            })
        })
        .catch((e) => {
          console.log(e)
        })
    },
    onEnable (id) {
      this.$refs.confirm.confirm()
        .then((res) => {
          const path = `/unblock/${id}`
          this.$axios.get(path)
            .then((res) => {
              this.$toasted.success('Unblock success', { icon: 'fingerprint' })
              this.getUserMessagesSenders(this.sharedState.user_id)
            })
            .catch((err) => {
              console.error(err)
            })
        })
        .catch((r) => {
          console.log(r)
        })
    }
  },
  created () {
    this.getUserMessagesSenders(this.sharedState.user_id)
  }
}
</script>

<style scoped>
  .msg-row {
    position: relative;
    top: 20px;
    width: 80%;
    border-bottom: 1px #928bad dashed;
  }
  .msg-options {
    display: inline-flex;
    position: absolute;
    right: 30px;
  }
</style>
