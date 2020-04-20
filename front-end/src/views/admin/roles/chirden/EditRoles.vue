<template>
    <div class="admin-content">
      <h1>Edit Role</h1>
      <form @submit.prevent="onSubmit">
        <div>
          <label for="slug">Slug</label>
          <input type="text" id="slug" v-model="roleForm.slug">
          <small>{{ roleForm.slugError }}</small>
        </div>
        <div>
          <label for="name">Name</label>
          <input type="text" id="name" v-model="roleForm.name">
          <small>{{ roleForm.nameError }}</small>
        </div>
        <div>
          <label for="permissions"></label>
          <div>
            <label v-for="(perm, index) in perms" :key="index">
              <input type="checkbox" :id="perm.dec" :value="perm.dec" v-model="checkPerms">{{perm.name}}
            </label>
          </div>
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
</template>

<script>
import store from '../../../../store/store'
export default {
  name: 'EditRoles',
  data () {
    return {
      sharedState: store.state,
      roleForm: {
        slug: '',
        name: '',
        errors: 0,
        slugError: null,
        nameError: null,
        permissions: []
      },
      perms: null,
      checkPerms: []
    }
  },
  methods: {
    getPerms () {
      const path = 'roles/perms'
      this.$axios.get(path)
        .then((res) => {
          this.perms = res.data
        })
        .catch((err) => {
          console.log(err)
        })
    },
    getRole (id) {
      const path = `roles/${id}`
      this.$axios.get(path)
        .then((res) => {
          this.roleForm.slug = res.data.slug
          this.roleForm.name = res.data.name
          this.checkPerms = res.data.perms
        })
        .catch((error) => {
          console.error(error)
        })
    },
    onSubmit (e) {
      this.roleForm.errors = 0
      if (!this.roleForm.slug) {
        this.roleForm.slugError = 'Slug required.'
        this.roleForm.errors++
      }
      if (!this.roleForm.name) {
        this.roleForm.nameError = 'name required.'
        this.roleForm.errors++
      }
      if (this.roleForm.errors > 0) {
        return false
      }
      const path = `roles/${this.$route.params.id}`
      const payload = {
        slug: this.roleForm.slug,
        name: this.roleForm.name,
        permissions: this.checkPerms
      }
      this.$axios.put(path, payload)
        .then((res) => {
          this.$toasted.success('modify role', { icon: 'fingerprint' })
          this.$router.push({ name: 'AdminRoles' })
        })
        .catch((error) => {
          for (const field in error.response.data.message) {
            if (field === 'slug') {
              this.roleForm.slug = error.response.data.message[field]
            } else if (field === 'name') {
              this.roleForm.name = error.response.data.message[field]
            } else {
              this.$toasted.error('error', { icon: 'fingerprint' })
            }
          }
        })
    }
  },
  create () {
    this.getPerms()
    // eslint-disable-next-line camelcase
    const role_id = this.$route.params.id
    this.getRole(role_id)
  },
  beforeRouteUpdate (to, from, next) {
    next()
    this.getPerms()
    this.getRoles(to.params.id)
  }
}
</script>

<style scoped>

</style>
