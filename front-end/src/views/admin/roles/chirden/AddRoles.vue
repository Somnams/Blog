<template>
    <transition name="fade">
      <div v-if="isShow">
        <div class="add-roles">
          <header><h3>Add Role</h3></header>
          <form @submit.prevent="onSubmit" @reset.prevent="onClosed" class="addForm">
            <div class="add-row">
              <label for="slug">Slug</label>
              <input type="text" v-model="roleForm.slug" id="slug" placeholder="please input role's slug" class="add-input">
              <small>{{ roleForm.slugError }}</small>
            </div>
            <div class="add-row">
              <label for="name">Name</label>
              <input class="add-input" type="text" v-model="roleForm.name" id="name" placeholder="">
              <small>{{ roleForm.nameError }}</small>
            </div>
            <div class="add-row">
              <label>Permissions</label>
              <div>
                <label v-for="(perm, index) in perms" :key="index">
                  <input type="checkbox" :id="perm.dec" :value="perm.dec"
                         v-model="checkPerms" class="custom-checkbox">{{ perm.name }}
                  <div>
                    <i></i>
                  </div>
                </label>
              </div>
            </div>
            <button type="submit" class="icon-btn add-yesClick">Submit</button>
            <button type="reset" class="add-noClick">X</button>
          </form>
        </div>
      </div>
    </transition>
</template>

<script>
import store from '../../../../store/store'
export default {
  name: 'AddRoles',
  data () {
    return {
      sharedState: store.state,
      isShow: false,
      promiseStatus: null,
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
    addRoles () {
      const self = this
      this.isShow = true
      return new Promise((resolve, reject) => {
        self.promiseStatus = { resolve, reject }
      })
    },
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
          this.isShow = false
          this.promiseStatus && this.promiseStatus.resolve()
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
    },
    onClosed (e) {
      this.isShow = false
      this.promiseStatus && this.promiseStatus.reject()
    }
  },
  created () {
    this.getPerms()
  }
}
</script>

<style scoped>
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
  .add-roles {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 10;
  }
  .addForm {
    position: absolute;
    top: 10%;
    right: 0;
    left: 0;
    width: 80%;
    margin: 0 auto;
    background: #212121;
    border-radius: 20px;
    padding: 10px;
  }
  .add-noClick {
    position: absolute;
    top: 0;
    right: 0;
    background: transparent;
    border: none;
    color: #928bad;
    font-size: 20px;
    font-weight: bold;
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
  .add-yesClick {
    float: right;
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

  .custom-checkbox:focus {
    outline: none;
  }
</style>
