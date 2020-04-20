<template>
    <div class="admin-content">
      Roles
      <div>
        role table
        <table class="table-reason">
          <thead>
            <tr>
              <th>#</th>
              <th>Slug</th>
              <th>Name</th>
              <th>Permissions</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
          <tr v-for="(role, index) in roles.items" :key="index">
            <th>{{index + 1}}</th>
            <td>{{ role.slug }}</td>
            <td>{{ role.name }}</td>
            <td>{{ role.permissions }}</td>
            <td>
              <router-link :to="{ name: 'AdminEditRoles', params: { id: role.id }}">
                <img src="../../../assets/icon-img/bianji.svg" alt="" title="edit this role" class="icon-img">
              </router-link>
              <a @click="onDeleteRole(role)">
                <img src="../../../assets/icon-img/shanchu.svg" alt="" title="delete" class="icon-img">
              </a>
            </td>
          </tr>
          </tbody>
        </table>
        <confirm ref="confirm"/>
        <div class="">
          <router-link :to="{ name: 'AdminAddRoles' }">Add Roles</router-link>
        </div>
      </div>
    </div>
</template>

<script>
import { confirmMiXin } from '../../../common/mixin'

export default {
  name: 'Role',
  data () {
    return {
      roles: ''
    }
  },
  mixins: [confirmMiXin],
  methods: {
    getRoles () {
      let page = 1
      // eslint-disable-next-line camelcase
      let per_page = 10
      if (typeof this.$route.query.page !== 'undefined') {
        page = this.$route.query.page
      }
      if (typeof this.$route.query.per_page !== 'undefined') {
        // eslint-disable-next-line camelcase
        per_page = this.$route.query.per_page
      }
      // eslint-disable-next-line camelcase
      const path = `/roles/?page=${page}&per_page=${per_page}`
      this.$axios.get(path)
        .then((res) => {
          this.roles = res.data
        })
        .catch((err) => {
          console.error(err)
        })
    },
    onDeleteRole (role) {
      this.$refs.confirm.confirm()
        .then((res) => {
          const path = `roles/${role.id}`
          this.$axios.delete(path)
            .then((response) => {
              this.$toasted.success('Delete successful.', { icon: 'fingerprint' })
              this.getRoles()
            })
            .catch((error) => {
              console.error(error)
            })
        })
        .catch((val) => {
          this.$toasted.success('The role is safe', { icon: 'fingerprint' })
        })
    }
  },
  created () {
    this.getRoles()
  }
}
</script>

<style scoped>
  @media screen and (min-width: 1400px) {
     table {
       margin:0 auto;
     }
  }
</style>
