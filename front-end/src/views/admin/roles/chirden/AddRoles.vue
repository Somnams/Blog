<template>
    <div class="admin-content">
      <h1>Add Role</h1>
      <form @submit.prevent="onSubmit">
        <div>
          <label for="slug">Slug</label>
          <input type="text" v-model="roleForm.slug" id="slug" placeholder="please input role's slug">
          <small>{{ roleForm.slugError }}</small>
        </div>
        <div>
          <label for="name">Name</label>
          <input type="text" v-model="roleForm.name" id="name" placeholder="">
          <small>{{ roleForm.nameError }}</small>
        </div>
        <div>
          <label for="permissions">Permissions</label>
          <div>
            <label v-for="(perm, index) in perms" :key="index">
              <input type="checkbox" :id="perm.dec" :value="perm.dec" v-model="checkPerms">{{ perm.name }}
              <div>
                <i></i>
              </div>
              {{ perm.name }}
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
  name: 'AddRoles',
  data () {
    return {
      sharedState: store.state,
      roleForm: {
        slug: '',
        name: '',
        permission: [],
        errors: 0,
        slugError: null,
        nameError: null
      },
      perms: null,
      checkPerms: []
    }
  },
  methods: {
    getPerms () {
      const path = '/roles/perms'
      this.$axios.get(path)
        .then((res) => {
          this.perms = res.data
        })
        .catch((error) => {
          console.error(error)
        })
    },
    onSubmit (e) {
      this.roleForm.errors = 0
      if (!this.roleForm.slug) {
        this.roleForm.errors++
        this.roleForm.slugError = 'Slug required.'
      } else {
        this.roleForm.slugError = null
      }
      if (!this.roleForm.name) {
        this.roleForm.errors++
        this.roleForm.nameError = 'Role name required.'
      } else {
        this.roleForm.nameError = null
      }
      if (this.roleForm.errors > 0) {
        return false
      }
      const path = '/roles'
      const payload = {
        slug: this.roleForm.slug,
        name: this.roleForm.name,
        permissions: this.checkPerms
      }
      this.$axios.post(path, payload)
        .then((res) => {
          this.$toasted.success('Add a new role', { icon: 'fingerprint' })
          this.$router.push({ name: 'AdminRoles' })
        })
        .catch((error) => {
          for (const field in error.response.data.message) {
            if (field === 'slug') {
              this.roleForm.slugError = error.response.data.message[field]
            } else if (field === 'name') {
              this.roleForm.nameError = error.response.data.message[field]
            } else {
              this.$toasted.error(error.response.data.message[field], { icon: 'fingerprint' })
            }
          }
        })
    }
  },
  created () {
    this.getPerms()
  }
}
</script>

<style scoped>

</style>
