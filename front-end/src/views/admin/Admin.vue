<template>
  <div class="page">
    <main>
      <div>
        <router-view></router-view>
        <div class="stage">
          <div class="circle-menu" :class="{ open: isOpen }">
            <a class="menu-trigger" data-open="OPEN" data-close="CLOSE" @click="onOpen"></a>
            <ul>
              <li><router-link :to="{ path: '/' }">
                <img src="../../assets/icon-img/github.svg" alt="" class="wi">
              </router-link></li>
              <li>
                <router-link :to="{ name: 'AdminRoles' }">
                  <img src="../../assets/icon-img/iconzhucetouxiang.svg" title="AdminRoles" class="wi">
                </router-link>
              </li>
              <li>
                <router-link :to="{ name: 'AdminUsers' }">
                  <img src="../../assets/icon-img/iconfuzhi.svg" title="AdminUsers" class="wi">
                </router-link>
              </li>
              <li>
                <router-link :to="{ name: 'AdminPosts' }">
                  <img src="../../assets/icon-img/wenzhangguanli.svg" title="AdminPosts" class="wi">
                </router-link>
              </li>
              <li>
                <router-link :to="{ name: 'AdminComments' }">
                  <img src="../../assets/icon-img/liuyan.svg" title="AdminComments" class="wi">
                </router-link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: 'Admin',
  data () {
    return {
      isOpen: false
    }
  },
  methods: {
    onOpen () {
      this.isOpen = !this.isOpen
    }
  }
}
</script>

<style scoped>
  .wi {
    width: 40px;
    padding: 0;
  }
  .stage {
    position: fixed;
    height: 300px;
    width: 30%;
    bottom: 0;
  }
  .circle-menu {
    position: absolute;
    height: 50px;
    width: 50px;
    display: inline-block;
    bottom: 30px;
    left: 30px;
  }
  .menu-trigger {
    position: absolute;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    top: 0;
    left: 0;
    background: #928bad;
    border: 2px solid transparent;
    background-clip: padding-box;
    transition: all 1s ease;
    text-align: center;
    z-index: 9;
  }
  .menu-trigger:before,
  .menu-trigger:after {
    position: absolute;
    left: 0;
    width: 50px;
    transition: all .85s ease;
  }
  .menu-trigger:before {
    content: attr(data-open);
  }
  .menu-trigger:after {
    content: attr(data-close);
    filter: alpha(opacity=0);
    opacity: 0;
    transform: translateY(15%);
  }
  .circle-menu ul {
    padding: 0;
    margin: 0;
  }
  .circle-menu ul li {
    text-align: center;
    position: absolute;
    width: 50px;
    height: 50px;
    display: inline-block;
    border-radius: 50%;
    background-clip: padding-box;
    /*background: #928bad;*/
    filter: alpha(opacity=0);
    opacity: 0;
    zoom: 1;
    transition: all 1s cubic-bezier(0, 1.8, 1, 1.2);
  }
  .circle-menu.open {
    top: 50%;
    left: 30%;
    background: #212121;
  }
  .circle-menu.open .menu-trigger {
    background: transparent;
    border-color: #928bad;
  }
  .circle-menu.open .menu-trigger:before {
    transform: translateY(-15%);
    filter: alpha(opacity=0);
    opacity: 0;
  }
  .circle-menu.open .menu-trigger:after {
    transform: translateY(0);
    filter: alpha(opacity=100);
    opacity: 1;
    zoom: 1;
  }
  .circle-menu.open ul li {
    filter: alpha(opacity=100);
    opacity: 1;
    zoom: 1;
  }
  .circle-menu.open ul li:nth-child(1) {
    transform: translateX(-100px) translateY(-100px);
  }
  .circle-menu.open ul li:nth-child(2) {
    transform: translateY(-100px);
  }
  .circle-menu.open ul li:nth-child(3) {
    transform: translateX(100px) translateY(-100px);
  }
  .circle-menu.open ul li:nth-child(4) {
    transform: translateX(100px);
  }
  .circle-menu.open ul li:nth-child(5) {
    transform: translateX(100px) translateY(100px);
  }
</style>
