<template>
    <div class="page">
      <nav-bar class="nav-bar"/>
      <header>
        <h2>Edit Your Profile</h2>
      </header>
      <div class="main-content" id="edit-content">
        <div>
          <form @submit.prevent="onSubmit" class="edit-form">
            <div class="edit-clo">
              <label for="location" class="edit-label">location</label>
              <input type="text" required id="location" v-model="profileForm.location" class="edit-input">
            </div>
            <div class="edit-clo">
              <label for="birthday" class="edit-label">birthday</label>
              <input type="date" id="birthday" class="edit-input">
            </div>
            <div class="edit-clo">
              <label for="about_me" class="edit-label">about</label>
              <textarea name="" id="about_me" cols="30" rows="10"
                        class="edit-input" v-model="profileForm.about_me" required></textarea>
            </div>
            <button type="submit" class="edit-btn common-btn">Submit</button>
          </form>
        </div>
      </div>
    </div>
</template>

<script>
import store from '../../../../store/store'
import NavBar from '../../../../components/common/nav/NavBar'
export default {
  name: 'EditProfile',
  components: {
    NavBar
  },
  data () {
    return {
      sharedState: store.state,
      profileForm: {
        location: '',
        // birthday: '',
        about_me: '',
        submitted: false
      }
    }
  },
  methods: {
    onSubmit (e) {
      // eslint-disable-next-line camelcase
      const user_id = this.sharedState.user_id
      // eslint-disable-next-line camelcase
      const path = `/users/${user_id}`
      const payload = {
        name: this.profileForm.name,
        location: this.profileForm.location,
        // birthday: this.profileForm.birthday,
        about_me: this.profileForm.about_me
      }
      this.$axios.put(path, payload)
        .then((response) => {
          this.$toasted.success('Success modify your profile.', { icon: 'fingerprint' })
          this.$router.push({
            name: 'Mine',
            params: { id: user_id }
          })
        })
        .catch((err) => {
          console.error(err)
        })
    }
  }
}
</script>

<style scoped>
  #edit-content {
    clear: both;
    top: 50px;
  }
  .edit-form {
    width: 80%;
  }
  .edit-clo {
    width: 100%;
    display: flex;
    margin: 30px;
  }
  .edit-label {
    font-size: 20px;
    padding: 5px;
    width: 100px;
    text-align: center;
    height: 40px;
  }
  .edit-input {
    padding: 10px;
    width: 80%;
  }
  .edit-btn {
    width: 160px;
  }
</style>
