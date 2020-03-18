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
import RecivedComments from '../views/profile/children/Comments/RecivedComments'
import Add from '../components/common/addPost/Add'
import AddLife from '../components/common/addPost/AddLife'
import Index from '../views/profile/children/Message/Index'
import MessageList from '../views/profile/children/Message/MessageList'
import Unconfirmed from '../views/login/auth/Unconfirmed'
import ResetPasswordRequest from '../views/login/auth/ResetPasswordRequest'
import Demo from '../components/Demo'
import ResetPassword from '../views/login/auth/ResetPassword'
import Admin from '../views/admin/Admin'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: '/', name: Home, component: Home },
    { path: '/register', name: Register, component: Register },
    { path: '/unconfirmed', name: Unconfirmed, component: Unconfirmed, meta: { requiresAuth: true } },
    { path: '/reset-password-request', name: ResetPasswordRequest, component: ResetPasswordRequest },
    { path: '/reset-password', name: ResetPassword, component: ResetPassword },
    { path: '/login', name: Login, component: Login },
    { path: '/edit-profile', name: EditProfile, component: EditProfile, meta: { requiresAuth: true } },
    { path: '/blog', name: Blog, component: Blog, meta: { requiresAuth: true } },
    { path: '/blog/post/:id', name: Post, component: Post, meta: { requiresAuth: true } },
    { path: '/life', name: Life, component: Life },
    { path: '/life/diary/:id', name: Passage, component: Passage, meta: { requiresAuth: true } },
    { path: '/user/:id', name: Mine, component: Mine, meta: { requiresAuth: true } },
    { path: '/receive-comments', name: RecivedComments, component: RecivedComments },
    { path: '/add', name: Add, component: Add, meta: { requiresAuth: true } },
    { path: '/test/:id', name: Demo, component: Demo, meta: { requiresAuth: true } },
    { path: '/add-life', name: AddLife, component: AddLife, meta: { requiresAuth: true } },
    { path: '/message', name: Index, component: Index, meta: { requiresAuth: true } },
    { path: '/message/list', name: MessageList, component: MessageList, meta: { requiresAuth: true } },
    { path: '/admin', name: Admin, component: Admin, meta: { requiresAuth: true } }
  ]
})

router.beforeEach((to, from, next) => {
  const token = window.localStorage.getItem('madblog-token')
  if (token) {
    var payload = JSON.parse(atob(token.split('.')[1]))
  }
  if (to.matched.some(record => record.meta.requiresAuth) && (!token)) {
    Vue.toasted.show('Please log in to access this page.', { icon: 'fingerprint' })
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  } else if (token && payload.confirmed === false && to.path !== '/unconfirmed') {
    Vue.toasted.show('Please confirm your account this page', { icon: 'fingerprint' })
    next({
      path: '/unconfirmed',
      query: { redirect: to.fullPath }
    })
  } else if (token && payload.confirmed === true && to.path === '/unconfirmed') {
    next({
      path: '/'
    })
  } else if (token && (to.path === '/login' || to.path === '/register' || to.name === 'ResetPassword')) {
    next({
      path: from.fullPath
    })
  } else if (to.matched.length === 0) {
    Vue.toasted.error('404:Not Found', { icon: 'fingerprint' })
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
