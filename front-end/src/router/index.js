import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home'
import Register from '../views/Register'
import Login from '../views/Login'
import EditProfile from '../components/EditProfile'
import Blog from '../components/common/Blog'
import Life from '../components/common/Life'
import Mine from '../components/common/Mine'
import Add from '../views/Add'
import Post from '../components/Post'
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
    { path: '/user/:id', name: Mine, component: Mine, meta: { requiresAuth: true } },
    { path: '/add', name: Add, component: Add, meta: { requiresAuth: true } },
    { path: '/test/:id', name: Demo, component: Demo, meta: { requiresAuth: true } }
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
