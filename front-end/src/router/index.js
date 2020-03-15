import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/home/Home'
import Login from '../views/login/Login'
import Register from '../views/register/Register'
import Blog from '../views/blog/Blog'
import Life from '../views/life/Life'
import Mine from '../views/profile/Mine'
import EditProfile from '../views/profile/children/edit/EditProfile'
import Post from '../views/blog/children/Post'
import Passage from '../views/life/children/Passage'
import Notifications from '../views/profile/children/Notifications/Notifications'
import Add from '../components/common/addPost/Add'
import AddLife from '../components/common/addPost/AddLife'
import Index from '../views/profile/children/Message/Index'
import MessageList from '../views/profile/children/Message/MessageList'
import Demo from '../components/Demo'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: '/', name: Home, component: Home, meta: { requiresAuth: true } },
    { path: '/register', name: Register, component: Register },
    { path: '/login', name: Login, component: Login },
    { path: '/edit-profile', name: EditProfile, component: EditProfile, meta: { requiresAuth: true } },
    { path: '/blog', name: Blog, component: Blog },
    { path: '/blog/post/:id', name: Post, component: Post, meta: { requiresAuth: true } },
    { path: '/life', name: Life, component: Life },
    { path: '/life/diary/:id', name: Passage, component: Passage, meta: { requiresAuth: true } },
    { path: '/user/:id', name: Mine, component: Mine },
    { path: '/notice', name: Notifications, component: Notifications },
    { path: '/add', name: Add, component: Add, meta: { requiresAuth: true } },
    { path: '/test/:id', name: Demo, component: Demo, meta: { requiresAuth: true } },
    { path: '/add-life', name: AddLife, component: AddLife, meta: { requiresAuth: true } },
    { path: '/message', name: Index, component: Index, meta: { requiresAuth: true } },
    { path: '/message/list', name: MessageList, component: MessageList, meta: { requiresAuth: true } }
  ]
})

router.beforeEach((to, from, next) => {
  const token = window.localStorage.getItem('madblog-token')
  if (to.matched.some(record => record.meta.requiresAuth) && (!token || token === null)) {
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  } else if (token && to.name === 'Login') {
    next({
      path: from.fullPath
    })
  } else if (to.matched.length === 0) {
    console.log('here')
    Vue.toasted.error('404: NOT FOUND', { icon: 'fingerprint' })
    if (from.name) {
      next({
        name: from.name
      })
    } else {
      next({
        path: '/'
      })
    }
  } else {
    next()
  }
})

export default router
