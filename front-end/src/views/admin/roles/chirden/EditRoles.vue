<template>
  <div>
    <header><h3></h3></header>
    <div class="admin-content">
      <div class="role-wrapper">
        <h3>Edit Roles</h3>
        <form @submit.prevent="onSubmit" class="addForm">
          <div class="add-row">
            <label for="slug">Slug</label>
            <input type="text" v-model="roleForm.slug"
                   id="slug" placeholder="please input role's slug"
                   class="add-input">
            <small>{{ roleForm.slugError }}</small>
          </div>
          <div class="add-row">
            <label for="name">Name</label>
            <input class="add-input" type="text" v-model="roleForm.name"
                   id="name" placeholder="">
            <small>{{ roleForm.nameError }}</small>
          </div>
          <div class="add-row">
            <label>Permissions</label>
            <div>
              <label v-for="(perm, index) in perms" :key="index">
                <input type="checkbox" :id="perm.dec" :value="perm.dec"
                       v-model="checkPerms" class="custom-checkbox">
                {{ perm.name }}
                <div>
                  <i></i>
                </div>
              </label>
            </div>
          </div>
          <button type="submit" class="admin-btn">Submit</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import store from '@/store/store'
export default {
  name: 'EditRoles',
  data () {
    return {
      sharedState: store.state,
      roleForm: {
        slug: '',
        name: '',
        permissions: [],
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
        .catch((err) => {
          console.log(err)
        })
    },
    getRole (id) {
      const path = `/roles/${id}`
      this.$axios.get(path)
        .then((res) => {
          this.roleForm.slug = res.data.slug
          this.roleForm.name = res.data.name
          this.checkPerms = res.data.perms
        })
        .catch((err) => {
          console.log(err)
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
        this.roleForm.nameError = 'Name required.'
      } else {
        this.roleForm.nameError = null
      }
      if (this.roleForm.errors > 0) {
        return false
      }
      const path = `/roles/${this.$route.params.id}`
      const payload = {
        slug: this.roleForm.slug,
        name: this.roleForm.name,
        permissions: this.checkPerms
      }
      this.$axios.put(path, payload)
        .then((res) => {
          this.$toasted.success('Modified the role successfully.', { icon: 'fingerprint' })
          this.$route.push({ name: 'AdminRoles' })
        })
        .catch((err) => {
          for (const field in err.response.data.message) {
            if (field === 'slug') {
              this.roleForm.slugError = err.response.data.message[field]
            } else if (field === 'name') {
              this.roleForm.nameError = err.response.data.message[field]
            } else {
              this.$toasted.error(err.response.data.message[field], { icon: 'fingerprint' })
            }
          }
        })
    }
  },
  created () {
    this.getPerms()
    // eslint-disable-next-line camelcase
    const role_id = this.$route.params.id
    this.getRole(role_id)
  },
  beforeRouteUpdate (to, from, next) {
    next()
    this.getPerms()
    this.getRole(to.params.id)
  }
}
</script>

<style scoped>
  .addForm {
    width: 80%;
    margin: 0 auto;
    padding: 10px;
  }
  .add-row {
    width: 80%;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
  }
  .add-row > label {
    font-weight: bold;
    margin-left: 10px;
  }
  .add-input {
    padding: 10px;
    width: 80%;
  }
  .custom-checkbox {
    margin-left: 20px;
  }

  .custom-checkbox {
    -webkit-appearance: none;
    background-color: rgba(255, 255, 255, 0.1);
    padding: 8px;
    border-radius: 2px;
    display: inline-block;
    position: relative;
    top: 6px;
  }

  .custom-checkbox:checked {
    background-color: #928bad;
  }

  .custom-checkbox:checked:after {
    content: '\2714';
    font-size: 10px;
    position: absolute;
    top: 1px;
    left: 4px;
    color: #fff;
  }
</style>
