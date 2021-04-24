<template>
  <div class="sidebar">
    <div class="sidebar-header">
      <img src="@/assets/user.jpeg" alt="" class="sidebar-header-icon">
      <router-link
        :to="{path: `/user/${userId}`}"
        class="sidebar-header-username"
      >
        {{username}}
      </router-link>
    </div>
    <ul class="sidebar-ul">
      <li
        v-for="(item, index) in list"
        :key="index"
        :class="{'active-class': curIndex === index}"
        @click="onClickMenu(index)"
      >
        <router-link :to="item.href">{{item.name}}</router-link>
      </li>
      <li v-if="isAdmin">
        <router-link to="/admin">
          Admin
        </router-link>
      </li>
    </ul>

  </div>
</template>

<script>
import store from '@store/store';

export default {
  name: 'NavBar',
  data() {
    return {
      isAdmin: false,
      sharedState: store.state,
      userId: store.state.user_id,
      username: store.state.user_name,
      list: [
        {name: 'Blog', href: '/blog'},
        {name: 'Essay', href: '/life'}
      ],
      curIndex: 0
    }
  },
  created () {
    this.isAdmin = this.sharedState.is_authenticated && this.sharedState.user_perms.includes('admin');
  },
  methods: {
    onClickMenu(index) {
      this.curIndex = index;
    }
  }
}

</script>

<style lang="scss" scoped>
$color: #434343;
.sidebar {
  font-size: 18px;
  font-weight: bold;
  &-header {
    width: 100%;
    margin-top: 33px;
    text-align: center;
    &-icon {
      width: 80%;
      border-radius: 8px;
    }
    &-username {
      font-size: 16px;
    }
  }
  &-ul {
    padding: 0;
    width: 100%;
    margin-top: 50px;
    .active-class {
      background: $color;
    }
    li {
      padding: 5px 0;
      border-bottom: 1px solid $color;
      text-align: center;
    }
  }
}
</style>
