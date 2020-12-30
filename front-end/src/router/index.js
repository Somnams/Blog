import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '@/views/home/Home';
import Login from '@/views/login/Login';
import Register from '@/views/register/Register';
import Blog from '@/views/blog/Blog';
import Life from '@/views/life/Life';
import Mine from '@/views/profile/Mine';
import EditProfile from '@/views/profile/children/edit/EditProfile';
import Account from '@/views/profile/children/edit/Account';
import Post from '@/views/blog/children/Post';
import Passage from '@/views/life/children/Passage';
import Add from '@/components/common/addPost/Add';
import AddLife from '@/components/common/addPost/AddLife';
import Unconfirmed from '@/views/login/auth/Unconfirmed';
import ResetPasswordRequest from '@/views/login/auth/ResetPasswordRequest';
import MessageHistory from '@/components/common/comment/MessageHistory';
import ResetPassword from '@/views/login/auth/ResetPassword';
import SearchResult from '@/components/SearchResult';

import Admin from '@/views/admin/Admin';
import Comments from '@/views/admin/comments/Comments';
import Posts from '@/views/admin/posts/Posts';
import Roles from '@/views/admin/roles/Roles';
import EditRoles from '@/views/admin/roles/chirden/EditRoles';
import Users from '@/views/admin/users/Users';
import EditUsers from '@/views/admin/users/chirden/EditUsers';

import Notification from '@/views/notification/Notification';
import RecivedComments from '@/views/notification/Comments/RecivedComments';
import CommentsLikes from '@/views/notification/Comments/CommentsLikes';
import MessageList from '@/views/notification/Message/MessageList';
import List from '@/views/notification/Message/List';
import Index from '@/views/notification/Message/Index';

import About from '@/views/about/About';

// TODO::ALert Test
import Dome from '@/components/common/alert/Dome'

Vue.use(VueRouter);

const router = new VueRouter({
  routes: [
    // TODO:: TEST ALert
    {path: '/alert', name: 'Dome', component: Dome},
    { path: '/', name: 'Home', component: Home },
    { path: '/register', name: 'Register', component: Register },
    { path: '/unconfirmed', name: 'Unconfirmed', component: Unconfirmed, meta: { requiresAuth: true } },
    { path: '/reset-password-request', name: 'ResetPasswordRequest', component: ResetPasswordRequest },
    { path: '/reset-password', name: 'ResetPassword', component: ResetPassword },
    { path: '/login', name: 'Login', component: Login },
    { path: '/edit-profile', name: 'EditProfile', component: EditProfile, meta: { requiresAuth: true } },
    { path: '/change-password', name: 'Account', component: Account, meta: { requiresAuth: true } },
    { path: '/blog', name: 'Blog', component: Blog },
    { path: '/blog/post/:id', name: 'Post', component: Post },
    { path: '/life', name: 'Life', component: Life },
    { path: '/life/diary/:id', name: 'Passage', component: Passage },
    { path: '/user/:id', name: 'Mine', component: Mine, meta: { requiresAuth: true } },
    {
      path: '/send-messages',
      name: 'MessagesHistoryResource',
      component: MessageHistory,
      meta: { requiresAuth: true },
    },
    // { path: '/receive-comments', name: 'ReceivedComments', component: RecivedComments },
    { path: '/add', name: 'Add', component: Add, meta: { requiresAuth: true } },
    { path: '/add-life', name: 'AddLife', component: AddLife, meta: { requiresAuth: true } },
    { path: '/search', name: 'SearchResult', component: SearchResult },
    // ADMIN
    {
      path: '/admin',
      component: Admin,
      children: [
        { path: '', component: Roles },
        { path: 'roles', name: 'AdminRoles', component: Roles },
        { path: 'edit-roles', name: 'AdminEditRoles', component: EditRoles },
        { path: 'users', name: 'AdminUsers', component: Users },
        { path: 'edit-users', name: 'AdminEditUsers', component: EditUsers },
        { path: 'posts', name: 'AdminPosts', component: Posts },
        { path: 'comments', name: 'AdminComments', component: Comments },
      ],
      meta: {
        requiresAuth: true,
        requiresAdmin: true,
      },
    },
    // Notification
    {
      path: '/notification',
      component: Notification,
      children: [
        { path: '', component: RecivedComments },
        { path: 'received-comments', name: 'ReceivedComments', component: RecivedComments },
        { path: 'received-comments-likes', name: 'CommentsLikes', component: CommentsLikes },
        {
          path: 'messages',
          component: Index,
          children: [
            { path: '', name: 'MessageIndex', component: List },
            { path: 'history', name: 'MessageList', component: MessageList },
          ],
        },
      ],
      meta: {
        requiresAuth: true,
      },
    },
    { path: '/about-us', name: 'About', component: About },
  ],
});

router.beforeEach((to, from, next) => {
  const token = window.localStorage.getItem('madblog-token');
  let payload = null;
  let user_perms = null;
  if (token) {
    payload = JSON.parse(atob(token.split('.')[1]));
    user_perms = payload.permissions.split(',');
  }
  if (to.matched.some(record => record.meta.requiresAuth) && !token) {
    Vue.toasted.show('Please log in to access this page.', { icon: 'fingerprint' });
    next({
      path: '/login',
      query: { redirect: to.fullPath },
    });
  } else if (token && payload.confirmed === false && to.path !== '/unconfirmed') {
    Vue.toasted.show('Please confirm your account this page', { icon: 'fingerprint' });
    next({
      path: '/unconfirmed',
      query: { redirect: to.fullPath },
    });
  } else if (token && payload.confirmed === true && to.path === '/unconfirmed') {
    next({
      path: '/',
    });
  } else if (token && (to.path === '/login' || to.path === '/register' || to.name === 'ResetPassword')) {
    next({
      path: from.fullPath,
    });
  } else if (to.matched.some(record => record.meta.requiresAdmin && token && !user_perms.includes('admin'))) {
    Vue.toasted.error('403: Forbidden', { icon: 'fingerprint' });
    next({
      path: '/',
    });
  } else if (to.matched.length === 0) {
    Vue.toasted.error('404:Not Found', { icon: 'fingerprint' });
    if (from.name) {
      next({
        name: from.name,
      });
    } else {
      next({
        path: '/',
      });
    }
  } else {
    next();
  }
});

export default router;
