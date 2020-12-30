<template>
  <div>
    <header><h3></h3></header>
    <div class="admin-content">
      <div class="role-wrapper">
        <h3>Edit User</h3>
        <form @submit.prevent="onSubmit" class="addForm">
          <div v-if="user" class="add-row">
            <label>Username</label>
            <input type="text" id="username" :value="user.username"
                   class="add-input" disabled="">
          </div>
          <hr>
          <div class="add-row">
            <label>Confirmed</label>
            <div>
              <input type="checkbox" name="confirmed"
                     id="confirmed" v-model="checked" class="custom-checkbox">
              <div><i></i></div>
            </div>
          </div>
          <hr>
          <div class="add-row">
            <label>Role</label>
            <div>
              <label v-for="(role, index) in roles.items" :key="index">
                <input type="radio" name="role_id"
                       :id="role.id" class="custom-checkbox"
                       :value="role.id">
                {{ role.name }}
                <div><i></i></div>
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
