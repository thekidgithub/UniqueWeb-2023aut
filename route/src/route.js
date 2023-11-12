import { createRouter, createWebHistory } from 'vue-router'
import Home from './views/Home.vue'
import About1 from './views/About1.vue'
import About2 from './views/About2.vue'
import UserInfo from './views/UserInfo.vue'
import UserHome from './views/UserHome.vue'
import UserProfile from './views/UserProfile.vue'
import UserSettings from './views/UserSettings.vue'
import EmailSetting from './views/EmailSetting.vue'
import PasswordSetting from './views/PasswordSetting.vue'
import PasswordConfirm from './views/PasswordConfirm.vue'
import Login from './views/Login.vue'
import VerifyCode from './views/VerifyCode.vue'
import Store from './views/Store.vue'
import { useAuthStore } from './stores/store.js'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: Home,
      alias: '/home-alias'
    },
    {
      path: '/about',
      components: {
        About1,
        About2
      }
    },
    {
      path: '/home',
      redirect: '/'
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/verify-code',
      component: VerifyCode,
      beforeEnter: () => {
        const verifyCode = prompt('Enter the verify code');
        return verifyCode === '123' ? true : false;
      },
    },
    {
      path: '/store',
      component: Store
    },
    {
      path: '/:user/:id(\\d+)',
      component: UserInfo,
      name: 'userparent',
      children:
        [
          {
            path: '',
            name: 'userhome',
            component: UserHome
          },
          {
            path: 'profile',
            component: UserProfile
          },
          {
            path: 'settings',
            component: UserSettings,
            children:
              [
                {
                  path: 'email',
                  component: EmailSetting,
                  name: 'email'
                },
                {
                  path: 'password',
                  components:
                  {
                    PasswordSetting,
                    PasswordConfirm
                  },
                  name: 'password'
                }
              ]
          }
        ]
    },
  ],
})


router.beforeEach(async (to) => {
  const Auth = useAuthStore();
  if (!Auth.isAuthenticated && to.name !== 'Login') {
    alert('请先登陆');
    return { name: 'Login' }
  }
})

export default router
