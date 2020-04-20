<template>
    <div class="admin-content">
      <div>
        user
      </div>
      <table class="table-reason">
        <thead>
        <tr>
          <th>#</th>
          <th>User</th>
          <th>Role</th>
          <th>Confirmed</th>
          <th>Action</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(user, index) in users.items" :key="index">
          <th>{{index + 1}}</th>
          <td>{{ user.username }}</td>
          <td>{{ user.role_name }}</td>
          <td>
            <i v-if="user.confirmed">Y</i>
            <i v-else>X</i>
          </td>
          <td>
            <router-link :to="{name: 'AdminEditUsers', params: {id: user.id}}">
              <img src="../../../assets/icon-img/bianji.svg" alt="" class="icon-img" title="edit this user">
            </router-link>
            <a @click="onDeleteUser(user)">
              <img src="../../../assets/icon-img/shanchu.svg" alt="" class="icon-img" title="delete this user">
            </a>
          </td>
        </tr>
        </tbody>
      </table>
      <confirm ref="confirm"/>
    </div>
</template>

<script>
import { confirmMiXin } from '../../../common/mixin'

export default {
  name: 'Users',
  data () {
    return {
      users: ''
    }
  },
  mixins: [confirmMiXin],
  methods: {
    getUsers () {
      let page = 1
      // eslint-disable-next-line camelcase
      let per_page = 5
      if (typeof this.$route.query.page !== 'undefined') {
        page = this.$route.query.page
      }
      if (typeof this.$route.query.per_page !== 'undefined') {
        // eslint-disable-next-line camelcase,no-const-assign
        per_page = this.$route.query.per_page
      }
      // eslint-disable-next-line camelcase
      const path = `/users/?page=${page}&per_page=${per_page}`
      this.$axios.get(path)
        .then((res) => {
          this.users = res.data
        })
        .catch((error) => {
          console.error(error)
        })
    },
    onDeleteUser (user) {
      this.$refs.confirm.confirm()
        .then((res) => {
          const path = `users/${user.id}`
          this.$axios.delete(path)
            .then((res) => {
              this.$toasted.success('Delete this user', { icon: 'fingerprint' })
              this.getUsers()
            })
            .catch((err) => {
              console.log(err.response.data)
              this.$toasted.error(err.response.data.message, { icon: 'fingerprint' })
            })
        })
        // eslint-disable-next-line handle-callback-err
        .catch((error) => {
          this.$toasted.success('This user is safe', { icon: 'fingerprint' })
        })
    }
  },
  created () {
    this.getUsers()
  }
}
</script>

<style scoped>
</style>
