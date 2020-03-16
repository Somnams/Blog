<template>
    <div class="edit">
      <header>Edit Your Profile</header>
      <div class="main">
        <form @submit.prevent="onSubmit" class="edit">
<!--          <label for="user_avatar">Update Avatar</label>-->
<!--          <input type="file" id="user_avatar" class="edit-input">-->
          <label for="name" class="edit-label">Real Name</label>
          <input type="text" v-model="profileForm.name" id="name" class="edit-input">
          <br>
          <br>
          <label for="location" class="edit-label">Location</label>
          <input type="text" v-model="profileForm.location" id="location" class="edit-input">
          <br>
          <br>
          <label for="about_me" class="edit-label">About Me</label>
          <textarea v-model="profileForm.about_me" cols="30" rows="10"
                    id="about_me" class="edit-textarea edit-input"></textarea>
          <br>
          <button class="common-btn edit-btn">submit</button>
          <br>
        </form>
      </div>
    </div>
</template>

<script>
import store from '../../../../store/store'

export default {
  name: 'EditProfile',
  data () {
    return {
      sharedState: store.state,
      profileForm: {
        name: '',
        location: '',
        about_me: '',
        submitted: false
      }
    }
  },
  methods: {
    getUser (id) {
      const path = `users/${id}`
      this.$axios.get(path)
        .then((response) => {
          this.profileForm.name = response.data.name
          this.profileForm.location = response.data.localClose
          this.profileForm.about_me = response.data.about_me
        })
        .catch((error) => {
          console.log(error)
        })
    },
    onSubmit (e) {
      // eslint-disable-next-line camelcase
      const user_id = this.sharedState.user_id
      // eslint-disable-next-line camelcase
      const path = `/users/${user_id}`
      const payload = {
        name: this.profileForm.name,
        location: this.profileForm.location,
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
    },
    create () {
      // eslint-disable-next-line camelcase
      const user_id = this.sharedState.user_id
      console.log(user_id)
      this.getUser(user_id)
    }
  }
}
</script>

<style scoped>
  .main {
    margin: 30px auto;
    width: 50%;
    /*background: linear-gradient(180deg, #00223e, #000);*/
    border-radius: 6px;
    animation: bgmove 2s ease infinite;
  }

  @keyframes bgmove {
    0% {
      background-position: 0% 0%;
    }
    50% {
      background-position: 50% 100%;
    }
    100% {
      background-position: 100% 0%;
    }
  }
  .edit {
    width: 100%;
    margin-top: 30px;
    display: flex;
    flex-direction: column;
  }
  .edit-label {
    font-size: 26px;
    font-weight: bold;
    margin-left: 15%;
    margin-bottom: 8px;
  }
  .edit-input {
    padding-left: 20px;
    border: 2px solid rgba(0, 0, 0, 0);
    width: 70%;
    height: 30px;
    margin-left: 15%;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.1);
  }
  .edit-input:focus {
    outline: none;
    background: rgba(0, 0, 0, 0);
    border: 2px solid rgba(255, 255, 255, 0.5);
    transition: all 0.5s ease-in-out;
  }
  .edit-textarea {
    height: 200px;
  }
  input[type="text"],
  textarea {
    color: #fff;
  }
  .edit-btn {
    width: 40%;
    margin: 0 auto;
    height: 40px;
    font-size: 18px;
  }
</style>
