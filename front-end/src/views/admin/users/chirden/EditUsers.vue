<template>
  <div class="admin-content">
    <h1>Edit User</h1>
    <form @submit.prevent="onSubmit">
      <div v-if="user">
        <h4>Username</h4>
        <input type="text" id="username" :value="user.username" disabled="">
      </div>
      <hr>
      <div>
        <h4>Confirmed</h4>
        <label>
          <input type="checkbox" name="confirmed" id="confirmed" v-model="checked">
          <div><i></i></div>
        </label>
      </div>
      <hr>
      <div>
        <h4>Role</h4>
        <div>
          <label v-for="(role, index) in roles.items" :key="index">
            <input type="radio" name="role_id" :id="role.id" :value="role.id">
            <div><i></i></div>
            {{ role.name }}
          </label>
        </div>
      </div>
      <button type="submit">Submit</button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'EditUsers',
  data () {
    return {
      user: null,
      roles: '',
      checked: false,
      picked: null
    }
  },
  methods: {
    getUser (id) {
      const path = `/users/${id}`
      this.$axios.get(path)
        .then((res) => {
          this.user = res.data
          this.checked = this.user.confirmed
          this.picked = this.user.role_id
        })
        .catch((err) => {
          console.error(err)
        })
    },
    getRoles () {
      let page = 1
      // eslint-disable-next-line camelcase
      let per_page = 5
      if (typeof this.$route.query.page !== 'undefined') {
        page = this.$route.query.page
      }
      if (typeof this.$route.query.per_page !== 'undefined') {
        // eslint-disable-next-line camelcase
        per_page = this.$route.query.per_page
      }
      // eslint-disable-next-line camelcase
      const path = `roles/?page=${page}&per_page=${per_page}`
      this.$axios.get(path)
        .then((res) => {
          this.roles = res.data
        })
        .catch((err) => {
          console.error(err)
        })
    },
    onSubmit (e) {
      const path = `users/${this.$route.params.id}`
      const payload = {
        confirmed: this.checked,
        role_id: this.picked
      }
      this.$axios.put(path, payload)
        .then((res) => {
          this.$toasted.success('Modify the user successful.', { icon: 'fingerprint' })
          this.$router.push({ name: 'AdminUsers' })
        })
        .catch((err) => {
          console.log(err)
        })
    }
  },
  created () {
    // eslint-disable-next-line camelcase
    const user_id = this.$route.params.id
    this.getUser(user_id)
    this.getRoles()
  }
}
</script>

<style scoped>

</style>
