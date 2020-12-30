<template>
    <div>
      <header><h3></h3></header>
      <div class="admin-content">
        <div class="role-wrapper">
          <h3>Roles' Table</h3>
          <table class="table-reason" cellpadding="0" cellspacing="0">
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
                <router-link :to="{ name: 'AdminEditRoles', params: { id: role.id } }">
                  <img :src="imageDatas.bianji" title="edit" class="icon-img">
                </router-link>
                <a @click="onDeleteRole(role)">
                  <img :src="imageDatas.shanchu" title="delete" class="icon-img">
                </a>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
        <confirm ref="confirm"/>
        <div class="add-btn">
          <button class="admin-btn" @click="onAddRoles">Add</button>
          <add-roles ref="add"/>
        </div>
      </div>
    </div>
</template>

<script>
import { confirmMiXin } from '@/common/mixin'
import store from '@store/store'
import AddRoles from './chirden/AddRoles'

export default {
  name: 'Role',
  components: {
    AddRoles
  },
  data () {
    return {
      roles: '',
      isShow: false,
      imageDatas: store.state.imageData
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
    },
    onAddRoles () {
      this.$refs.add.addRoles()
        .then((res) => {
          this.$toasted.success('Add success', { icon: 'fingerprint' })
        })
        .catch((err) => {
          console.log(err)
        })
    }
  },
  created () {
    this.getRoles()
  }
}
</script>

<style scoped>
  .add-btn {
    position: absolute;
    right: 50px;
  }
</style>
